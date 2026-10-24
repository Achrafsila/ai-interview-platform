import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
import {pedagogicalMatch} from "@/app/exercises/ld-matching";

type Turn={role:"user"|"assistant";content:string};
export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:"Origine non autorisée."},{status:403});
 const client=await getServerAuthClient();
 if(!client)return NextResponse.json({error:"Service de connexion indisponible."},{status:503});
 const {data:{user}}=await client.auth.getUser();
 if(!user)return NextResponse.json({error:"Connectez-vous pour utiliser Academy."},{status:401});
 if(await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Réservé à l’espace candidat."},{status:403});
 let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Requête invalide."},{status:400});}
 const {messages}=body as {messages?:unknown};
 if(!Array.isArray(messages)||messages.length<1||messages.length>9||messages.some(m=>!m||typeof m!=="object"||!["user","assistant"].includes(m.role)||typeof m.content!=="string"||m.content.length>700))return NextResponse.json({error:"Conversation invalide."},{status:400});
 const history=messages as Turn[];
 const last=history.at(-1);
 if(last?.role!=="user"||last.content.trim().length<3)return NextResponse.json({error:"Précisez votre demande."},{status:400});
 const userTurns=history.filter(m=>m.role==="user").map(m=>m.content);
 const combined=userTurns.join(" ; ");
 const matched=pedagogicalMatch(combined,last.content);
 // The L&D matching engine, not the LLM, controls the available curriculum.
 const key=process.env.GROQ_API_KEY;
 if(!key){
  if(userTurns.length===1)return NextResponse.json({kind:"clarify",question:"Pour vous orienter au mieux, quelle situation préparez-vous ?",options:["Mon premier entretien","Un entretien de stage","Un entretien pour changer de poste"]});
  return NextResponse.json({...matched,kind:matched.kind});
 }
 try{
  const upstream=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0.3,max_tokens:600,response_format:{type:"json_object"},messages:[{role:"system",content:"Tu es un coach pédagogique francophone. Tu aides à clarifier un besoin de préparation à l'entretien. Pose AU MAXIMUM une question courte à la fois, et au maximum deux questions dans la conversation. Si la demande est suffisamment précise, réponds action=recommend. Si un premier entretien est mentionné sans contexte, clarifie s'il s'agit d'un stage, premier emploi ou autre. JSON strict: {action:'clarify'|'recommend', question:'', options:['...', '...', '...']}. Les options doivent être pertinentes, distinctes, courtes. Ne recommande jamais de parcours par toi-même : le référentiel L&D s'en charge. Ne demande aucune donnée personnelle sensible. Aucune promesse de réussite."},...history.map(m=>({role:m.role,content:m.content}))]}),signal:AbortSignal.timeout(17000),cache:"no-store"});
  if(!upstream.ok)throw Error("upstream unavailable");
  const data=await upstream.json() as {choices?:{message?:{content?:string}}[]};
  const raw=data.choices?.[0]?.message?.content||"";
  const parsed=JSON.parse(raw) as {action?:string;question?:string;options?:string[]};
  if(parsed.action==="clarify"&&userTurns.length<3&&typeof parsed.question==="string"&&Array.isArray(parsed.options)&&parsed.options.length>=2){
   return NextResponse.json({kind:"clarify",question:parsed.question.slice(0,240),options:parsed.options.filter(x=>typeof x==="string").slice(0,4).map(x=>x.slice(0,100))});
  }
  return NextResponse.json(matched.kind==="recommend"?matched:{kind:"clarify",question:"Quel aspect voulez-vous travailler en premier ?",options:["Gérer mon stress","Structurer mes réponses","Répondre aux questions métier"]});
 }catch{
  return NextResponse.json(matched.kind==="recommend"?matched:{kind:"clarify",question:"Pour mieux préciser votre objectif, que souhaitez-vous améliorer ?",options:["Gérer mon stress","Structurer mes réponses","Préparer mon premier entretien"]});
 }
}
