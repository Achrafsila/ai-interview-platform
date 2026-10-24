import {NextRequest,NextResponse} from "next/server";
import {getServerAuthClient} from "@/lib/supabase-server";
import {getAppRole} from "@/lib/profile";
import {paths,stepsForPath} from "@/app/exercises/paths";

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
 const key=process.env.GROQ_API_KEY;
 if(!key)return NextResponse.json({error:"Le coach IA Academy n’est pas encore configuré sur ce serveur. Les parcours conseillés restent disponibles."},{status:503});
 const summaries=paths.map(path=>({id:path.id,title:path.title,category:path.category,goal:path.goal,level:path.level}));
 try{
 const response=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0.2,max_tokens:900,response_format:{type:"json_object"},messages:[{role:"system",content:"Tu es coach pédagogique InterviewLab Academy. À partir du besoin exprimé, choisis UN parcours parmi les IDs fournis. Réponds uniquement en JSON: {\"path_id\":\"...\",\"reason\":\"...\"}. Raisonnement bref, pédagogique, en français. Ne prétends pas connaître un bilan ou le profil si non fournis. Aucun score, diagnostic, garantie, ni promesse de maîtrise. Les parcours sont des options de préparation, pas des qualifications."},{role:"user",content:JSON.stringify({demande:prompt.trim(),parcours:summaries})}]}),cache:"no-store",signal:AbortSignal.timeout(16000)});
 if(!response.ok){console.error("Academy Ask Groq status",response.status);return NextResponse.json({error:response.status===401?"La connexion Groq est refusée. Vérifiez la clé serveur.":response.status===429?"Le quota Groq est atteint. Réessayez plus tard.":response.status===400?"Le modèle IA configuré n’accepte pas cette requête.":"Le coach IA ne répond pas pour le moment. Réessayez plus tard."},{status:503});}
 const result=await response.json() as {choices?:{message?:{content?:string}}[]};
 const text=result.choices?.[0]?.message?.content;
 if(!text)throw new Error("Empty AI response");
 const parsed=JSON.parse(text) as {path_id?:string;reason?:string};
 const picked=paths.find(p=>p.id===parsed.path_id);
 if(!picked)throw new Error("Unknown path");
 const recommendation=stepsForPath(picked)[0];
 return NextResponse.json({pathId:picked.id,pathTitle:picked.title,reason:typeof parsed.reason==="string"?parsed.reason.slice(0,280):"Un parcours correspondant à votre demande.",exerciseId:recommendation.exercise.id,exerciseName:recommendation.exercise.name},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Impossible d’établir une recommandation IA pour le moment."},{status:503});}
}
