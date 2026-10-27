"use client";
import {CandidateSidebar} from "@/components/ui/candidate-sidebar";
import Link from "next/link";
import { getAuthClient } from "@/lib/supabase-auth";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { InterviewAnalysisLoader } from "@/components/ui/interview-analysis-loader";
import { InterviewReport } from "./InterviewReport";
import {useEffect,useRef,useState} from "react";
import {ArrowLeft,Mic,Volume2,VolumeX,Pause,Play,Send,AlertTriangle,Target,Settings2,UserRound} from "lucide-react";
type Config={family:"rh"|"technical";locale:"fr"|"en";jobTitle:string;job_description:string;goals:string[];count:number};
type Response={session_id?:string;question?:{prompt:string};phase?:string;index?:number;total?:number;completed?:boolean;feedback?:string;transcript?:{question:string;answer:string}[];error?:string};
type Recognizer={lang:string;continuous:boolean;interimResults:boolean;onresult:((e:{results:ArrayLike<(ArrayLike<{transcript:string}> & {isFinal:boolean})>})=>void)|null;onerror:((e:{error:string})=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void};
type SpeechWindow=Window & {SpeechRecognition?:new()=>Recognizer;webkitSpeechRecognition?:new()=>Recognizer};
async function sessionToken(){
 const client=getAuthClient();
 if(!client)throw new Error("Service de connexion non configuré.");
 const {data,error}=await client.auth.getSession();
 if(error||!data.session?.access_token)throw new Error("Votre session a expiré. Reconnectez-vous pour poursuivre.");
 return data.session.access_token;
}
async function send(action:"start"|"answer",payload:object):Promise<Response>{
 const token=await sessionToken();
 const r=await fetch("/api/interview/"+action,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(payload)});
 const data=await r.json() as Response;
 if(!r.ok)throw new Error(data.error||"Le moteur est indisponible.");
 return data;
}
function segmentInterviewerText(text:string):string[]{
 const sentences=text.match(/[^.!?…]+(?:[.!?…]+|$)/g)?.map(part=>part.trim()).filter(Boolean)||[];
 if(!sentences.length)return text.trim()?[text.trim()]:[];
 return sentences.flatMap(sentence=>{
  const tokens=sentence.split(/\s+/);
  if(tokens.length<=13)return [sentence];
  const segments:string[]=[];
  for(let index=0;index<tokens.length;index+=11)segments.push(tokens.slice(index,index+11).join(" "));
  return segments;
 });
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
 const [analyzingFinal,setAnalyzingFinal]=useState(false);
 const [introStage,setIntroStage]=useState<"none"|"welcome"|"breathing"|"countdown"|"transition">("none");
 const [introReveal,setIntroReveal]=useState(0);
 const [introNotice,setIntroNotice]=useState("");
 const [preflight,setPreflight]=useState<"checking"|"ready"|"auth"|"offline">("checking");
 const [preflightMessage,setPreflightMessage]=useState("");
 async function checkReadiness(){
  setPreflight("checking");setPreflightMessage("");
  try {
   const token=await sessionToken();
   const response=await fetch("/api/interview/status",{cache:"no-store",credentials:"same-origin",headers:{"Authorization":`Bearer ${token}`}});
   const body=await response.json() as {error?:string};
   if(response.status===401){setPreflight("auth");setPreflightMessage("Votre session a expiré. Reconnectez-vous pour continuer.");return;}
   if(!response.ok){setPreflight("offline");setPreflightMessage(body.error||"La simulation est momentanément indisponible.");return;}
   setPreflight("ready");
  }catch{setPreflight("offline");setPreflightMessage("Impossible de vérifier le service de simulation.");}
 }
 const introAudio=useRef<HTMLAudioElement|null>(null);
 const introInterval=useRef<ReturnType<typeof setInterval>|null>(null);
 const introTransitionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const introFinished=useRef(false);
 const introPhrases=config?.locale==="en"
  ?["I hope you’re ready.","Your interview will begin in five seconds.","Good luck!"]
  :["J’espère que vous êtes prêt !","Votre entretien commencera dans cinq secondes.","Bonne chance !"];
 const recognition=useRef<Recognizer|null>(null);
 const questionAudio=useRef<HTMLAudioElement|null>(null);
 const questionAudioUrl=useRef<string|null>(null);
 const voiceSequence=useRef(0);
 const voiceTimeout=useRef<ReturnType<typeof setTimeout>|null>(null);
 function stopQuestionAudio(){
  if(voiceTimeout.current){clearTimeout(voiceTimeout.current);voiceTimeout.current=null;}
  voiceSequence.current++;
  questionAudio.current?.pause();questionAudio.current=null;
  if(questionAudioUrl.current){URL.revokeObjectURL(questionAudioUrl.current);questionAudioUrl.current=null;}
 }

 const sessionRef=useRef(false);
 const pausedFrom=useRef<"speaking"|"listening">("listening");
 const [dictating,setDictating]=useState(false);
 const [enhancedStt,setEnhancedStt]=useState(false);
 const [enhancedRecording,setEnhancedRecording]=useState(false);
 const recorderRef=useRef<MediaRecorder|null>(null);
 const [transcribing,setTranscribing]=useState(false);
 const dictationBase=useRef("");
 const answerRef=useRef("");
 const submittingRef=useRef(false);
 const silenceTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const autoListenRef=useRef<()=>void>(()=>{});
 const submitRef=useRef<(value:string)=>void>(()=>{});
 const [handsFree,setHandsFree]=useState(true);
 const handsFreeRef=useRef(true);
 const [speechHint,setSpeechHint]=useState("");
 const [voiceNotice,setVoiceNotice]=useState("");
 const [questionReveal,setQuestionReveal]=useState(0);
 function clearSilence(){if(silenceTimer.current){clearTimeout(silenceTimer.current);silenceTimer.current=null;}}
 function stopDictation(){clearSilence();const current=recognition.current;recognition.current=null;current?.stop();setDictating(false);}

 useEffect(()=>{const t=setInterval(()=>{if(sessionRef.current)setElapsed(s=>s+1)},1000);return()=>clearInterval(t)},[]);
 useEffect(()=>{sessionRef.current=["speaking","listening","thinking"].includes(state);},[state]);
 useEffect(()=>{if(state==="listening"||state==="paused"||state==="done"||state==="error"){setVoiceNotice(previous=>previous==="Chargement de la voix…"?"":previous);}},[state]);
 useEffect(()=>()=>{recognition.current?.stop();questionAudio.current?.pause();if(questionAudioUrl.current)URL.revokeObjectURL(questionAudioUrl.current);window.speechSynthesis?.cancel();if(introInterval.current)clearInterval(introInterval.current);if(introTransitionTimer.current)clearTimeout(introTransitionTimer.current);introAudio.current?.pause();if(silenceTimer.current)clearTimeout(silenceTimer.current);},[]);
 function speak(text:string,locale:string){
  stopDictation();stopQuestionAudio();setQuestionReveal(0);
  const total=segmentInterviewerText(text).length;
  if(muted){setQuestionReveal(total);setState("listening");setVoiceNotice("Le son est coupé.");return;}
  const sequence=voiceSequence.current;
  // Always expose the question immediately; audio is progressive enhancement.
  setQuestionReveal(total);
  setState("speaking");
  setVoiceNotice("Chargement de la voix…");
  voiceTimeout.current=setTimeout(()=>{
   if(sequence!==voiceSequence.current)return;
   window.speechSynthesis?.cancel();
   setState("listening");
   setVoiceNotice("La voix ne répond pas. Vous pouvez répondre directement, ou réessayer l’écoute.");
  },6500);
  // Production-safe browser TTS: localhost-only audio service is not available on Vercel.
  if("speechSynthesis" in window && "SpeechSynthesisUtterance" in window){
   const utterance=new SpeechSynthesisUtterance(text);
   utterance.lang=locale==="en"?"en-US":"fr-FR";
   utterance.rate=0.98;
   utterance.onstart=()=>{if(sequence===voiceSequence.current){if(voiceTimeout.current)clearTimeout(voiceTimeout.current);voiceTimeout.current=null;setVoiceNotice("");}};
   utterance.onend=()=>{if(sequence===voiceSequence.current){if(voiceTimeout.current)clearTimeout(voiceTimeout.current);voiceTimeout.current=null;setState("listening");setVoiceNotice("");if(handsFreeRef.current)queueMicrotask(()=>autoListenRef.current());}};
   utterance.onerror=()=>{if(sequence===voiceSequence.current){if(voiceTimeout.current)clearTimeout(voiceTimeout.current);voiceTimeout.current=null;setQuestionReveal(total);setState("listening");setVoiceNotice("Audio navigateur indisponible, vous pouvez répondre par écrit.");}};
   try{window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);}catch{if(voiceTimeout.current)clearTimeout(voiceTimeout.current);voiceTimeout.current=null;setState("listening");setVoiceNotice("La synthèse vocale est indisponible. Répondez directement.");}
   return;
  }
  const url="/api/interview/tts?"+new URLSearchParams({text,locale}).toString();
  const audio=new Audio();
  audio.preload="auto";
  questionAudio.current=audio;
  audio.onplaying=()=>{
   if(sequence!==voiceSequence.current)return;
   if(voiceTimeout.current)clearTimeout(voiceTimeout.current);voiceTimeout.current=null;
   setVoiceNotice("");
   // Reveal the full question with a smooth entrance; audio duration is not word alignment.
   setQuestionReveal(total);
  };

  audio.onended=()=>{
   if(sequence!==voiceSequence.current)return;
   setQuestionReveal(total);stopQuestionAudio();setState("listening");setVoiceNotice("");
   if(handsFreeRef.current)queueMicrotask(()=>autoListenRef.current());
  };
  audio.onerror=()=>{
   if(sequence!==voiceSequence.current)return;
   if(voiceTimeout.current)clearTimeout(voiceTimeout.current);voiceTimeout.current=null;
   setQuestionReveal(total);setState("listening");
   setVoiceNotice("La lecture a échoué. Essayez « Écouter la question ».");
  };
  audio.src=url;
  void audio.play().catch(()=>{
   if(sequence!==voiceSequence.current)return;
   setQuestionReveal(total);setState("listening");
   setVoiceNotice("Chrome a bloqué la lecture automatique. Cliquez sur « Écouter la question ».");
  });
 }
 function start(){
  if(!config){setError("Configuration introuvable. Revenez à la préparation.");return;}
  setError("");setIntroReveal(0);setIntroNotice("");
  introFinished.current=false;
  if(introInterval.current)clearInterval(introInterval.current);
  setIntroStage("welcome");
 }
 function finishIntroduction(){
  if(introFinished.current)return;
  introFinished.current=true;
  introAudio.current?.pause();
  if(introInterval.current)clearInterval(introInterval.current);
  setIntroNotice("");
  setIntroReveal(introPhrases.length);
  setIntroStage("breathing");
  if(introTransitionTimer.current)clearTimeout(introTransitionTimer.current);
  introTransitionTimer.current=setTimeout(()=>setIntroStage(preflight==="ready"?"countdown":"breathing"),650);
 }
 function playIntro(){
  const audio=introAudio.current;
  if(!audio)return;
  audio.currentTime=0;
  void audio.play().then(()=>setIntroNotice("")).catch(()=>{
   setIntroNotice("Le navigateur bloque la lecture automatique. Cliquez sur « Écouter le message » pour lancer la voix.");
  });
 }
 useEffect(()=>{
  if(introStage!=="welcome")return;
  // Autoplay is opportunistic; an explicit user click remains available.
  const audio=introAudio.current;
  if(!audio)return;
  void audio.play().catch(()=>{
   setIntroNotice("Cliquez sur « Écouter le message » pour activer la voix.");
  });
 },[introStage]);
 useEffect(()=>{if(config)queueMicrotask(()=>void checkReadiness());
 // Initial check is tied to a new interview configuration.
 },[config]);
 useEffect(()=>{
  if(introStage!=="breathing"||preflight!=="ready"||!introFinished.current)return;
  const timeout=setTimeout(()=>setIntroStage("countdown"),650);
  return()=>clearTimeout(timeout);
 },[introStage,preflight]);
 // Launch the immersive introduction immediately when a configured interview opens.
 useEffect(()=>{
  if(!config||state!=="ready"||introStage!=="none")return;
  queueMicrotask(()=>start());
  // start intentionally depends on the loaded configuration, not on each render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[config]);
 function finishCountdown(){
  if(preflight!=="ready")return;
  setIntroStage("transition");
  if(introTransitionTimer.current)clearTimeout(introTransitionTimer.current);
  introTransitionTimer.current=setTimeout(()=>void startInterview(),500);
 }
 async function startInterview(){
  setIntroStage("none");
  if(!config)return;
  setError("");setState("thinking");
  try{const data=await send("start",{family:config.family,locale:config.locale,goals:config.goals,count:config.count,warm_opening:true,job_title:config.jobTitle,job_description:config.job_description});
   setSession(data.session_id||"");setResult(data);speak(data.question?.prompt||"",config.locale);
  }catch(e){setError(e instanceof Error?e.message:"Impossible de lancer la simulation");setState("error");}
 }
 async function submitValue(value:string){
  if(!session||!value.trim()||submittingRef.current)return;
  submittingRef.current=true;
  stopDictation();
  stopQuestionAudio();window.speechSynthesis?.cancel();
  const lastPlannedQuestion=Boolean(result?.total && result?.index && result.index>=result.total);
  setAnalyzingFinal(lastPlannedQuestion);
  setState("thinking");setError("");setSpeechHint("");
  try{
   const data=await send("answer",{session_id:session,answer:value.trim()});
   setResult(data);setAnswer("");answerRef.current="";
   if(data.completed){setState("done");return;}
   speak(data.question?.prompt||"",config?.locale||"fr");
  }catch(e){
   setState("listening");setError(e instanceof Error?e.message:"Impossible de traiter votre réponse");
  }finally{submittingRef.current=false;setAnalyzingFinal(false);}
 }

 function submit(){void submitValue(answerRef.current||answer);}
 async function recordEnhanced(){
  if(enhancedRecording){recorderRef.current?.stop();setEnhancedRecording(false);return;}
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){
   setError("Enregistrement audio non disponible dans ce navigateur.");return;
  }
  let stream:MediaStream|null=null;
  try{
   stream=await navigator.mediaDevices.getUserMedia({audio:true});
   const mime=["audio/webm","audio/mp4","audio/ogg"].find(type=>MediaRecorder.isTypeSupported(type));
   if(!mime)throw new Error("Format audio non pris en charge");
   const recordingStream=stream;
   const recorder=new MediaRecorder(recordingStream,{mimeType:mime});recorderRef.current=recorder;
   const chunks:Blob[]=[];
   recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
   recorder.onstop=()=>{
    recordingStream.getTracks().forEach(track=>track.stop());
    setEnhancedRecording(false);
    if(!chunks.length)return;
    setTranscribing(true);setSpeechHint("Transcription multilingue en cours…");
    void (async()=>{
     try{
      const blob=new Blob(chunks,{type:mime});
      const base64=await new Promise<string>((resolve,reject)=>{
       const reader=new FileReader();
       reader.onload=()=>resolve(String(reader.result).split(",")[1]||"");
       reader.onerror=()=>reject(new Error("Lecture audio impossible"));
       reader.readAsDataURL(blob);
      });
      const res=await fetch("/api/interview/transcribe",{method:"POST",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({audio:base64,mime,context:config?.jobTitle||""})});
      const data=await res.json() as {text?:string;error?:string};
      if(!res.ok||!data.text)throw new Error(data.error||"Transcription vide");
      answerRef.current=[answerRef.current,data.text].filter(Boolean).join(" ").slice(0,8000);
      setAnswer(answerRef.current);setSpeechHint("Transcription terminée : vérifiez le texte avant de répondre.");
     }catch(e){setError("Transcription multilingue indisponible : "+(e instanceof Error?e.message:"erreur"));}
     finally{setTranscribing(false);}
    })();
   };
   recorder.start();setEnhancedRecording(true);setError("");setSpeechHint("Enregistrement en cours : cliquez pour terminer.");
  }catch(e){stream?.getTracks().forEach(track=>track.stop());setError(e instanceof Error?e.message:"Microphone indisponible");}
 }
 function listen(automatic=false){
  const w=window as SpeechWindow;
  const C=w.SpeechRecognition||w.webkitSpeechRecognition;
  if(!C){
   if(!automatic)setError("Reconnaissance vocale non disponible dans ce navigateur. Vous pouvez répondre par écrit.");
   setSpeechHint("Dictée non disponible : utilisez le champ texte.");
   return;
  }
  if(recognition.current){
   if(!automatic)stopDictation();
   return;
  }
  dictationBase.current=answerRef.current.trim();
  const r=new C();recognition.current=r;
  r.lang=config?.locale==="en"?"en-US":"fr-FR";r.continuous=true;r.interimResults=true;
  r.onresult=e=>{
   if(recognition.current!==r)return;
   const results=Array.from(e.results);
   const spoken=results.map(x=>x[0]?.transcript||"").join(" ").trim();
   const combined=[dictationBase.current,spoken].filter(Boolean).join(" ").slice(0,8000);
   answerRef.current=combined;setAnswer(combined);clearSilence();
   const final=results.length>0&&results.every(x=>x.isFinal);
   // Wait for a completed recognition hypothesis and a meaningful silence.
   // Browser speech recognition is not a reliable VAD; the manual button remains available.
   if(automatic&&handsFreeRef.current&&final&&combined.trim().split(/\s+/).length>=4){
    setSpeechHint("Pause détectée : je vous laisse terminer votre idée…");
    silenceTimer.current=setTimeout(()=>{
     if(recognition.current===r&&!submittingRef.current&&handsFreeRef.current)
      submitRef.current(answerRef.current);
    },3200);
   }else if(automatic)setSpeechHint("Je vous écoute…");
  };
  r.onerror=e=>{
   clearSilence();if(recognition.current===r)recognition.current=null;
   setDictating(false);setSpeechHint("");
   if(e.error==="no-speech"){
    setSpeechHint("Aucune parole détectée. Réessayez le micro ou répondez par écrit.");
    setError("");
   }else if(e.error==="not-allowed"||e.error==="service-not-allowed"){
    setError("Le microphone est bloqué. Autorisez son utilisation dans le navigateur ou répondez par écrit.");
   }else{
    setError("Reconnaissance vocale indisponible ("+e.error+"). Vous pouvez répondre par écrit.");
   }
  };
  r.onend=()=>{
   clearSilence();
   if(recognition.current===r){recognition.current=null;setDictating(false);setSpeechHint("La dictée s’est arrêtée. Relancez-la si nécessaire.");}
  };
  try{r.start();setDictating(true);setError("");setSpeechHint(automatic?"Je vous écoute…":"Dictée active");setState("listening");}
  catch{recognition.current=null;setDictating(false);if(!automatic)setError("Impossible de démarrer le microphone.");}
 }
 useEffect(()=>{
  submitRef.current=(value)=>{void submitValue(value);};
  autoListenRef.current=()=>{if(!enhancedStt&&handsFreeRef.current&&!recognition.current)listen(true);};
 });
 function togglePause(){
  if(state==="paused"){
   if(pausedFrom.current==="speaking"&&questionAudio.current){void questionAudio.current.play();setState("speaking");}
   else if(pausedFrom.current==="speaking"&&"speechSynthesis" in window&&window.speechSynthesis.paused){
    window.speechSynthesis.resume();questionAudio.current?.play().catch(()=>{});setState("speaking");
   }else{setState("listening");}
   return;
  }
  if(state!=="speaking"&&state!=="listening")return;
  pausedFrom.current=state;
  stopDictation();
  if(state==="speaking"){questionAudio.current?.pause();if("speechSynthesis" in window)window.speechSynthesis.pause();}
  setState("paused");
 }
 function interrupt(){setQuestionReveal(segmentInterviewerText(result?.question?.prompt||"").length);stopQuestionAudio();window.speechSynthesis?.cancel();setVoiceNotice("");setState("listening");if(handsFreeRef.current)queueMicrotask(()=>autoListenRef.current());}
 const question=result?.question?.prompt;
 if(!configChecked || (config&&state==="ready"&&introStage==="none"))return <main role="status" className="flex min-h-dvh items-center justify-center bg-[#0C1436] text-sm font-semibold text-[#B8C8E8]">Préparation de votre entretien…</main>;
 if(introStage!=="none")return <main className="interview-intro-v3 relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#FAFAFF] px-5 py-12 text-[#1C2850]">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_25%,#EBEBFF_0%,transparent_53%),radial-gradient(ellipse_at_85%_75%,#F9EAF9_0%,transparent_55%)]"/>
  <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
   {introStage==="countdown"?
    <div className="flex min-h-[65vh] flex-col items-center justify-center animate-[fade-in_.45s_ease-out]">
     <p className="mb-8 text-xs font-bold uppercase tracking-[.25em] text-[#7C73AB]">Votre entretien commence</p>
     <CountdownTimer onComplete={finishCountdown} variant="light"/>
    </div>:
    introStage==="transition"?
    <p role="status" className="text-lg font-semibold text-[#6A58D4]">Connexion à votre intervieweur…</p>:
    <>
     <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E4E0FA] bg-white/80 px-4 py-2 text-xs font-semibold text-[#7663C4] shadow-sm"><span className="size-2 rounded-full bg-[#7ADCC9]"/>{config?.family==="technical"?"Entretien technique":"Entretien RH"} · {config?.jobTitle}</span>
     <p className="text-xs font-extrabold uppercase tracking-[.26em] text-[#8671DD]">INTERVIEWLAB</p>
     <h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] text-[#1C2850] sm:text-5xl">{introStage==="welcome"?"Bienvenue dans votre entretien":preflight==="ready"?"Vous êtes prêt.":"Préparons votre connexion"}</h1>
     <p className="mt-4 max-w-xl text-base leading-7 text-[#6B7898]">{introStage==="welcome"?"Votre intervieweur IA vous accueille. Écoutez son message avant de commencer.":preflight==="ready"?"Votre préparation est terminée. Démarrez lorsque vous êtes prêt.":"Nous vérifions votre accès à la simulation."}</p>
     <div className="intro-v3-orb relative my-8 size-48 sm:size-60"><VoicePoweredOrb state={introStage==="welcome"?"speaking":"ready"} voiceLevel={introStage==="welcome"?.25+.13*Math.sin(introReveal*1.6):.04} className="h-full w-full"/></div>
     {introStage==="welcome"&&<audio ref={introAudio} preload="auto" src={config?.locale==="en"?"/audio/interview-intro-en.mp3":"/audio/interview-intro-fr.mp3"}
      onPlay={()=>{
       setIntroNotice("");
       if(introInterval.current)clearInterval(introInterval.current);
       setIntroReveal(1);
       introInterval.current=setInterval(()=>{
        const audio=introAudio.current;
        if(!audio||audio.paused)return;
        const portion=audio.duration>0&&Number.isFinite(audio.duration)?audio.currentTime/audio.duration:0;
        setIntroReveal(Math.max(1,Math.min(introPhrases.length,1+Math.floor(portion*introPhrases.length))));
       },120);
      }}
      onEnded={finishIntroduction}
      onError={()=>setIntroNotice("Le message audio n’est pas disponible. Vous pouvez continuer sans audio.")}/>}
     {introStage==="welcome"?
      <div className="flex min-h-36 flex-col items-center justify-center gap-3" aria-live="polite">
       <div className="flex max-w-xl flex-col items-center gap-2 text-balance text-xl font-semibold leading-8 sm:text-2xl">
        {introPhrases.map((phrase,index)=><span key={index} className={`transition-all duration-500 ${introReveal>index?"translate-y-0 opacity-100":"translate-y-2 opacity-0"} ${index===2?"bg-gradient-to-r from-[#5B64F1] to-[#D251C6] bg-clip-text text-transparent":"text-[#25335A]"}`}>{phrase}</span>)}
       </div>
       {introNotice&&<p role="status" className="max-w-md text-sm text-[#8761B7]">{introNotice}</p>}
       <button type="button" onClick={playIntro} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#DCD7F9] bg-white px-5 text-sm font-semibold text-[#6452CB] shadow-sm"><Volume2 size={17}/> Réécouter le message</button>
       {introNotice&&<button type="button" onClick={finishIntroduction} className="text-sm font-semibold text-[#6555CD] underline underline-offset-4">Continuer sans audio</button>}
      </div>:
      <div className="flex min-h-36 flex-col items-center justify-center gap-4">
       {preflight==="ready"?<p className="text-sm font-semibold text-[#6958CB]">Votre entretien démarre…</p>:
        <><p role="status" className="max-w-lg text-sm text-[#725F95]">{preflight==="checking"?"Vérification des services…":preflightMessage}</p>
         {preflight==="auth"?<Link href="/login" className="rounded-xl bg-[#625CE6] px-6 py-3 text-sm font-bold text-white">Se reconnecter</Link>:<button type="button" onClick={()=>void checkReadiness()} className="rounded-xl bg-[#625CE6] px-6 py-3 text-sm font-bold text-white">Réessayer la connexion</button>}</>}
       <Link href="/preparation" className="text-sm font-medium text-[#71809D] underline underline-offset-4">Retour à la configuration</Link>
      </div>}
    </>}
  </div>
 </main>;
  if(analyzingFinal && state==="thinking")return <InterviewAnalysisLoader />;
 if(state==="done")return <InterviewReport feedback={result?.feedback} jobTitle={config?.jobTitle} family={config?.family} elapsed={elapsed} transcript={result?.transcript} interrupted={!result?.transcript?.length && Boolean(result?.feedback?.startsWith("Séance interrompue"))}/>;
 return <main className="interview-session-v2 relative min-h-dvh overflow-x-clip bg-[#F8F9FF] px-4 py-7 text-[#172041] sm:px-8 sm:py-10"><div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(ellipse_at_50%_20%,#E9E8FF_0%,#F8F9FF_60%,transparent_85%)]"/><div className="absolute -right-36 top-40 size-[430px] rounded-full bg-[#BA58EE]/15 blur-[110px]"/><div className="absolute -left-36 top-[36%] size-[440px] rounded-full bg-[#5365FF]/15 blur-[110px]"/></div>
  <div className="relative mx-auto flex min-h-dvh max-w-[1720px] gap-0">
   <CandidateSidebar/>
   <div className="min-w-0 flex-1 px-1 pb-12 sm:px-4 lg:px-8">
   <header className="flex flex-wrap items-center justify-between gap-4"><Link href="/preparation" className="interview-v2-glass inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-sm font-bold"><ArrowLeft size={17}/> Configuration</Link><span className="interview-v2-pill rounded-full px-4 py-2 text-xs font-bold">Entretien d’entraînement</span></header>
   <div className="mt-9 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8256E9]">Simulation {config?.family==="technical"?"technique":"RH"}</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Votre entretien IA</h1><p className="mt-2 text-sm text-[#697694]">{config?.jobTitle||(configChecked?"Configuration manquante":"Chargement de la configuration…")}</p></div><span className="text-sm font-semibold tabular-nums text-[#566382]">{Math.floor(elapsed/60).toString().padStart(2,"0")}:{(elapsed%60).toString().padStart(2,"0")}</span></div>
   <div className="mt-7 grid items-start gap-5 xl:grid-cols-[minmax(300px,.85fr)_minmax(0,1.15fr)]">
    <section className="rounded-[26px] border border-[#E3E5F5] bg-white p-6 shadow-[0_15px_45px_rgba(66,70,137,.06)] sm:p-8">
     <p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#8657E4]">Votre séance</p>
     <h2 className="mt-3 text-xl font-extrabold tracking-tight text-[#1B2850]">{config?.family==="technical"?"Entretien technique":"Entretien RH"}</h2>
     <div className="mt-5 rounded-2xl border border-[#E6E8F8] bg-[#FAFAFF] p-4"><p className="text-xs font-semibold text-[#8290AD]">Poste préparé</p><p className="mt-1 font-bold text-[#26365D]">{config?.jobTitle}</p></div>
     <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#E6E8F8] p-4"><span className="grid size-11 place-items-center rounded-2xl bg-[#EDE7FF] text-[#8057DD]"><UserRound size={21}/></span><div><p className="text-sm font-bold text-[#25345C]">Intervieweur IA</p><p className="text-xs text-[#75839F]">Simulation conversationnelle · {config?.locale==="en"?"Anglais":"Français"}</p></div></div>
     <h3 className="mt-7 text-sm font-bold text-[#26365D]">Votre objectif</h3><p className="mt-2 text-sm leading-7 text-[#697794]">Répondez naturellement aux questions. Prenez le temps de structurer vos idées et illustrez-les par des exemples concrets.</p>
     <div className="mt-6 rounded-2xl bg-[#F0EDFF] p-5"><p className="flex items-center gap-2 text-sm font-bold text-[#7751D4]"><Target size={17}/> Conseils pour la séance</p><p className="mt-2 text-sm leading-7 text-[#4F5E87]">Écoutez la question, expliquez votre action personnelle et terminez par le résultat obtenu.</p></div>
     <Link href="/preparation" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#7457CA]"><Settings2 size={16}/> Modifier la configuration</Link>
    </section>
    <div className="min-w-0">
   <section className="interview-v2-stage mt-0 rounded-[28px] p-6 sm:p-8">
    <div className="mx-auto flex w-full max-w-[920px] flex-col items-center text-center">
     <div className="interview-v2-orb relative size-28 sm:size-36"><VoicePoweredOrb state={state} voiceLevel={dictating ? .55 : 0} className="h-full w-full"/><span className="sr-only">{state==="speaking"?"L’intervieweur parle":dictating?"Microphone actif":state==="listening"?"À vous de répondre":"Orbe d’entretien"}</span></div>
     <p className="mt-5 text-sm font-bold text-[#7655D1]">{({ready:"Prêt à commencer",speaking:"Votre intervieweur parle",listening:"À vous de répondre",thinking:"L'intervieweur prépare sa question",paused:"Entretien en pause",error:"Connexion indisponible"})[state]}</p>
     <div className="mt-5 flex min-h-24 w-full items-center justify-center">
      {question&&state!=="ready"?
       <h2 aria-label={question} className="flex max-w-[640px] flex-col items-center gap-2 text-balance text-center text-lg font-semibold leading-[1.55] tracking-tight text-[#25345D] sm:text-[23px]">
        {segmentInterviewerText(question).map((phrase,index)=><span key={result?.session_id+"-"+(result?.index||0)+"-"+index} aria-hidden="true"
         className={`block transform-gpu transition-[opacity,transform,filter] duration-700 ease-out motion-reduce:transition-none ${questionReveal>index?"translate-y-0 opacity-100 blur-none":"translate-y-3 opacity-0 blur-[6px]"}`}>{phrase}</span>)}
       </h2>:
       <h2 className="text-xl font-semibold leading-9 tracking-tight text-[#24335A] sm:text-2xl">{state==="ready"?"Un entraînement oral adapté à votre configuration.":"Préparation de la prochaine question…"}</h2>}
     </div>
     {state==="ready"&&introStage==="none"&&configChecked&&!config&&<div role="alert" className="mt-7 rounded-2xl border border-[#D4DDF3] bg-[#F4F7FF] p-5 text-left"><p className="text-sm text-[#526482]">Aucun entretien n’a été configuré pour cet onglet. Complétez d’abord les trois étapes pour activer le lancement.</p><Link href="/preparation" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#3456D7] px-5 py-3 text-sm font-bold text-white">Configurer mon entretien</Link></div>}
     {state==="error"&&<button onClick={()=>void startInterview()} className="mt-7 rounded-xl bg-[#3456D7] px-6 py-3 text-white">Réessayer</button>}
     {(state==="speaking"||state==="listening")&&question&&<button type="button" onClick={()=>{
      stopDictation();stopQuestionAudio();void speak(question,config?.locale||"fr");
     }} className="interview-v2-glass mt-5 inline-flex min-h-12 items-center rounded-2xl px-5 py-3 text-sm font-semibold"><Volume2 size={17} className="mr-2 inline"/> Écouter la question</button>}
     {voiceNotice&&<p role="status" className="mt-3 text-sm text-[#925A34]">{voiceNotice}</p>}
     {state==="speaking"&&<button onClick={interrupt} className="interview-v2-glass mt-7 rounded-2xl px-5 py-3 text-sm font-semibold">Prendre la parole</button>}
     {(state==="listening"||state==="paused")&&<div className="mt-7 w-full text-left">
       <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs text-[#D1D9FF]">
        <span>{handsFree?"Mode mains libres actif":"Mode manuel actif"} · {speechHint||"Vous gardez le contrôle de votre réponse."}</span>
        <button type="button" className="font-bold underline underline-offset-4" onClick={()=>{
         const next=!handsFree;setHandsFree(next);handsFreeRef.current=next;clearSilence();
         if(next&&state==="listening"&&!recognition.current)listen(true);
        }}>{handsFree?"Passer en manuel":"Activer le mains libres"}</button>
       </div>
       <div className="mb-3 flex items-center justify-between gap-3 text-xs text-[#B9C7E8]">
        <span>{enhancedStt?"Whisper : transcription multilingue après enregistrement":"Dictée instantanée Chrome"}</span>
        <button type="button" className="font-semibold underline underline-offset-4" onClick={()=>{stopDictation();if(recorderRef.current?.state==="recording")recorderRef.current.stop();setEnhancedStt(v=>!v);setSpeechHint("");}}>
         {enhancedStt?"Dictée instantanée":"Tester le STT multilingue"}
        </button>
       </div>
       <label htmlFor="spoken-answer" className="mb-2 block text-sm font-semibold">Votre réponse {dictating&&<span role="status" className="ml-2 text-[#33D5D1]">● Transcription en direct…</span>}</label>
       <textarea id="spoken-answer" value={answer} onChange={e=>{answerRef.current=e.target.value;setAnswer(e.target.value);clearSilence();}} disabled={state==="paused"} rows={4} maxLength={8000} placeholder="Parlez avec le microphone ou saisissez votre réponse…" className="w-full resize-y rounded-2xl border border-white/20 bg-white/95 p-4 text-sm leading-7 text-[#172041] outline-none focus:border-[#BA92FF] focus:ring-2 focus:ring-[#BA92FF]/30 disabled:opacity-60"/>
       <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button disabled={state==="paused"||transcribing} onClick={()=>enhancedStt?void recordEnhanced():listen(false)} className="interview-v2-glass inline-flex min-h-12 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold disabled:opacity-60"><Mic size={18}/> {enhancedStt?(transcribing?"Transcription en cours…":enhancedRecording?"Arrêter l’enregistrement":"Enregistrer ma réponse"):(dictating?"Arrêter la dictée":"Dicter ma réponse")}</button>
        <button disabled={!answer.trim()||state==="paused"||transcribing||enhancedRecording} onClick={submit} className="interview-v2-primary inline-flex min-h-12 items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold disabled:opacity-70">J’ai terminé <Send size={17}/></button>
       </div>
      </div>}

     {error&&<p role="alert" className="mt-5 rounded-xl bg-[#FFF0ED] p-3 text-sm text-[#A64040]"><AlertTriangle size={16} className="mr-2 inline"/>{error}</p>}
    </div>
   </section>
   {["speaking","listening","paused"].includes(state)&&<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
    <button onClick={()=>{setMuted(x=>!x);if(!muted&&state==="speaking"){stopQuestionAudio();window.speechSynthesis?.cancel();setState("listening");}}} className="interview-v2-glass inline-flex min-h-12 items-center gap-2 rounded-2xl px-5 py-3 text-sm">{muted?<VolumeX size={18}/>:<Volume2 size={18}/>} {muted?"Son coupé":"Son activé"}</button>
    <button onClick={togglePause} className="interview-v2-glass inline-flex min-h-12 items-center gap-2 rounded-2xl px-5 py-3 text-sm">{state==="paused"?<Play size={18}/>:<Pause size={18}/>} {state==="paused"?"Reprendre":"Pause"}</button>
    <button onClick={()=>setStopOpen(true)} className="interview-v2-glass-danger min-h-12 rounded-2xl px-5 py-3 text-sm font-semibold">Terminer</button>
   </div>}
    </div></div>
   {stopOpen&&<div role="dialog" aria-modal="true" aria-label="Terminer l’entretien" className="mx-auto mt-5 max-w-md rounded-[24px] border border-[#CEB2DC]/40 bg-[#1C2548] p-6 shadow-2xl"><h3 className="font-bold">Terminer cette séance ?</h3><p className="mt-2 text-sm text-[#CFD6EA]">Les réponses en cours ne pourront pas être conservées et aucun bilan partiel ne sera produit par le laboratoire actuel.</p><div className="mt-5 flex gap-3"><button onClick={()=>setStopOpen(false)} className="interview-v2-glass min-h-11 rounded-2xl px-5 py-2">Continuer</button><button onClick={()=>{stopDictation();stopQuestionAudio();window.speechSynthesis?.cancel();setStopOpen(false);setResult({completed:true,feedback:"Séance interrompue volontairement. Le laboratoire ne permet pas encore de produire ni de conserver un bilan partiel."});setState("done");}} className="interview-v2-glass-danger min-h-11 rounded-2xl px-5 py-2 font-bold">Terminer</button></div></div>}
   <p className="mt-7 text-center text-xs leading-6 text-[#A9B5D3]">Prototype local : questions issues du corpus brouillon ; reconnaissance vocale selon le navigateur ; aucune évaluation chiffrée.</p>
   </div>
  </div>
 </main>;
}
