const fs=require('fs');
const {createClient}=require('../web/node_modules/@supabase/supabase-js');
const env=Object.fromEntries(fs.readFileSync('web/.env.local','utf8').split('\n').filter(x=>/^NEXT_PUBLIC_SUPABASE_/.test(x)).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1)]}));
const accounts=fs.readFileSync('.demo-credentials/test-accounts.txt','utf8').split('\n').filter(line=>line.includes(' | ')).map(x=>{const [email,password,role]=x.split(' | ').map(y=>y.trim());return {email,password,role}});
const getClient=()=>createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
(async()=>{
 const candidate=accounts.find(a=>a.role==='user'),other=accounts.find(a=>a.role==='coach');
 if(!candidate||!other)throw Error('Accounts unavailable');
 const userClient=getClient(),otherClient=getClient();
 const one=await userClient.auth.signInWithPassword({email:candidate.email,password:candidate.password});
 const two=await otherClient.auth.signInWithPassword({email:other.email,password:other.password});
 if(one.error||two.error)throw Error('Authentication test failed: '+(one.error?.code||two.error?.code));
 console.log('PASS candidate and coach login');
 const userId=one.data.user.id;
 const existing=await userClient.from('academy_learning_plans').select('needs,steps,primary_path_id,context,source,updated_at').eq('user_id',userId).maybeSingle();
 if(existing.error)throw Error('Read plan failed: '+existing.error.code);
 const data={user_id:userId,needs:[{key:'stress',label:'Gérer votre stress'}],steps:[{exerciseId:'confidence-1-foundation',exerciseName:'Exercice test',pathId:'stress',goal:'Gérer le stress'}],primary_path_id:'stress',context:'TEST ACADEMY QA',source:'rules',updated_at:new Date().toISOString()};
 const write=await userClient.from('academy_learning_plans').upsert(data,{onConflict:'user_id'});
 if(write.error)throw Error('Upsert plan failed: '+write.error.code);
 console.log('PASS owner upsert');
 const own=await userClient.from('academy_learning_plans').select('primary_path_id,context').eq('user_id',userId).maybeSingle();
 if(own.error||own.data?.context!=='TEST ACADEMY QA')throw Error('Owner readback failed');
 console.log('PASS owner readback');
 const forbidden=await otherClient.from('academy_learning_plans').select('user_id').eq('user_id',userId);
 if(forbidden.error||forbidden.data?.length!==0)throw Error('RLS isolation FAILED');
 console.log('PASS other account cannot read candidate plan');
 const tamper=await otherClient.from('academy_learning_plans').update({context:'ILLEGAL'}).eq('user_id',userId).select('user_id');
 if(!tamper.error&&tamper.data?.length)throw Error('RLS write isolation FAILED');
 console.log('PASS other account cannot modify candidate plan');
 if(existing.data){const restore=await userClient.from('academy_learning_plans').upsert({user_id:userId,...existing.data},{onConflict:'user_id'});if(restore.error)throw Error('Restore failed');console.log('PASS previous plan restored');}
 else {const clean=await userClient.from('academy_learning_plans').delete().eq('user_id',userId);if(clean.error)throw Error('Cleanup failed');console.log('PASS QA plan cleaned');}
 await userClient.auth.signOut();await otherClient.auth.signOut();
})().catch(e=>{console.error('FAIL',e.message);process.exitCode=1});
