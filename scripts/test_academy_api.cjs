const fs=require('fs');
const {createServerClient}=require('../web/node_modules/@supabase/ssr');
const env=Object.fromEntries(fs.readFileSync('web/.env.local','utf8').split('\n').filter(x=>/^NEXT_PUBLIC_SUPABASE_/.test(x)).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1)]}));
const accounts=fs.readFileSync('.demo-credentials/test-accounts.txt','utf8').split('\n').filter(line=>line.includes(' | ')).map(line=>{const [email,password,role]=line.split(' | ').map(x=>x.trim());return {email,password,role}});
function session(role){
 const account=accounts.find(x=>x.role===role);if(!account)throw Error('Missing role test account '+role);
 const jar=new Map();
 const client=createServerClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{cookies:{getAll(){return [...jar].map(([name,value])=>({name,value}))},setAll(items){for(const x of items)jar.set(x.name,x.value)}}});
 return {account,client,cookie(){return [...jar].map(([key,value])=>key+'='+encodeURIComponent(value)).join('; ')}};
}
const endpoint=(process.env.ACADEMY_TEST_ORIGIN||'http://localhost:3000')+'/api/academy/ask';
async function call(cookie,messages,headers={}){
 let response;for(let attempt=0;attempt<3;attempt++){response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie,...headers},body:JSON.stringify({messages})});if(response.status!==429)break;console.log('RATE_LIMIT_WAIT',attempt+1);await new Promise(r=>setTimeout(r,65000));}
 return {status:response.status,body:await response.json()};
}
(async()=>{
 let pass=0;let total=0;
 function check(label,condition){total++;if(condition){pass++;console.log('PASS',label)}else console.log('FAIL',label)}
 const candidate=session('user'),coach=session('coach');
 if((await candidate.client.auth.signInWithPassword({email:candidate.account.email,password:candidate.account.password})).error)throw Error('candidate auth failed');
 if((await coach.client.auth.signInWithPassword({email:coach.account.email,password:coach.account.password})).error)throw Error('coach auth failed');
 const ownerId=(await candidate.client.auth.getUser()).data.user.id;
 const original=await candidate.client.from('academy_learning_plans').select('needs,steps,primary_path_id,context,source,updated_at').eq('user_id',ownerId).maybeSingle();if(original.error)throw Error('Initial snapshot failed');
 const unauth=await call('',[{role:'user',content:'Je prépare mon stage PFE'}]);check('anonymous denied',unauth.status===401);
 const forbidden=await call(coach.cookie(),[{role:'user',content:'Je prépare mon stage PFE'}]);check('coach denied',forbidden.status===403);
 const origin=await call(candidate.cookie(),[{role:'user',content:'Je prépare mon stage PFE'}],{origin:'https://invalid.example'});check('cross-origin denied',origin.status===403);
 const short=await call(candidate.cookie(),[{role:'user',content:'x'}]);check('invalid prompt denied',short.status===400);
 const first=await call(candidate.cookie(),[{role:'user',content:'Je dois bientôt passer un entretien'}]);check('vague request handled',first.status===200&&['clarify','recommend'].includes(first.body.kind));
 const information=await call(candidate.cookie(),[{role:'user',content:'Peux-tu m’expliquer la différence entre le staffing des consultants et le recrutement dans une ESN ?'}]);
 check('career question answered without prescribing exercises',information.status===200&&information.body.kind==='answer'&&typeof information.body.reply==='string'&&information.body.reply.length>40&&!information.body.pathId);
 const staffing=await call(candidate.cookie(),[{role:'user',content:'Je souhaite préparer un entretien pour une position de Staffing Manager pour une SSII'}]);
 check('specialist role is clarified before prescription',staffing.status===200&&staffing.body.kind==='clarify'&&/responsabilit|périmètre|experience/i.test(staffing.body.question)&&!staffing.body.pathId);
 check('staffing knowledge reference visible',staffing.status===200&&staffing.body.references?.some(x=>x.slug==='academy-staffing-scope'));
 const expert=await call(candidate.cookie(),[{role:'user',content:'J’ai un entretien pour position de Responsable recrutement dans une SSII et je souhaite préparer mon entretien'},{role:'assistant',content:'Pour adapter les exercices, quelle difficulté souhaitez-vous travailler ?'},{role:'user',content:'Une difficulté d’expert'}]);
 check('ambiguous expert difficulty asks one contextual follow-up, no curriculum',expert.status===200&&expert.body.kind==='clarify'&&/situation exigeante/i.test(expert.body.question)&&!expert.body.pathId&&Array.isArray(expert.body.options)&&expert.body.options.length===0);
 const longContext=await call(candidate.cookie(),[{role:'user',content:'Je prépare un entretien de responsable recrutement'},{role:'assistant',content:'Pour mieux préparer votre entretien, pourriez-vous préciser un exemple pertinent ? '+ 'Vous pouvez choisir un cas vécu. '.repeat(35)},{role:'user',content:'Je ne sais pas'}]);
 check('long assistant history and uncertainty handled without rejection or programme',longContext.status===200&&longContext.body.kind==='clarify'&&/expérience|recrutement|collègue/i.test(longContext.body.question)&&!longContext.body.pathId);
 const unsureWithoutRole=await call(candidate.cookie(),[{role:'user',content:'J’ai un entretien bientôt, mais je ne sais pas comment le préparer.'},{role:'assistant',content:'Quel entretien préparez-vous ?'},{role:'user',content:'Je ne sais pas.'}]);
 check('unknown-role uncertainty does not invent manager or recruiting experience',unsureWithoutRole.status===200&&unsureWithoutRole.body.kind==='clarify'&&!/responsable|recrutement|manager/i.test(unsureWithoutRole.body.question+' '+unsureWithoutRole.body.understanding)&&/poste|domaine/i.test(unsureWithoutRole.body.question));
 const unsureRecruiting=await call(candidate.cookie(),[{role:'user',content:'Je prépare un entretien de Responsable recrutement dans une ESN'},{role:'assistant',content:'Quel aspect souhaitez-vous préparer ?'},{role:'user',content:'Je ne sais pas.'}]);
 check('recruiting uncertainty is context-aware',unsureRecruiting.status===200&&unsureRecruiting.body.kind==='clarify'&&/recrutement/i.test(unsureRecruiting.body.question)&&!unsureRecruiting.body.pathId);
 const caseResources=await call(candidate.cookie(),[{role:'user',content:"J'ai demain un entretien pour la position de Responsable de recrutement"},{role:'assistant',content:"Quel aspect souhaitez-vous travailler ?"},{role:'user',content:'Mise en situation'},{role:'assistant',content:'Voici un cas de réduction du délai de recrutement. Comment procéderiez-vous ?'},{role:'user',content:'Y a t il de la documentation a suivre ou un parcours dans ce sens ?'}]);
 check('case-study resources use actual Academy curriculum',caseResources.status===200&&caseResources.body.kind==='recommend'&&caseResources.body.steps?.some(x=>typeof x.exerciseId==='string')&&caseResources.body.saved===true&&!/PDF 12 pages|webinaire/i.test(JSON.stringify(caseResources.body)));
 const stage=await call(candidate.cookie(),[{role:'user',content:'Je prépare un entretien de stage PFE, je souhaite un exercice pour présenter mon projet académique'}]);check('stage recommendation',stage.status===200&&stage.body.kind==='recommend'&&stage.body.needs?.some(x=>x.key==='internship')&&stage.body.saved===true);
 const stored=await candidate.client.from('academy_learning_plans').select('primary_path_id,steps,needs').eq('user_id',(await candidate.client.auth.getUser()).data.user.id).maybeSingle();check('recommendation persisted',!stored.error&&stored.data?.primary_path_id===stage.body.pathId&&stored.data.steps[0]?.exerciseId===stage.body.exerciseId);
 const multi=await call(candidate.cookie(),[{role:'user',content:'Je prépare un entretien final RH avec une DRH'}, {role:'assistant',content:'Quel aspect voulez-vous travailler ?'}, {role:'user',content:'Je veux un exercice pour travailler la structure et les soft skills, mes qualités et défauts'}]);check('multi-need curriculum',multi.status===200&&multi.body.kind==='recommend'&&multi.body.needs?.some(x=>x.key==='softskills')&&multi.body.needs?.some(x=>x.key==='structure')&&multi.body.saved===true);
 const memory=await call(candidate.cookie(),[{role:'user',content:'Et pour m’entraîner sur mes soft skills ?'}]);
 check('cross-session follow-up uses saved curriculum',memory.status===200&&memory.body.kind==='recommend'&&memory.body.needs?.some(x=>x.key==='softskills')&&memory.body.needs?.some(x=>x.key==='hr_final'));
 const reset=await call(candidate.cookie(),[{role:'user',content:'Finalement je veux uniquement un exercice pour améliorer ma communication orale'}]);
 check('explicit goal switch replaces previous programme',reset.status===200&&reset.body.kind==='recommend'&&reset.body.needs?.some(x=>x.key==='communication')&&!reset.body.needs?.some(x=>x.key==='hr_final'));
 if(original.data){const restore=await candidate.client.from('academy_learning_plans').upsert({user_id:ownerId,...original.data},{onConflict:'user_id'});check('original plan restored',!restore.error);}else{const deleted=await candidate.client.from('academy_learning_plans').delete().eq('user_id',ownerId);check('QA plan removed',!deleted.error);}
 console.log('API INTEGRATION',pass+'/'+total);
 await candidate.client.auth.signOut();await coach.client.auth.signOut();process.exitCode=pass===total?0:1;
})().catch(e=>{console.log('INTEGRATION ERROR',e.message);process.exitCode=1});
