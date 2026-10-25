/**
 * Academy Coach V3 — multi-turn behavioral evaluation.
 * Run from repo root: node scripts/test_academy_multiturn.cjs
 * Requires GROQ_API_KEY in web/.env.local; read-only, no Supabase writes.
 * The model output is evaluated, not treated as the final candidate-facing response.
 */
const fs=require("node:fs");
const env=Object.fromEntries(fs.readFileSync("web/.env.local","utf8").split("\n").filter(x=>/^(GROQ_API_KEY|ACADEMY_AI_MODEL)=/.test(x)).map(x=>{const i=x.indexOf("=");return [x.slice(0,i),x.slice(i+1).replace(/^["']|["']$/g,"")]}));
const source=fs.readFileSync("web/src/app/api/academy/ask/route.ts","utf8");
const keys="softskills, hr_final, structure, stress, communication, motivation, first_interview, sales, technical, leadership, negotiation, internship";
const instruction=source.match(/const coachingInstruction=`([\s\S]*?)`;/)?.[1]?.replace('${[...validKeys].join(", ")}',keys);
if(!instruction||!env.GROQ_API_KEY)throw Error("Missing local Groq configuration or coach instruction");
const cases=[
 {id:"salary-fear",initial:"Pour un poste de Lead Dev, quel salaire exact annoncer ? Je panique.",followup:"J'ai surtout peur d'être écarté si je suis trop cher.",expected:/fourchette|enveloppe|package|budget|remuneration|salaire/i,forbidden:/\b[0-9]{5,}\s*(€|DH|MAD)\b/i},
 {id:"technical-project",initial:"Je me perds dans les détails quand je présente mon projet technique.",followup:"J'ai reconstruit la base de données pour que le site charge trois fois plus vite.",expected:/resultat|impact|charge|STAR|situation|action/i},
 {id:"oral-filler",initial:"Je dis souvent bah, genre et du coup. Comment m'améliorer ?",followup:"J'ai peur du silence quand je parle.",expected:/pause|silence|respir|ralenti|rythme/i,forbidden:/en dix secondes|je vous ai entendu|votre voix prouve/i},
 {id:"perfectionist",initial:"Mon plus grand défaut est que je suis perfectionniste.",followup:"En réalité j'ai parfois du mal à déléguer et je garde des tâches trop longtemps.",expected:/deleg|exemple|situation|concret|action|priorit/i},
 {id:"small-team",initial:"Je candidate Head of Product, mais je n'ai managé que trois personnes.",followup:"On me confiait la priorisation de la roadmap et les arbitrages difficiles.",expected:/prioris|arbitra|decision|impact|preuve/i},
 {id:"career-break",initial:"J'ai un arrêt de travail de huit mois sur mon CV. Faut-il parler de ma santé ?",followup:"Je souhaite rester discret sur mes raisons personnelles.",expected:/priv|personnel|medical|confidenti|sobre|reprise|oblig/i,forbidden:/quel diagnostic|quelle maladie|preuve medicale|conge de sante|congé de santé|convalescen/i},
 {id:"theoretical-conflict",initial:"Pour gérer un conflit je parle d'écoute active et de communication non violente.",followup:"Je n'ai donné aucun exemple concret pour le moment.",expected:/exemple|vecu|situation|conflit|racontez/i},
 {id:"serverless-choice",initial:"J'ai choisi le serverless. Comment défendre ce choix face à un Tech Lead ?",followup:"Notre trafic était irrégulier et l'équipe était petite.",expected:/trafic|cout|charge|equipe|compromis|maintenance|scalabilit/i,forbidden:/toujours moins cher|aucun inconvénient/i},
 {id:"supplier-delay",initial:"J'ai parlé d'un échec de projet causé par un prestataire.",followup:"J'aurais pu demander des jalons intermédiaires plus tôt.",expected:/jalon|anticip|apprent|action|responsabilit/i},
 {id:"end-interview",initial:"À la fin de l'entretien je n'ai jamais de questions à poser.",followup:"Je voudrais montrer que je me projette vraiment dans le poste.",expected:/90 jours|premiers mois|defis|priorit|reussite|objectif/i}
];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const logDir="docs/product/evidence";fs.mkdirSync(logDir,{recursive:true});const resultPath=logDir+"/ACADEMY_MULTITURN_RESULTS_20261025.jsonl";
const past=new Map(fs.existsSync(resultPath)?fs.readFileSync(resultPath,"utf8").split("\n").filter(Boolean).map(row=>{const item=JSON.parse(row);return [item.id,item]}):[]);
async function askOnce(history){let r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+env.GROQ_API_KEY},body:JSON.stringify({model:env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0.1,max_tokens:1800,response_format:{type:"json_object"},messages:[{role:"system",content:instruction},...history]})});if(r.status===400){const err=await r.clone().json().catch(()=>({}));if(/Failed to generate JSON/i.test(String(err?.error?.message||""))){console.log("RETRY JSON GENERATION");r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+env.GROQ_API_KEY},body:JSON.stringify({model:env.ACADEMY_AI_MODEL||"openai/gpt-oss-120b",temperature:0,max_tokens:2000,response_format:{type:"json_object"},messages:[{role:"system",content:instruction+"\nRÉPONDS EN JSON STRICT ET CONCIS, PAS DE MARKDOWN."},...history]})});}}if(!r.ok){const err=await r.json().catch(()=>({}));const e=new Error("Groq HTTP "+r.status+" "+String(err?.error?.message||"").slice(0,180));e.status=r.status;throw e;}const d=await r.json();return JSON.parse(d.choices?.[0]?.message?.content||"null")}
async function ask(history){for(let attempt=0;attempt<4;attempt++){try{return await askOnce(history)}catch(e){if(e.status!==429||attempt===3)throw e;const wait=Number(process.env.QUOTA_WAIT_MS||65000);console.log("RATE_LIMIT_WAIT",Math.round(wait/1000),"seconds; attempt",attempt+2);await sleep(wait)}}throw Error("Unexpected exhausted retries")}
function describe(d){return [d?.reply,d?.understanding,d?.question,d?.reason].filter(x=>typeof x==="string").join(" ")}
(async()=>{let passed=0,evaluated=0,quota=false;for(let i=Math.max(0,Number(process.env.START_CASE||0));i<cases.length;i++){const t=cases[i];if(past.get(t.id)?.status==="PASS"&&!process.env.RETEST_ALL){console.log("SKIP PREVIOUS PASS",t.id);passed++;evaluated++;continue;}try{
 const first=await ask([{role:"user",content:t.initial}]);
 const bridge=describe(first).slice(0,700);
 if(!bridge)throw Error("Empty initial coaching message");
 const second=await ask([{role:"user",content:t.initial},{role:"assistant",content:bridge},{role:"user",content:t.followup}]);
 const answer=describe(second);
 const ok=answer.length>=40&&t.expected.test(answer)&&(!t.forbidden||!t.forbidden.test(answer));
 evaluated++;passed+=Number(ok);fs.appendFileSync(resultPath,JSON.stringify({id:t.id,status:ok?"PASS":"FAIL",first:first.action,second:second.action,observed:answer.slice(0,220),date:new Date().toISOString()})+"\n");
 console.log(ok?"PASS":"FAIL",t.id,"first="+first.action,"second="+second.action,"excerpt="+answer.replace(/\s+/g," ").slice(0,160));
 await sleep(Number(process.env.CASE_DELAY_MS||1000));
 }catch(e){if(e.status===429){console.log("QUOTA_STOP NEXT_START_CASE",i);quota=true;break;}console.log("ERROR",t.id,e.message);fs.appendFileSync(resultPath,JSON.stringify({id:t.id,status:"ERROR",message:e.message.slice(0,180),date:new Date().toISOString()})+"\n");evaluated++;}}
 console.log("MULTITURN RESULT",passed+"/"+evaluated,"quota_stop="+quota,"total_cases="+cases.length);
 if(passed!==evaluated||quota)process.exitCode=1;
})();
