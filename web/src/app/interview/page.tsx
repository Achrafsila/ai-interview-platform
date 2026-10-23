"use client";
import Link from "next/link";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import {useEffect,useRef,useState} from "react";
import {ArrowLeft,Mic,Volume2,VolumeX,Pause,Play,Send,Check,AlertTriangle} from "lucide-react";
type Config={family:"rh"|"technical";locale:"fr"|"en";jobTitle:string;job_description:string;goals:string[];count:number};
type Response={session_id?:string;question?:{prompt:string};phase?:string;index?:number;total?:number;completed?:boolean;feedback?:string;transcript?:{question:string;answer:string}[];error?:string};
type Recognizer={lang:string;continuous:boolean;interimResults:boolean;onresult:((e:{results:ArrayLike<(ArrayLike<{transcript:string}> & {isFinal:boolean})>})=>void)|null;onerror:((e:{error:string})=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void};
type SpeechWindow=Window & {SpeechRecognition?:new()=>Recognizer;webkitSpeechRecognition?:new()=>Recognizer};
async function send(action:"start"|"answer",payload:object):Promise<Response>{
 const r=await fetch("/api/interview/"+action,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
 const data=await r.json() as Response;
 if(!r.ok)throw new Error(data.error||"Le moteur est indisponible.");
 return data;
}
export default function InterviewPage(){
 const [config,setConfig]=useState<Config|null>(null);
 const [configChecked,setConfigChecked]=useState(false);
 useEffect(()=>{
  // Read after hydration: the server-rendered page cannot access sessionStorage.
  let saved:Config|null=null;
  try{
   const raw=window.sessionStorage.getItem("interview-lab-config");
   if(raw){
    const item=JSON.parse(raw) as Partial<Config>;
    if((item.family==="rh"||item.family==="technical")&&(item.locale==="fr"||item.locale==="en")&&
      typeof item.jobTitle==="string"&&item.jobTitle.trim()&&Array.isArray(item.goals)&&item.goals.length&&
      typeof item.count==="number") saved=item as Config;
   }
  }catch{}
  queueMicrotask(()=>{setConfig(saved);setConfigChecked(true);});
 },[]);
 const [state,setState]=useState<"ready"|"speaking"|"listening"|"thinking"|"paused"|"done"|"error">("ready");
 const [result,setResult]=useState<Response|null>(null);
 const [session,setSession]=useState("");
 const [answer,setAnswer]=useState("");
 const [error,setError]=useState("");
 const [muted,setMuted]=useState(false);
 const [elapsed,setElapsed]=useState(0);
 const [stopOpen,setStopOpen]=useState(false);
 const recognition=useRef<Recognizer|null>(null);
 const voice=useRef<SpeechSynthesisUtterance|null>(null);
 const sessionRef=useRef(false);
 const pausedFrom=useRef<"speaking"|"listening">("listening");
 const [dictating,setDictating]=useState(false);
 const dictationBase=useRef("");
 useEffect(()=>{const t=setInterval(()=>{if(sessionRef.current)setElapsed(s=>s+1)},1000);return()=>clearInterval(t)},[]);
 useEffect(()=>{sessionRef.current=["speaking","listening","thinking"].includes(state);},[state]);
 useEffect(()=>()=>{recognition.current?.stop();setDictating(false);window.speechSynthesis?.cancel();},[]);
 function speak(text:string,locale:string){
  recognition.current?.stop();
  if(!("speechSynthesis" in window)||muted){setState("listening");return;}
  window.speechSynthesis.cancel();
  const utter=new SpeechSynthesisUtterance(text);
  utter.lang=locale==="en"?"en-US":"fr-FR";utter.rate=.96;
  utter.onend=()=>setState(s=>s==="speaking"?"listening":s);
  utter.onerror=()=>setState(s=>s==="speaking"?"listening":s);
  voice.current=utter;
  setState("speaking");window.speechSynthesis.speak(utter);
 }
 async function start(){
  if(!config){setError("Configuration introuvable. Revenez à la préparation pour choisir votre entretien.");return;}
  setError("");setState("thinking");
  try{const data=await send("start",{family:config.family,locale:config.locale,goals:config.goals,count:config.count,job_description:config.job_description});
   setSession(data.session_id||"");setResult(data);speak(data.question?.prompt||"",config.locale);
  }catch(e){setError(e instanceof Error?e.message:"Impossible de lancer la simulation");setState("error");}
 }
 async function submit(){
  if(!session||!answer.trim()||state==="thinking")return;
  recognition.current?.stop();window.speechSynthesis?.cancel();
  setState("thinking");setError("");
  try{
   const data=await send("answer",{session_id:session,answer:answer.trim()});
   setResult(data);setAnswer("");
   if(data.completed){setState("done");return;}
   speak(data.question?.prompt||"",config?.locale||"fr");
  }catch(e){setState("listening");setError(e instanceof Error?e.message:"Impossible de traiter votre réponse");}
 }
 function listen(){
  const w=window as SpeechWindow;
  const C=w.SpeechRecognition||w.webkitSpeechRecognition;
  if(!C){setError("Reconnaissance vocale non disponible dans ce navigateur. Vous pouvez répondre par écrit.");return;}
  if(dictating){recognition.current?.stop();setDictating(false);return;}
  recognition.current?.stop();
  dictationBase.current=answer.trim();
  const r=new C();recognition.current=r;
  r.lang=config?.locale==="en"?"en-US":"fr-FR";r.continuous=true;r.interimResults=true;
  r.onresult=e=>{
   if(recognition.current!==r)return;
   const spoken=Array.from(e.results).map(x=>x[0]?.transcript||"").join(" ").trim();
   const combined=[dictationBase.current,spoken].filter(Boolean).join(" ");
   setAnswer(combined.slice(0,8000));
  };
  r.onerror=e=>{setDictating(false);setError("Microphone : "+e.error+". Vous pouvez aussi utiliser le champ texte.");};
  r.onend=()=>{if(recognition.current===r)setDictating(false);};
  try{r.start();setDictating(true);setError("");setState("listening");}catch{setDictating(false);setError("Impossible de démarrer le microphone.");}
 }
 function togglePause(){
  if(state==="paused"){
   if(pausedFrom.current==="speaking"&&"speechSynthesis" in window&&window.speechSynthesis.paused){
    window.speechSynthesis.resume();setState("speaking");
   }else{setState("listening");}
   return;
  }
  if(state!=="speaking"&&state!=="listening")return;
  pausedFrom.current=state;
  recognition.current?.stop();setDictating(false);
  if(state==="speaking"&&"speechSynthesis" in window)window.speechSynthesis.pause();
  setState("paused");
 }
 function interrupt(){window.speechSynthesis?.cancel();setState("listening");}
 const question=result?.question?.prompt;
 return <main className="min-h-dvh bg-[#F5F7FC] px-4 py-8 text-[#18233D] sm:px-8">
  <div className="mx-auto max-w-5xl">
   <header className="flex flex-wrap items-center justify-between gap-4"><Link href="/preparation" className="inline-flex items-center gap-2 text-sm font-bold text-[#4965BC]"><ArrowLeft size={17}/> Configuration</Link><span className="rounded-full bg-[#E8ECFD] px-4 py-2 text-xs font-bold text-[#4D61AD]">Laboratoire vocal · Non noté</span></header>
   <div className="mt-9 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6479B7]">Simulation {config?.family==="technical"?"technique":"RH"}</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Votre entretien IA</h1><p className="mt-2 text-sm text-[#657691]">{config?.jobTitle||(configChecked?"Configuration manquante":"Chargement de la configuration…")}</p></div><span className="text-sm font-semibold tabular-nums text-[#637493]">{Math.floor(elapsed/60).toString().padStart(2,"0")}:{(elapsed%60).toString().padStart(2,"0")}</span></div>
   <section className="mt-7 rounded-[28px] border border-[#DCE4F4] bg-white p-6 shadow-[0_18px_45px_rgba(43,67,128,.07)] sm:p-10">
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
     <div className="relative size-48 sm:size-56"><VoicePoweredOrb state={state} voiceLevel={dictating ? .55 : 0} className="h-full w-full"/><span className="sr-only">{state==="speaking"?"L’intervieweur parle":dictating?"Microphone actif":state==="listening"?"À vous de répondre":"Orbe d’entretien"}</span></div>
     <p className="mt-5 text-sm font-bold text-[#5266A6]">{({ready:"Prêt à commencer",speaking:"Votre intervieweur parle",listening:"À vous de répondre",thinking:"L'intervieweur prépare sa question",paused:"Entretien en pause",done:"Séance terminée",error:"Connexion indisponible"})[state]}</p>
     <h2 className="mt-6 text-xl font-semibold leading-9 tracking-tight sm:text-2xl">{state==="ready"?"Un entraînement oral adapté à votre configuration.":state==="done"?"Votre entretien est terminé.":question||"Préparation de la prochaine question…"}</h2>
     {state==="ready"&&config&&<button onClick={start} className="mt-8 rounded-xl bg-[#3456D7] px-7 py-4 font-bold text-white"><Play size={17} className="mr-2 inline"/> Commencer l’entretien</button>}
     {state==="ready"&&configChecked&&!config&&<div role="alert" className="mt-7 rounded-2xl border border-[#D4DDF3] bg-[#F4F7FF] p-5 text-left"><p className="text-sm text-[#526482]">Aucun entretien n’a été configuré pour cet onglet. Complétez d’abord les trois étapes pour activer le lancement.</p><Link href="/preparation" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#3456D7] px-5 py-3 text-sm font-bold text-white">Configurer mon entretien</Link></div>}
     {state==="error"&&<button onClick={start} className="mt-7 rounded-xl bg-[#3456D7] px-6 py-3 text-white">Réessayer</button>}
     {state==="speaking"&&<button onClick={interrupt} className="mt-7 rounded-xl border border-[#C8D4F0] px-5 py-3 text-sm font-semibold">Prendre la parole</button>}
     {(state==="listening"||state==="paused")&&<div className="mt-7 w-full text-left">
       <label htmlFor="spoken-answer" className="mb-2 block text-sm font-semibold">Votre réponse {dictating&&<span role="status" className="ml-2 text-[#21866F]">● Transcription en direct…</span>}</label>
       <textarea id="spoken-answer" value={answer} onChange={e=>setAnswer(e.target.value)} disabled={state==="paused"} rows={4} maxLength={8000} placeholder="Parlez avec le microphone ou saisissez votre réponse…" className="w-full resize-y rounded-xl border border-[#D2DBEC] bg-[#FBFCFF] p-4 text-sm leading-7 outline-none focus:border-[#5E77DA] disabled:opacity-60"/>
       <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button disabled={state==="paused"} onClick={listen} className="flex items-center gap-2 rounded-xl border border-[#C9D9ED] px-4 py-3 text-sm font-semibold disabled:opacity-50"><Mic size={18}/> {dictating?"Arrêter la dictée":"Dicter ma réponse"}</button>
        <button disabled={!answer.trim()||state==="paused"} onClick={submit} className="flex items-center gap-2 rounded-xl bg-[#3456D7] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">J’ai terminé <Send size={17}/></button>
       </div>
      </div>}
     {state==="done"&&<div className="mt-7 w-full rounded-2xl bg-[#EFF8F3] p-6 text-left"><div className="flex items-center gap-2 font-bold text-[#247B64]"><Check size={18}/> Bilan pédagogique non noté</div><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#435C56]">{result?.feedback||"Aucun retour disponible."}</p><p className="mt-3 text-xs text-[#65766F]">Cette session locale n’est pas enregistrée dans Supabase et ne met pas encore à jour le dashboard.</p></div>}
     {error&&<p role="alert" className="mt-5 rounded-xl bg-[#FFF0ED] p-3 text-sm text-[#A64040]"><AlertTriangle size={16} className="mr-2 inline"/>{error}</p>}
    </div>
   </section>
   {["speaking","listening","paused"].includes(state)&&<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
    <button onClick={()=>{setMuted(x=>!x);if(!muted&&state==="speaking"){window.speechSynthesis?.cancel();setState("listening");}}} className="flex items-center gap-2 rounded-xl border border-[#D4DEEE] bg-white px-4 py-3 text-sm">{muted?<VolumeX size={18}/>:<Volume2 size={18}/>} {muted?"Son coupé":"Son activé"}</button>
    <button onClick={togglePause} className="flex items-center gap-2 rounded-xl border border-[#D4DEEE] bg-white px-4 py-3 text-sm">{state==="paused"?<Play size={18}/>:<Pause size={18}/>} {state==="paused"?"Reprendre":"Pause"}</button>
    <button onClick={()=>setStopOpen(true)} className="rounded-xl border border-[#F0CCD0] bg-white px-4 py-3 text-sm font-medium text-[#AA4050]">Terminer</button>
   </div>}
   {stopOpen&&<div role="dialog" aria-modal="true" aria-label="Terminer l’entretien" className="mx-auto mt-5 max-w-md rounded-2xl border border-[#F0CCD0] bg-white p-6"><h3 className="font-bold">Terminer cette séance ?</h3><p className="mt-2 text-sm text-[#6C7890]">Les réponses en cours ne pourront pas être conservées et aucun bilan partiel ne sera produit par le laboratoire actuel.</p><div className="mt-5 flex gap-3"><button onClick={()=>setStopOpen(false)} className="rounded-xl border px-4 py-2">Continuer</button><button onClick={()=>{recognition.current?.stop();window.speechSynthesis?.cancel();setStopOpen(false);setResult({completed:true,feedback:"Séance interrompue volontairement. Le laboratoire ne permet pas encore de produire ni de conserver un bilan partiel."});setState("done");}} className="rounded-xl bg-[#A64D58] px-4 py-2 font-bold text-white">Terminer</button></div></div>}
   <p className="mt-7 text-center text-xs leading-6 text-[#7786A0]">Prototype local : questions issues du corpus brouillon ; reconnaissance vocale selon le navigateur ; aucune évaluation chiffrée.</p>
  </div>
 </main>;
}
