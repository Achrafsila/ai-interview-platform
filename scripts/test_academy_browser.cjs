const fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const {createServerClient}=require('../web/node_modules/@supabase/ssr');
const ts=require('../web/node_modules/typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {synthesizeLearningNeeds}=require('../web/src/app/exercises/ld-synthesis.ts');
const env=Object.fromEntries(fs.readFileSync('web/.env.local','utf8').split('\n').filter(x=>/^NEXT_PUBLIC_SUPABASE_/.test(x)).map(x=>{const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1)]}));
const row=fs.readFileSync('.demo-credentials/test-accounts.txt','utf8').split('\n').find(x=>x.endsWith(' | user'));
if(!row)throw Error('Demo user credentials unavailable');
const [email,password]=row.split(' | ').map(x=>x.trim());
const cookies=new Map();
const client=createServerClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{cookies:{getAll:()=>[...cookies].map(([name,value])=>({name,value})),setAll:items=>items.forEach(x=>cookies.set(x.name,x.value))}});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function ready(url,tries=30){for(let i=0;i<tries;i++){try{const r=await fetch(url);if(r.ok)return r.json()}catch{}await delay(300)}throw Error('Chrome DevTools not reachable');}
(async()=>{
 let chrome,chromeProfile,ws,pending=new Map(),seq=0,old,uid,pass=0,total=0;
 function check(name,ok){total++;pass+=Number(ok);console.log(ok?'PASS':'FAIL',name)}
 try{
  const auth=await client.auth.signInWithPassword({email,password});if(auth.error)throw Error('Demo login failed');uid=auth.data.user.id;
  old=await client.from('academy_learning_plans').select('needs,steps,primary_path_id,context,source,updated_at').eq('user_id',uid).maybeSingle();if(old.error)throw Error('Plan backup failed');
  const plan=synthesizeLearningNeeds(['Entretien final DRH, soft skills, qualités défauts, et structurer mes réponses']);
  const saved=await client.from('academy_learning_plans').upsert({user_id:uid,needs:plan.needs,steps:plan.steps,primary_path_id:plan.steps[0].pathId,context:'QA BROWSER',source:'rules',updated_at:new Date().toISOString()},{onConflict:'user_id'});if(saved.error)throw Error('Browser fixture failed');
  const binary='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  chromeProfile=fs.mkdtempSync(path.join(os.tmpdir(),'interviewlab-qa-chrome-'));
  chrome=spawn(binary,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--remote-debugging-port=9231','--user-data-dir='+chromeProfile,'about:blank'],{stdio:'ignore'});
  const targets=await ready('http://127.0.0.1:9231/json');
  ws=new WebSocket(targets.find(x=>x.type==='page'&&x.webSocketDebuggerUrl).webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
  ws.addEventListener('message',event=>{const msg=JSON.parse(event.data);const item=pending.get(msg.id);if(item){pending.delete(msg.id);msg.error?item.reject(Error(msg.error.message)):item.resolve(msg.result)}});
  function send(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))})}
  async function navigate(route){await send('Page.navigate',{url:'http://localhost:3000'+route});await delay(3300)}
  async function evalText(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});return r.result?.value}
  await send('Network.enable');await send('Page.enable');await send('Runtime.enable');
  await send('Network.setCookies',{cookies:[...cookies].map(([name,value])=>({name,value,url:'http://localhost:3000',path:'/'}))});
  await navigate('/exercises');
  check('Academy page rendered',await evalText("Boolean(document.querySelector('[aria-label=\"Demander à mon coach Academy\"]'))"));
  check('Persisted programme used for next step',await evalText('document.body.innerText.includes("Cette étape reprend votre dernier programme")'));
  await navigate('/exercises/paths');
  check('Personalised programme visible in Paths',await evalText('document.body.innerText.toLowerCase().includes("votre programme élaboré avec le coach")'));
  check('Programme contains pedagogical objective',await evalText('document.body.innerText.includes("Valoriser vos soft skills")'));
  check('Programme links to exercises',await evalText('document.querySelectorAll(\'a[href*="exercise="]\').length > 0'));
  console.log('BROWSER E2E',pass+'/'+total);
  if(pass!==total)process.exitCode=1;
 }catch(e){console.log('BROWSER TEST ERROR',e.message);process.exitCode=1}
 finally{
  if(ws)ws.close();
  if(chrome){chrome.kill('SIGTERM');await delay(300)}
  if(chromeProfile)try{fs.rmSync(chromeProfile,{recursive:true,force:true,maxRetries:5,retryDelay:100})}catch{}
  if(uid){if(old?.data){const restore=await client.from('academy_learning_plans').upsert({user_id:uid,...old.data},{onConflict:'user_id'});if(restore.error)console.log('RESTORE ERROR',restore.error.code)}else{const cleanup=await client.from('academy_learning_plans').delete().eq('user_id',uid);if(cleanup.error)console.log('CLEANUP ERROR',cleanup.error.code)}}
  await client.auth.signOut();
 }
})();
