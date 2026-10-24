import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
import {synthesizeLearningNeeds,themes} from "@/app/exercises/ld-synthesis";

type Turn={role:"user"|"assistant";content:string};
type Decision={action?:string;needs?:string[];question?:string;options?:string[];context?:string;understanding?:string;reason?:string;reply?:string};
const validKeys=new Set<string>(themes.map(t=>t.key));
const coachingInstruction=`Tu es un conseiller expert en Learning & Development d'InterviewLab Academy. Tu dois conduire une conversation intelligente, pas un questionnaire à choix de catégories. Lis toute la conversation en français, mais la DERNIÈRE demande fait foi pour les nouvelles priorités. Identifie toutes les difficultés explicitement exprimées, mais n’infère PAS de stress, motivation, communication, négociation ou leadership du seul intitulé de poste. Tu NE CHOISIS PAS les parcours, l'architecte L&D s'en charge.
Ta sortie est EXCLUSIVEMENT un objet JSON valide avec "action" ("answer", "clarify" ou "recommend"), "needs" (tableau de clés parmi: ${[...validKeys].join(", ")}), "question" et "options" (2 à 4 phrases courtes si clarification), "context" (poste et contexte connus, sans supposer les missions), "understanding" (une phrase naturelle montrant ce que tu as compris), "reason" (justification pédagogique brève), "reply" (réponse conversationnelle pertinente, sans dépasser 140 mots).
Règles : Un intitulé de fonction ne prouve PAS des lacunes du candidat. « Staffing Manager » en SSII/ESN couvre parfois allocation des consultants, suivi des disponibilités, coordination commerciale, arbitrage de ressources ; ne signifie PAS management hiérarchique. Avant de prescrire un programme à partir de ce seul titre, demande ce que couvre le poste ou quel aspect le candidat souhaite préparer. Ne présume jamais ses compétences, son expérience ni les missions exactes. Quand le candidat donne son expérience antérieure, identifie les compétences transférables sans inventer ses accomplissements. "entretien technique de responsable commercial" signifie sales, PAS technical. La clé technical est réservée aux compétences réellement informatiques, data ou ingénierie logicielle. « entretien technique » décrit seulement une modalité et ne prouve aucune difficulté technique IT. "soft skills" + "qualités défauts" sont des compétences comportementales, pas uniquement STAR. "et pour les soft skills ?" ajoute la compétence, conserve le cadre RH/DRH et ne répète pas la même recommandation sans l'adapter.
Quand le candidat demande UNIQUEMENT une explication sur un métier, une méthode ou une question, choisis "answer" et réponds de façon concrète et nuancée dans reply, puis éventuellement une question facultative. Si le candidat demande de PRÉPARER un entretien, de S’ENTRAÎNER, un PROGRAMME ou un PARCOURS, choisis "recommend" si les compétences suffisent, et "clarify" sinon. Ne transforme pas chaque demande en parcours. Quand tu ne connais pas les missions du poste, présente des hypothèses en les signalant, puis pose une question de cadrage ciblée. Si le besoin suffit à recommander, choisis "recommend" sans interroger par routine. Si le type d'entretien ou la difficulté est vraiment indéterminé, demande UNE clarification contextualisée, jamais les mêmes quatre choix systématiques. Si tu as déjà posé une question ciblée et que le candidat précise enfin le type (stage PFE, entretien RH, premier emploi), ne demande pas automatiquement une deuxième précision : recommande une première préparation adaptable. Une deuxième clarification est justifiée uniquement si aucun exercice utile ne peut être choisi. Maximum deux clarifications par conversation. N'invente jamais de diplôme, poste, score ou données personnelles. Ne demande pas d'informations sensibles.`;
function response(data:object){return NextResponse.json(data,{headers:{"Cache-Control":"no-store"}});}
async function savePlan(client:NonNullable<Awaited<ReturnType<typeof getServerAuthClient>>>,userId:string,recommendation:ReturnType<typeof makeRecommendation>,source:"rules"|"ai-ld"){
 const {error}=await client.from("academy_learning_plans").upsert({user_id:userId,needs:recommendation.needs,steps:recommendation.steps,primary_path_id:recommendation.pathId,context:recommendation.context||null,source,updated_at:new Date().toISOString()},{onConflict:"user_id"});
 if(error){console.error("Academy plan persistence:",error.code);return false;}
 return true;
}
export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:"Origine non autorisée."},{status:403});
 const client=await getServerAuthClient();
 if(!client)return NextResponse.json({error:"Service de connexion indisponible."},{status:503});
 const {data:{user}}=await client.auth.getUser();
 if(!user)return NextResponse.json({error:"Connectez-vous pour utiliser Academy."},{status:401});
 if(await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Réservé à l’espace candidat."},{status:403});
 let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Requête invalide."},{status:400});}
 if(!body||typeof body!=="object")return NextResponse.json({error:"Conversation invalide."},{status:400});
 const messages=(body as {messages?:unknown}).messages;
 if(!Array.isArray(messages)||messages.length<1||messages.length>11||messages.some(m=>!m||typeof m!=="object"||!["user","assistant"].includes(m.role)||typeof m.content!=="string"||m.content.length>700))return NextResponse.json({error:"Conversation invalide."},{status:400});
 const history=messages as Turn[];
 const last=history.at(-1);
 if(last?.role!=="user"||last.content.trim().length<3)return NextResponse.json({error:"Précisez votre demande."},{status:400});
 const {data:quotaAllowed,error:quotaError}=await client.rpc("academy_claim_chat_quota");
 if(quotaError){console.error("Academy rate-limit check:",quotaError.code);return NextResponse.json({error:"Le coach est temporairement indisponible. Réessayez dans un instant."},{status:503,headers:{"Cache-Control":"no-store"}});}
 if(!quotaAllowed)return NextResponse.json({error:"Vous avez envoyé beaucoup de demandes. Réessayez dans une minute."},{status:429,headers:{"Retry-After":"60","Cache-Control":"no-store"}});
 const userTurns=history.filter(m=>m.role==="user").map(m=>m.content);
 const followup=userTurns.length===1&&/^(et\b|et pour\b|aussi\b|en plus\b|egalement\b|ajoute\b)/i.test(last.content.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim());
 const {data:previous}=followup?await client.from("academy_learning_plans").select("needs,context").eq("user_id",user.id).maybeSingle():{data:null};
 const oldKeys=Array.isArray(previous?.needs)?previous.needs.flatMap((entry:unknown)=>typeof entry==="object"&&entry!==null&&"key" in entry&&typeof entry.key==="string"&&validKeys.has(entry.key)?[entry.key]:[]):[];
 const currentKeys=synthesizeLearningNeeds(userTurns).needs.map(n=>n.key);
 const fallback=synthesizeLearningNeeds(userTurns,[...currentKeys,...oldKeys]);
 const normalizedConversation=userTurns.join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const isStaffingRole=/staffing manager|responsable staffing|staffing lead/.test(normalizedConversation);
 const hasMeaningfulBrief=/allocation|planification|ressource|consultant|intercontrat|commercial|recrutement|operationnel|experience|difficulte|priorite|entretien rh|soft skills|mise en situation/.test(normalizedConversation);
 if(isStaffingRole&&userTurns.length===1&&!hasMeaningfulBrief)return response({kind:"clarify",understanding:"Vous préparez un entretien de Staffing Manager en ESN. Le périmètre peut couvrir la planification des consultants, la coordination commerciale ou le management ; je préfère vérifier plutôt que supposer.",question:"Savez-vous quelles responsabilités seront au centre du poste, et quelle est votre expérience actuelle ?",options:["Staffing opérationnel et allocation des consultants","Coordination avec les équipes commerciales","Management d’équipe","Je ne connais pas encore le périmètre"]});
 const key=process.env.GROQ_API_KEY;
 if(!key){if(fallback.steps.length){const plan=makeRecommendation(fallback);const saved=await savePlan(client,user.id,plan,"rules");return response({...plan,source:"rules",saved});}return response({kind:"clarify",question:"Pouvez-vous préciser le type d’entretien et ce que vous souhaitez améliorer ?",options:["Entretien final RH","Premier entretien","Questions métier"]});}
 try{
  const upstream=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0.1,max_tokens:1200,response_format:{type:"json_object"},messages:[{role:"system",content:coachingInstruction+(oldKeys.length?`\nContexte pédagogique précédent (continuation volontaire du candidat) : compétences ${oldKeys.join(", ")}; contexte ${String(previous?.context||"").slice(0,130)}. Conserve les compétences précédentes seulement si compatibles avec sa demande actuelle.`:"")},...history.map(t=>({role:t.role,content:t.content}))]}),signal:AbortSignal.timeout(20000),cache:"no-store"});
  if(!upstream.ok){console.error("Academy classifier provider status:",upstream.status);throw Error("provider error");}
  const output=await upstream.json() as {choices?:{message?:{content?:string}}[]};
  const decision=JSON.parse(output.choices?.[0]?.message?.content||"null") as Decision|null;
  if(!decision||!Array.isArray(decision.needs))throw Error("Invalid classification");
  if(decision.action==="answer"&&!followup&&!/\b(finalement|uniquement|seulement|desormais|plutot)\b/i.test(last.content.normalize("NFD").replace(/[\u0300-\u036f]/g,""))&&!/\b(prepar|entrain|exercic|programme|parcours|amelior|travaill)/i.test(last.content.normalize("NFD").replace(/[\u0300-\u036f]/g,""))&&typeof decision.reply==="string"&&decision.reply.trim().length>=25)return response({kind:"answer",reply:decision.reply.trim().slice(0,1250),question:typeof decision.question==="string"?decision.question.slice(0,220):undefined});
  const keys=decision.needs.filter(x=>typeof x==="string"&&validKeys.has(x)).slice(0,4);
  // Keep explicit domain constraints grounded in the candidate’s words.
  // The model can clarify synonyms, but cannot add an IT need to a non-IT interview.
  const concreteKeys=fallback.needs.map(x=>x.key);
  const combinedText=userTurns.join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const hasTechnicalEvidence=/informatique|developpement logiciel|programmation|data analyst|devops|cyber|ingenierie informatique/.test(combinedText);
  const safeKeys=keys.filter(k=>k!=="technical"||hasTechnicalEvidence);
  const merged=[...concreteKeys,...safeKeys.filter(k=>!concreteKeys.includes(k as typeof concreteKeys[number]))];
  const synthesis=synthesizeLearningNeeds(userTurns,merged);
  const clarifications=history.filter(m=>m.role==="assistant"&&m.content.includes("?")).length;
  const clarifiedContext=clarifications>0&&synthesis.steps.length>0;
  if(decision.action==="clarify"&&!clarifiedContext&&clarifications<2&&typeof decision.question==="string"&&decision.question.trim().length>12&&Array.isArray(decision.options)){
   const options=decision.options.filter((x):x is string=>typeof x==="string"&&x.trim().length>1).slice(0,4);
   if(options.length>=2)return response({kind:"clarify",understanding:typeof decision.understanding==="string"?decision.understanding.slice(0,350):undefined,question:decision.question.slice(0,240),options});
  }
  if(synthesis.steps.length){const plan=makeRecommendation(synthesis,decision.context||previous?.context||undefined);const saved=await savePlan(client,user.id,plan,"ai-ld");return response({...plan,understanding:typeof decision.understanding==="string"?decision.understanding.slice(0,350):undefined,source:"ai-ld",saved});}
  return response({kind:"clarify",question:"Quelle partie de l’entretien vous pose le plus de difficulté ?",options:["Questions RH et comportementales","Stress et prise de parole","Questions sur mon métier"]});
 }catch{
  if(fallback.steps.length){const plan=makeRecommendation(fallback);const saved=await savePlan(client,user.id,plan,"rules");return response({...plan,source:"rules",saved});}
  return response({kind:"clarify",question:"Pour adapter les exercices, quelle difficulté souhaitez-vous travailler ?",options:["Questions RH et soft skills","Structurer mes réponses","Questions techniques métier"]});
 }
}
function makeRecommendation(synthesis:ReturnType<typeof synthesizeLearningNeeds>,context?:string){
 const main=synthesis.steps[0];
 return {kind:"recommend",need:synthesis.needs[0].label,pathId:main.pathId,pathTitle:main.pathTitle,exerciseId:main.exerciseId,exerciseName:main.exerciseName,needs:synthesis.needs,steps:synthesis.steps,reason:`Nous avons retenu ${synthesis.needs.length} axe${synthesis.needs.length>1?"s":""} de préparation : ${synthesis.needs.map(n=>n.label.toLowerCase()).join(", ")}. Commencez par : ${main.method} Les exercices suivants approfondissent les autres objectifs exprimés.`,context:typeof context==="string"?context.slice(0,150):undefined};
}
