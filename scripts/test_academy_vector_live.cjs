const fs=require('node:fs');
const {createClient}=require('../web/node_modules/@supabase/supabase-js');
const env=Object.fromEntries(fs.readFileSync('web/.env.local','utf8').split('\n').filter(x=>/^NEXT_PUBLIC_SUPABASE_/.test(x)).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1)]}));
const row=fs.readFileSync('.demo-credentials/test-accounts.txt','utf8').split('\n').find(x=>x.endsWith(' | user'));
const [email,password]=row.split(' | ').map(x=>x.trim());
const tests=[
 ['Je vais organiser le placement des consultants chez les clients', 'academy-staffing-scope'],
 ['J’ai peur de demander trop d’argent en entretien et perdre cette opportunité','academy-salary-dialogue'],
 ['Que dire pour expliquer une longue pause professionnelle sans révéler ma vie privée','academy-career-break-privacy'],
 ['Comment transformer un désaccord avec un collègue en exemple vécu','academy-conflict-example'],
 ['Comment organiser ma réponse avec la situation les actions et le résultat','academy-star-reference']
];
const c=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
(async()=>{const auth=await c.auth.signInWithPassword({email,password});if(auth.error)throw Error('Demo auth unavailable');let correct=0;
for(const [question,expected] of tests){const resp=await fetch('http://127.0.0.1:18765/embed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:question})});if(!resp.ok)throw Error('Embed HTTP '+resp.status);const {embedding}=await resp.json();if(embedding.length!==384)throw Error('Unexpected dimensions');
const {data,error}=await c.rpc('academy_hybrid_search',{query_text:question,query_embedding:'['+embedding.join(',')+']',match_count:3});
if(error)throw Error(JSON.stringify(error));
const ok=data?.[0]?.slug===expected;correct+=Number(ok);console.log(ok?'PASS':'FAIL',expected,'got',data?.[0]?.slug,'score',Number(data?.[0]?.relevance).toFixed(3));
}
await c.auth.signOut();console.log('HYBRID_LIVE_TOP1',correct+'/'+tests.length);process.exitCode=correct===tests.length?0:1})().catch(e=>{console.error('ERROR',e.message);process.exitCode=1});
