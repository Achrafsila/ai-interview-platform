import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
import {synthesizeLearningNeeds,themes} from "@/app/exercises/ld-synthesis";

type Turn={role:"user"|"assistant";content:string};
type Decision={action?:string;needs?:string[];question?:string;options?:string[];context?:string};
const validKeys=new Set<string>(themes.map(t=>t.key));
const coachingInstruction=`Tu es l'analyste de besoin d'InterviewLab Academy. Lis toute la conversation en français, mais la DERNIÈRE demande fait foi pour les nouvelles priorités. Identifie toutes les difficultés distinctes : pas seulement le premier mot-clé. Tu NE CHOISIS PAS les parcours, l'architecte L&D s'en charge.
Ta sortie est EXCLUSIVEMENT un objet JSON valide avec "action" ("clarify" ou "recommend"), "needs" (tableau de clés parmi: ${[...validKeys].join(", ")}), "question" et "options" (2 à 4 phrases courtes si clarification), "context" (bref type d'entretien / métier, non diagnostic).
Règles : "entretien technique de responsable commercial" signifie métier commercial, PAS data / informatique. "soft skills" + "qualités défauts" sont des compétences comportementales, pas uniquement STAR. "et pour les soft skills ?" ajoute la compétence, conserve le cadre RH/DRH et ne répète pas la même recommandation sans l'adapter.
Si le besoin suffit à recommander, choisis "recommend" sans interroger par routine. Si le type d'entretien ou la difficulté est vraiment indéterminé, demande UNE clarification contextualisée, jamais les mêmes quatre choix systématiques. Maximum deux clarifications par conversation. N'invente jamais de diplôme, poste, score ou données personnelles. Ne demande pas d'informations sensibles.`;
function response(data:object){return NextResponse.json(data,{headers:{"Cache-Control":"no-store"}});}
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
 const userTurns=history.filter(m=>m.role==="user").map(m=>m.content);
 const fallback=synthesizeLearningNeeds(userTurns);
 const key=process.env.GROQ_API_KEY;
 if(!key)return response(fallback.steps.length?{...makeRecommendation(fallback),source:"rules"}:{kind:"clarify",question:"Pouvez-vous préciser le type d’entretien et ce que vous souhaitez améliorer ?",options:["Entretien final RH","Premier entretien","Questions métier"]});
 try{
  const upstream=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0.1,max_tokens:1200,response_format:{type:"json_object"},messages:[{role:"system",content:coachingInstruction},...history.map(t=>({role:t.role,content:t.content}))]}),signal:AbortSignal.timeout(20000),cache:"no-store"});
  if(!upstream.ok){console.error("Academy classifier provider status:",upstream.status);throw Error("provider error");}
  const output=await upstream.json() as {choices?:{message?:{content?:string}}[]};
  const decision=JSON.parse(output.choices?.[0]?.message?.content||"null") as Decision|null;
  if(!decision||!Array.isArray(decision.needs))throw Error("Invalid classification");
  const keys=decision.needs.filter(x=>typeof x==="string"&&validKeys.has(x)).slice(0,4);
  const synthesis=synthesizeLearningNeeds(userTurns,keys);
  const clarifications=history.filter(m=>m.role==="assistant"&&m.content.includes("?")).length;
  if(decision.action==="clarify"&&clarifications<2&&typeof decision.question==="string"&&decision.question.trim().length>12&&Array.isArray(decision.options)){
   const options=decision.options.filter((x):x is string=>typeof x==="string"&&x.trim().length>1).slice(0,4);
   if(options.length>=2)return response({kind:"clarify",question:decision.question.slice(0,240),options});
  }
  return response(synthesis.steps.length?{...makeRecommendation(synthesis,decision.context),source:"ai-ld"}:{kind:"clarify",question:"Quelle partie de l’entretien vous pose le plus de difficulté ?",options:["Questions RH et comportementales","Stress et prise de parole","Questions sur mon métier"]});
 }catch{
  return response(fallback.steps.length?{...makeRecommendation(fallback),source:"rules"}:{kind:"clarify",question:"Pour adapter les exercices, quelle difficulté souhaitez-vous travailler ?",options:["Questions RH et soft skills","Structurer mes réponses","Questions techniques métier"]});
 }
}
function makeRecommendation(synthesis:ReturnType<typeof synthesizeLearningNeeds>,context?:string){
 const main=synthesis.steps[0];
 return {kind:"recommend",need:synthesis.needs[0].label,pathId:main.pathId,pathTitle:main.pathTitle,exerciseId:main.exerciseId,exerciseName:main.exerciseName,needs:synthesis.needs,steps:synthesis.steps,reason:`Nous avons retenu ${synthesis.needs.length} axe${synthesis.needs.length>1?"s":""} de préparation : ${synthesis.needs.map(n=>n.label.toLowerCase()).join(", ")}. Le programme propose des exercices ciblés issus du catalogue L&D.`,context:typeof context==="string"?context.slice(0,150):undefined};
}
