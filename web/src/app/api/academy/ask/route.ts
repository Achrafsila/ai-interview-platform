import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
import {pedagogicalMatch} from "@/app/exercises/ld-matching";

export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(origin&&origin!==request.nextUrl.origin)return NextResponse.json({error:"Origine non autorisée."},{status:403});
 const auth=await getServerAuthClient();
 if(!auth)return NextResponse.json({error:"Service de connexion indisponible."},{status:503});
 const {data:{user}}=await auth.auth.getUser();
 if(!user)return NextResponse.json({error:"Connectez-vous pour utiliser le coach Academy."},{status:401});
 if(await getAppRole(auth,user.id)!=="user")return NextResponse.json({error:"Réservé à l’espace candidat."},{status:403});
 let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Requête invalide."},{status:400});}
 const prompt=(body as {prompt?:unknown})?.prompt;
 if(typeof prompt!=="string"||prompt.trim().length<5||prompt.length>700)return NextResponse.json({error:"Décrivez votre besoin en 5 à 700 caractères."},{status:400});
 const answer=pedagogicalMatch(prompt);
 return NextResponse.json(answer,{headers:{"Cache-Control":"no-store"}});
}
