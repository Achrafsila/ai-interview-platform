const fs=require('fs');
const {createClient}=require('../web/node_modules/@supabase/supabase-js');
const env=Object.fromEntries(fs.readFileSync('web/.env.local','utf8').split('\n').filter(x=>/^NEXT_PUBLIC_SUPABASE_/.test(x)).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1)]}));
const candidate=fs.readFileSync('.demo-credentials/test-accounts.txt','utf8').split('\n').find(x=>x.endsWith(' | user'));
const [email,password]=candidate.split(' | ').map(x=>x.trim());
const client=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
(async()=>{
 const anonymous=await client.rpc('academy_claim_chat_quota');
 if(!anonymous.error&&anonymous.data!==false){console.log('FAIL anonymous quota was granted');process.exitCode=1;return}
 console.log('PASS anonymous cannot claim quota');
 const signed=await client.auth.signInWithPassword({email,password});if(signed.error)throw Error('Demo account auth failed');
 const list=[];
 for(let i=0;i<13;i++){const res=await client.rpc('academy_claim_chat_quota');if(res.error)throw Error('Quota RPC failed '+res.error.code);list.push(res.data)}
 const valid=list.slice(0,12).every(Boolean)&&list[12]===false;
 console.log(valid?'PASS':'FAIL','per-user quota: first 12 accepted, 13th rejected');
 console.log('QUOTA QA',valid?'2/2':'1/2');if(!valid)process.exitCode=1;
 await client.auth.signOut();
})().catch(e=>{console.log('ERROR',e.message);process.exitCode=1});
