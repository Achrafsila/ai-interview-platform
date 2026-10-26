import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";

/** Shared training reference: explicitly unapproved for official assessment. */
export async function GET(request:NextRequest){
 const client=await getServerAuthClient();
 if(!client)return NextResponse.json({error:"Connexion indisponible"},{status:503});
 const {data:{user}}=await client.auth.getUser();
 if(!user||await getAppRole(client,user.id)!=="user")return NextResponse.json({error:"Accès candidat requis"},{status:401});
 const family=request.nextUrl.searchParams.get("family")||"rh";
 const locale=request.nextUrl.searchParams.get("locale")||"fr";
 const difficulty=request.nextUrl.searchParams.get("difficulty");
 if(!["rh","technical"].includes(family)||!["fr","en"].includes(locale)||difficulty!==null&&!/^[1-4]$/.test(difficulty))return NextResponse.json({error:"Filtres invalides"},{status:400});
 let query=client.from("academy_question_references").select("code,family,category_code,difficulty,question_type,prompt_fr,prompt_en,validation_status").eq("family",family).eq("validation_status","internal_pilot").order("code");
 if(difficulty)query=query.eq("difficulty",Number(difficulty));
 const {data,error}=await query.limit(100);
 if(error)return NextResponse.json({error:"Référentiel temporairement indisponible"},{status:503});
 if(!data?.length)return NextResponse.json({error:"Aucune question disponible"},{status:404});
 const index=Math.floor(Math.random()*data.length);
 const chosen=data[index];
 return NextResponse.json({question:{code:chosen.code,family:chosen.family,category:chosen.category_code,difficulty:chosen.difficulty,type:chosen.question_type,prompt:locale==="en"?chosen.prompt_en:chosen.prompt_fr,locale},catalog:"internal_pilot",officiallyApproved:false,totalMatching:data.length},{headers:{"Cache-Control":"no-store"}});
}
