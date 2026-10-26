import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
import {paths} from "@/app/exercises/paths";
import {exercises} from "@/app/exercises/catalog";

export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:"Origine invalide."},{status:403});
 const client=await getServerAuthClient();
 if(!client)return NextResponse.json({error:"Connexion indisponible."},{status:503});
 const {data:{user}}=await client.auth.getUser();
 if(!user||await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Non autorisé."},{status:401});
 let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Requête invalide."},{status:400});}
 if(!body||typeof body!=="object")return NextResponse.json({error:"Requête invalide."},{status:400});
 const {pathId,exerciseId}=body as {pathId?:unknown;exerciseId?:unknown};
 if(typeof pathId!=="string"||typeof exerciseId!=="string"||!paths.some(p=>p.id===pathId)||!exercises.some(e=>e.id===exerciseId))return NextResponse.json({error:"Parcours ou exercice invalide."},{status:400});
 const exercise=exercises.find(e=>e.id===exerciseId)!;
 const existing=await client.from("academy_learning_plans").select("steps,needs,primary_path_id,context,source").eq("user_id",user.id).maybeSingle();
 if(existing.error)return NextResponse.json({error:"Lecture du parcours indisponible."},{status:503});
 const prior=Array.isArray(existing.data?.steps)?existing.data.steps.filter((v:unknown):v is {exerciseId:string;pathId:string;exerciseName:string;goal:string}=>!!v&&typeof v==="object"&&"exerciseId" in v&&typeof v.exerciseId==="string"&&"pathId" in v&&typeof v.pathId==="string"&&"exerciseName" in v&&typeof v.exerciseName==="string"&&"goal" in v&&typeof v.goal==="string"):[];
 const steps=prior.some(step=>step.exerciseId===exerciseId)?prior:[...prior,{exerciseId,pathId,exerciseName:exercise.title,goal:"Compétence à travailler après votre étude de cas"}];
 const {error}=await client.from("academy_learning_plans").upsert({user_id:user.id,steps:steps.slice(-20),needs:existing.data?.needs||[],primary_path_id:existing.data?.primary_path_id||pathId,context:existing.data?.context||"Exercices enregistrés depuis le coach Academy",source:existing.data?.source||"ai-ld",updated_at:new Date().toISOString()},{onConflict:"user_id"});
 if(error)return NextResponse.json({error:"Sauvegarde indisponible."},{status:503});
 return NextResponse.json({saved:true},{headers:{"Cache-Control":"no-store"}});
}
