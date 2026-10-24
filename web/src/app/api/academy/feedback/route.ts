import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
import {exercises} from "@/app/exercises/catalog";
import {premiumGuide} from "@/app/exercises/premium-guides";

export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:"Origine non autorisée."},{status:403});
 const client=await getServerAuthClient();
 if(!client)return NextResponse.json({error:"Connexion indisponible."},{status:503});
 const {data:{user}}=await client.auth.getUser();
 if(!user)return NextResponse.json({error:"Connectez-vous pour obtenir votre retour."},{status:401});
 if(await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Accès candidat uniquement."},{status:403});
 let payload:unknown;try{payload=await request.json();}catch{return NextResponse.json({error:"Données invalides."},{status:400});}
 if(!payload||typeof payload!=="object")return NextResponse.json({error:"Données invalides."},{status:400});
 const {exerciseId,answer}=payload as {exerciseId?:unknown;answer?:unknown};
 if(typeof exerciseId!=="string"||typeof answer!=="string"||answer.trim().length<50||answer.length>8000)return NextResponse.json({error:"Une réponse d'au moins 50 caractères est nécessaire."},{status:400});
 const exercise=exercises.find(x=>x.id===exerciseId);
 if(!exercise)return NextResponse.json({error:"Exercice inconnu."},{status:404});
 const key=process.env.GROQ_API_KEY;
 if(!key)return NextResponse.json({error:"L'analyse IA n'est pas configurée. Utilisez la grille d'auto-évaluation en attendant."},{status:503});
 const guide=premiumGuide(exercise);
 try{
  const response=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0.2,max_tokens:1100,response_format:{type:"json_object"},messages:[{role:"system",content:'Tu es coach L&D. Analyse la réponse uniquement selon les critères fournis. Sans score, sans certification, sans inférence sur la personnalité ni le niveau global. Réponds en JSON strict : {"strength":"réussite observée ou manque de preuve","improvement":"amélioration justifiée","nextAction":"action concrète pour une nouvelle tentative"}. Court, précis, en français. Ne jamais inventer des réalisations.'},{role:"user",content:JSON.stringify({exercise:exercise.prompt,criteria:guide?.evidence||exercise.steps,response:answer.trim()})}]}),cache:"no-store",signal:AbortSignal.timeout(17000)});
  if(!response.ok){console.error("Academy Feedback Groq status",response.status);return NextResponse.json({error:response.status===401?"Accès Groq refusé : vérifiez la clé API.":response.status===429?"Quota Groq atteint. Réessayez plus tard.":response.status===400?"Le modèle IA ne peut pas traiter cette analyse.":"Le coach IA est temporairement indisponible."},{status:503});}
  const body=await response.json() as {choices?:{message?:{content?:string}}[]};
  const result=JSON.parse(body.choices?.[0]?.message?.content||"null") as {strength?:unknown;improvement?:unknown;nextAction?:unknown}|null;
  if(!result||typeof result.strength!=="string"||typeof result.improvement!=="string"||typeof result.nextAction!=="string")throw Error("Invalid");
  return NextResponse.json({strength:result.strength.slice(0,500),improvement:result.improvement.slice(0,500),nextAction:result.nextAction.slice(0,500)},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"L'analyse IA n'a pas pu aboutir. Réessayez plus tard."},{status:503});}
}
