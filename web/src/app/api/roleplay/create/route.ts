import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
const allowed=["confidence","answer_structure","communication","domain_knowledge","stress_management"];
export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:"Origine refusée"},{status:403});
 const client=await getServerAuthClient();if(!client)return NextResponse.json({error:"Service indisponible"},{status:503});
 const {data:{user}}=await client.auth.getUser();if(!user)return NextResponse.json({error:"Connexion requise"},{status:401});
 if(await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Accès refusé"},{status:403});
 let payload:unknown;try{payload=await request.json()}catch{return NextResponse.json({error:"Requête invalide"},{status:400})}
 const brief=(payload as {brief?:unknown})?.brief;
 if(typeof brief!=="string"||brief.trim().length<20||brief.length>2000)return NextResponse.json({error:"Décrivez le scénario en 20 à 2000 caractères."},{status:400});
 const key=process.env.GROQ_API_KEY;if(!key)return NextResponse.json({error:"Moteur IA non configuré"},{status:503});
 try{
 const result=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"content-type":"application/json",Authorization:`Bearer ${key}`},cache:"no-store",signal:AbortSignal.timeout(20000),body:JSON.stringify({model:process.env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0.35,max_tokens:750,response_format:{type:"json_object"},messages:[{role:"system",content:"Crée un scénario de préparation à un entretien de recrutement, sans ajouter de faits absents du besoin. Retourne STRICTEMENT un objet JSON : title, family ('rh' ou 'technical'), jobTitle (utiliser 'Poste à préciser' si inconnu), context (450 caractères max), interviewPersona, goals (1 à 3 valeurs parmi confidence,answer_structure,communication,domain_knowledge,stress_management), suggestedQuestions (3 questions d'aperçu). Ces questions sont illustratives et ne sont pas encore fournies au moteur de simulation. Ne génère pas de critères discriminatoires."},{role:"user",content:brief.trim()}]})});
 if(!result.ok)throw Error("API indisponible");
 const data=await result.json() as {choices?:{message?:{content?:string}}[]};const p=JSON.parse(data.choices?.[0]?.message?.content||"{}") as Record<string,unknown>;
 if(!["rh","technical"].includes(String(p.family))||!["title","jobTitle","context","interviewPersona"].every(k=>typeof p[k]==="string"))throw Error("Format invalide");
 return NextResponse.json({title:String(p.title).slice(0,100),family:p.family,jobTitle:String(p.jobTitle).slice(0,120),context:String(p.context).slice(0,450),interviewPersona:String(p.interviewPersona).slice(0,100),goals:Array.isArray(p.goals)?p.goals.filter((x:unknown)=>allowed.includes(String(x))).slice(0,3):[],suggestedQuestions:Array.isArray(p.suggestedQuestions)?p.suggestedQuestions.filter((x:unknown)=>typeof x==="string").slice(0,3).map((x:string)=>x.slice(0,220)):[]},{headers:{"cache-control":"no-store"}});
 }catch{return NextResponse.json({error:"La génération n'a pas abouti. Réessayez."},{status:503})}
}
