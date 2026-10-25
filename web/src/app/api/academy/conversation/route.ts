import {trackGoals} from "@/app/api/academy/ask/goal-tracker";
import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";

type Turn={role:"user"|"assistant";content:string};
const json=(data:object,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});
async function authorize(){
 const client=await getServerAuthClient();if(!client)return null;
 const {data:{user}}=await client.auth.getUser();if(!user)return null;
 if(await getAppRole(client,user.id)!=="user")return null;
 return {client,user};
}
export async function GET(){const auth=await authorize();if(!auth)return json({error:"Accès non autorisé."},401);
 const {data,error}=await auth.client.from("academy_conversations").select("turns,diagnostic,updated_at").eq("user_id",auth.user.id).maybeSingle();
 if(error)return json({error:"Historique indisponible."},503);
 return json({turns:data?.turns||[],diagnostic:data?.diagnostic||null,updatedAt:data?.updated_at||null});
}
export async function PUT(request:NextRequest){const origin=request.headers.get("origin");if(origin&&origin!==request.nextUrl.origin)return json({error:"Origine interdite."},403);
 const auth=await authorize();if(!auth)return json({error:"Accès non autorisé."},401);
 let body:unknown;try{body=await request.json();}catch{return json({error:"Requête invalide."},400);}
 if(!body||typeof body!=="object")return json({error:"Requête invalide."},400);
 const {turns,diagnostic} = body as {turns?:unknown;diagnostic?:unknown};
 if(!Array.isArray(turns)||turns.length>20||turns.some((t:Turn)=>!t||!["user","assistant"].includes(t.role)||typeof t.content!=="string"||t.content.length>2500))return json({error:"Historique invalide."},400);
 const timeline=trackGoals(turns);
 const safeDiagnostic={phase:diagnostic&&typeof diagnostic==="object"&&"phase" in diagnostic&&["exploration","coaching","training"].includes(String(diagnostic.phase))?diagnostic.phase:"exploration",timeline};
 const {error}=await auth.client.from("academy_conversations").upsert({user_id:auth.user.id,turns,diagnostic:safeDiagnostic,updated_at:new Date().toISOString()},{onConflict:"user_id"});
 if(error)return json({error:"Sauvegarde indisponible."},503);
 return json({saved:true});
}
export async function DELETE(request:NextRequest){const origin=request.headers.get("origin");if(origin&&origin!==request.nextUrl.origin)return json({error:"Origine interdite."},403);
 const auth=await authorize();if(!auth)return json({error:"Accès non autorisé."},401);
 const {error}=await auth.client.from("academy_conversations").delete().eq("user_id",auth.user.id);
 if(error)return json({error:"Suppression indisponible."},503);
 return json({deleted:true});
}
