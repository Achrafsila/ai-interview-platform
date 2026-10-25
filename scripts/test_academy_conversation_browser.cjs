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
  old=await client.from('academy_conversations').select('turns,diagnostic,updated_at').eq('user_id',uid).maybeSingle();if(old.error)throw Error('Conversation backup failed');
  const sample=[{role:'user',content:'Je prépare un entretien Data Analyst — reprise Academy QA'},{role:'assistant',content:'Quel aspect du poste vous intéresse ?'}];
  const inserted=await client.from('academy_conversations').upsert({user_id:uid,turns:sample,diagnostic:{phase:'exploration',role:'Data Analyst'},updated_at:new Date().toISOString()},{onConflict:'user_id'});if(inserted.error)throw Error('Seed failed '+inserted.error.code);
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
  check('Restored transcript visible in browser',await evalText('document.body.innerText.includes("reprise Academy QA")'));
  check('Restored reply visible',await evalText('document.body.innerText.includes("Quel aspect du poste vous intéresse")'));
  await navigate('/exercises');
  check('Conversation survived reload',await evalText('document.body.innerText.includes("reprise Academy QA")'));
  const result=await evalText(`(async()=>{const r=await fetch('/api/academy/conversation',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({turns:[{role:'user',content:'Reprise QA mise à jour'},{role:'assistant',content:'Discussion sauvegardée'}],diagnostic:{phase:'coaching'}})});return {status:r.status,data:await r.json()}})()`);
  check('Authenticated API saves conversation',result?.status===200&&result?.data?.saved===true);
  await navigate('/exercises');
  check('Saved changes restored in browser',await evalText('document.body.innerText.includes("Reprise QA mise à jour")'));
  const del=await evalText(`(async()=>{const button=[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Nouvelle discussion'));if(!button)return false;button.click();await new Promise(r=>setTimeout(r,1000));const res=await fetch('/api/academy/conversation');const obj=await res.json();return res.ok&&obj.turns.length===0})()`);
  check('New discussion clears persisted conversation',del===true);
  await navigate('/exercises');
  check('Deleted conversation does not return',await evalText('!document.body.innerText.includes("Reprise QA mise à jour")'));
  console.log('BROWSER E2E',pass+'/'+total);
  if(pass!==total)process.exitCode=1;
 }catch(e){console.log('BROWSER TEST ERROR',e.message);process.exitCode=1}
 finally{
  if(ws)ws.close();
  if(chrome){chrome.kill('SIGTERM');await delay(300)}
  if(chromeProfile)try{fs.rmSync(chromeProfile,{recursive:true,force:true,maxRetries:5,retryDelay:100})}catch{}
  if(uid){if(old?.data){const restore=await client.from('academy_conversations').upsert({user_id:uid,...old.data},{onConflict:'user_id'});if(restore.error)console.log('RESTORE ERROR',restore.error.code)}else{const clean=await client.from('academy_conversations').delete().eq('user_id',uid);if(clean.error)console.log('CLEANUP ERROR',clean.error.code)}}
  await client.auth.signOut();
 }
})();
