const fs=require('fs');
const {createClient}=require('../web/node_modules/@supabase/supabase-js');
const env=Object.fromEntries(fs.readFileSync('web/.env.local','utf8').split('\n').filter(x=>/^NEXT_PUBLIC_SUPABASE_/.test(x)).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1)]}));
const row=fs.readFileSync('.demo-credentials/test-accounts.txt','utf8').split('\n').find(x=>x.endsWith(' | user'));
const [email,password]=row.split(' | ').map(x=>x.trim());
const client=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
(async()=>{
 let pass=0;const check=(name,ok)=>{console.log(ok?'PASS':'FAIL',name);pass+=Number(ok)};
 const anonymous=await client.rpc('academy_search_knowledge',{query_text:'staffing',match_count:3});check('anonymous RPC denied',!!anonymous.error);
 const login=await client.auth.signInWithPassword({email,password});if(login.error)throw Error('Demo login failed');
 const direct=await client.from('academy_knowledge').select('slug').limit(1);check('table direct access denied',!!direct.error);
 const approved=await client.rpc('academy_search_knowledge',{query_text:'staffing',match_count:3});check('approved reference retrievable',!approved.error&&approved.data.some(x=>x.slug==='academy-staffing-scope'));
 const draft=await client.rpc('academy_search_knowledge',{query_text:'serverless',match_count:3});check('draft reference excluded',!draft.error&&!draft.data.some(x=>x.slug==='academy-serverless-tradeoffs'));
 const empty=await client.rpc('academy_search_knowledge',{query_text:'',match_count:3});check('empty query returns zero references',!empty.error&&empty.data.length===0);
 const hybrid=await client.rpc('academy_hybrid_search',{query_text:'Je souhaite préparer un entretien de Staffing Manager dans une SSII',match_count:3});check('hybrid retrieves staffing without hardcoded trigger',!hybrid.error&&hybrid.data.some(x=>x.slug==='academy-staffing-scope'));
 const draftHybrid=await client.rpc('academy_hybrid_search',{query_text:'serverless Kubernetes',match_count:3});check('hybrid excludes draft',!draftHybrid.error&&!draftHybrid.data.some(x=>x.slug==='academy-serverless-tradeoffs'));
 const salary=await client.rpc('academy_hybrid_search',{query_text:'prétentions salariales',match_count:3});check('expanded corpus retrieves salary guide',!salary.error&&salary.data.some(x=>x.slug==='academy-salary-dialogue'));
 await client.auth.signOut();console.log('KNOWLEDGE QA',pass+'/8');if(pass!==5)process.exitCode=1;
})().catch(e=>{console.error('ERROR',e.message);process.exitCode=1});
