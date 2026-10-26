import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/lib/supabase-server";
import { getAppRole } from "@/lib/profile";
import {interviewGroq,type Turn} from "@/lib/interview/groq-engine";
const UPSTREAM = "http://127.0.0.1:8765";
async function requestUser(client:NonNullable<Awaited<ReturnType<typeof getServerAuthClient>>>,request:NextRequest){
 const header=request.headers.get("authorization");
 const token=header?.startsWith("Bearer ")?header.slice(7):undefined;
 return client.auth.getUser(token);
}
export async function GET(request:NextRequest,{params}:{params:Promise<{action:string}>}){
 const {action}=await params;
 if(action!=="tts" && action!=="status")return NextResponse.json({error:"Action inconnue"},{status:404});
 const client=await getServerAuthClient();
 if(!client)return NextResponse.json({error:"Authentification indisponible"},{status:503});
 const {data:{user}}=await requestUser(client,request);
 if(!user)return NextResponse.json({error:"Connectez-vous pour lancer l’entretien."},{status:401});
 if(await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Accès candidat uniquement"},{status:403});
 if(action==="status" && process.env.GROQ_API_KEY)return NextResponse.json({ready:true},{headers:{"Cache-Control":"no-store"}});
 if(action==="status"){
  try {
   const response=await fetch(`${UPSTREAM}/api/health`,{cache:"no-store",signal:AbortSignal.timeout(2500)});
   if(!response.ok)throw new Error("unavailable");
   return NextResponse.json({ready:true},{headers:{"Cache-Control":"no-store"}});
  } catch {return NextResponse.json({error:"Le moteur vocal local est indisponible. Démarrez le laboratoire IA avant de continuer."},{status:503});}
 }
 const text=request.nextUrl.searchParams.get("text")||"";
 const locale=request.nextUrl.searchParams.get("locale")||"fr";
 if(!text.trim()||text.length>1200||!["fr","en"].includes(locale))
  return NextResponse.json({error:"Texte vocal invalide"},{status:400});
 try{
  const response=await fetch(`${UPSTREAM}/api/ai/tts`,{method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({text,locale}),cache:"no-store",signal:AbortSignal.timeout(35000)});
  if(!response.ok)return NextResponse.json({error:"Synthèse vocale locale indisponible"},{status:503});
  return new NextResponse(await response.arrayBuffer(),{headers:{"Content-Type":"audio/mpeg","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return NextResponse.json({error:"Serveur vocal indisponible"},{status:503});}
}
export async function POST(request:NextRequest,{params}:{params:Promise<{action:string}>}){
 const {action}=await params;
 if(action!=="start"&&action!=="answer"&&action!=="tts"&&action!=="transcribe")return NextResponse.json({error:"Action inconnue"},{status:404});
 const origin=request.headers.get("origin");
 if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:"Origine non autorisée"},{status:403});
 const client=await getServerAuthClient();
 if(!client)return NextResponse.json({error:"Authentification indisponible"},{status:503});
 const {data:{user}}=await requestUser(client,request);
 if(!user)return NextResponse.json({error:"Connectez-vous pour lancer l’entretien."},{status:401});
 if(await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Accès candidat uniquement"},{status:403});
 let payload:unknown;try{payload=await request.json();}catch{return NextResponse.json({error:"Données invalides"},{status:400});}
 if(!payload||typeof payload!=="object"||Array.isArray(payload))return NextResponse.json({error:"Données invalides"},{status:400});
 if((action==="start"||action==="answer") && process.env.GROQ_API_KEY){
  const body=payload as Record<string,unknown>;
  try{
   if(action==="start"){
    const jobTitle=typeof body.job_title==="string"?body.job_title.trim():"";
    const description=typeof body.job_description==="string"?body.job_description:"";
    const family=body.family,locale=body.locale,count=body.count;
    if(!jobTitle||jobTitle.length>160||description.length>5000||!(family==="rh"||family==="technical")||!(locale==="fr"||locale==="en")||typeof count!=="number"||!Number.isInteger(count)||count<1||count>6)return NextResponse.json({error:"Configuration invalide"},{status:400});
    const setup={jobTitle,description,family:family as "rh"|"technical",locale:locale as "fr"|"en",count};
    const question=await interviewGroq(setup,[],"question");
    const {data,error}=await client.from("interview_live_sessions").insert({user_id:user.id,job_title:jobTitle,job_description:description,family,locale,max_turns:count,question}).select('id').single();
    if(error||!data)return NextResponse.json({error:"Session non enregistrée : vérifiez la migration Supabase interview_live_sessions."},{status:503});
    return NextResponse.json({session_id:data.id,question:{prompt:question},index:1,total:count,phase:'conversation',ai:true,persisted:true},{status:201});
   }
   const sid=typeof body.session_id==="string"?body.session_id:"";
   const answer=typeof body.answer==="string"?body.answer.trim():"";
   if(!/^[0-9a-f-]{36}$/i.test(sid)||!answer||answer.length>8000)return NextResponse.json({error:'Réponse invalide'},{status:400});
   const {data:session,error}=await client.from('interview_live_sessions').select('*').eq('id',sid).eq('user_id',user.id).single();
   if(error||!session||session.stage!=='active')return NextResponse.json({error:'Session expirée ou inaccessible'},{status:404});
   const history=Array.isArray(session.transcript)?session.transcript.filter((t:unknown)=>Boolean(t&&typeof t==='object'&&'question'in t&&'answer'in t)).slice(-20) as Turn[]:[];
   const transcript=[...history,{question:session.question,answer}];
   const setup={jobTitle:session.job_title as string,description:session.job_description as string,family:session.family as 'rh'|'technical',locale:session.locale as 'fr'|'en',count:session.max_turns as number};
   const finished=transcript.length>=setup.count;
   const generated=await interviewGroq(setup,transcript,finished?'feedback':'question');
   const {data:saved,error:saveError}=await client.from('interview_live_sessions').update({transcript,question:finished?'':generated,stage:finished?'completed':'active',updated_at:new Date().toISOString()}).eq('id',sid).eq('user_id',user.id).eq('stage','active').eq('question',session.question).select('id').maybeSingle();
   if(saveError||!saved)return NextResponse.json({error:'Conflit de session. Réessayez.'},{status:409});
   if(finished)return NextResponse.json({completed:true,transcript,feedback:generated,evaluated:false,persisted:true});
   return NextResponse.json({completed:false,phase:'conversation',index:transcript.length+1,total:setup.count,question:{prompt:generated},ai:true,persisted:true});
  }catch(error){return NextResponse.json({error:error instanceof Error&&error.message==='groq_rate_limited'?'Quota IA atteint. Réessayez.':'Moteur Groq momentanément indisponible.'},{status:503});}
 }
 try{
  const response=await fetch(`${UPSTREAM}${action === "tts" || action === "transcribe" ? `/api/ai/${action}` : `/api/ai/session/${action}`}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload),cache:"no-store",signal:AbortSignal.timeout(35000)});
  if(action==="tts"){
   if(!response.ok)return NextResponse.json({error:response.status===400?"Texte vocal invalide":"Synthèse vocale locale indisponible."},{status:response.status===400?400:503});
   return new NextResponse(await response.arrayBuffer(),{status:200,headers:{"Content-Type":"audio/mpeg","Cache-Control":"no-store"}});
  }
  const text=await response.text();
  let result:unknown;try{result=JSON.parse(text);}catch{throw new Error("Réponse IA invalide");}
  return NextResponse.json(result,{status:response.status,headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Moteur local indisponible. Lancez le laboratoire IA sur ce Mac."},{status:503});}
}
