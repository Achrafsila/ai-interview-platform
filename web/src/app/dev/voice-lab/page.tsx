"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {ArrowLeft,AudioLines,Play,Square,Upload} from "lucide-react";
const samples={
 intro:"Bonjour, merci d'être avec nous aujourd'hui. Pour commencer, pouvez-vous me parler d'une expérience dans laquelle vous avez piloté une stratégie de recrutement ?",
 relance:"Vous avez évoqué une réduction des délais de recrutement. Comment avez-vous mesuré l'impact de vos actions ?",
 situation:"Un manager souhaite recruter immédiatement un profil rare, sans revoir son budget. Comment abordez-vous cette demande ?"
};
type Sample=keyof typeof samples;
export default function VoiceLab(){
 const [scenario,setScenario]=useState<Sample>("intro");
 const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
 const [voiceURI,setVoiceURI]=useState("");
 const [speed,setSpeed]=useState(0.96);
 const [notice,setNotice]=useState("");
 const [kokoroState,setKokoroState]=useState<"idle"|"playing"|"error">("idle");
 const [clip,setClip]=useState<string|null>(null);
 const [filename,setFilename]=useState("");
 const kokoroSample=`/voice-lab/kokoro-${scenario}.wav`;
 const audioRef=useRef<HTMLAudioElement|null>(null);
 const urlRef=useRef<string|null>(null);
 const speechTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const speechRun=useRef(0);
 const utteranceRef=useRef<SpeechSynthesisUtterance|null>(null);
 useEffect(()=>{
  const update=()=>{if(!('speechSynthesis' in window))return;const found=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('fr'));setVoices(found);setVoiceURI(prev=>prev&&found.some(v=>v.voiceURI===prev)?prev:(found[0]?.voiceURI||''));};
  update();if('speechSynthesis' in window)window.speechSynthesis.addEventListener('voiceschanged',update);
  return()=>{window.speechSynthesis?.cancel();window.speechSynthesis?.removeEventListener('voiceschanged',update);};
 },[]);
 useEffect(()=>()=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current);},[]);
 const stop=()=>{speechRun.current++;if(speechTimer.current)clearTimeout(speechTimer.current);speechTimer.current=null;utteranceRef.current=null;window.speechSynthesis?.cancel();audioRef.current?.pause();setKokoroState('idle');setNotice('Lecture arrêtée.');};
 const playKokoro=async()=>{const audio=audioRef.current;if(!audio){setNotice('Lecteur audio indisponible.');return;}window.speechSynthesis?.cancel();setKokoroState('idle');setNotice('Ouverture de la lecture Kokoro…');try{audio.load();await audio.play();setKokoroState('playing');setNotice('Lecture Kokoro en cours.');}catch{setKokoroState('error');setNotice('La lecture Kokoro est bloquée sur ce navigateur. Utilisez « Ouvrir le fichier audio ».');}};
 const playBrowser=()=>{
  stop();
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){setNotice('Ce navigateur ne prend pas en charge la synthèse vocale.');return;}
  const engine=window.speechSynthesis;
  const id=++speechRun.current;
  const available=engine.getVoices();
  const selected=available.find(v=>v.voiceURI===voiceURI)||available.find(v=>v.lang.toLowerCase().startsWith('fr'));
  const utterance=new SpeechSynthesisUtterance(samples[scenario]);
  utteranceRef.current=utterance;
  utterance.lang=selected?.lang||'fr-FR';utterance.rate=speed;utterance.voice=selected||null;
  const finish=(message:string)=>{if(id!==speechRun.current)return;if(speechTimer.current)clearTimeout(speechTimer.current);speechTimer.current=null;setNotice(message);};
  utterance.onstart=()=>finish(`Lecture en cours : ${selected?.name||'voix système'}.`);
  utterance.onend=()=>finish('Lecture terminée.');
  utterance.onerror=e=>finish(`Voix du navigateur indisponible (${e.error||'erreur inconnue'}). Testez une autre voix ou utilisez Kokoro.`);
  setNotice('Initialisation de la voix du navigateur…');
  speechTimer.current=setTimeout(()=>{if(id!==speechRun.current||engine.speaking)return;finish('La synthèse vocale ne démarre pas. Vérifiez les voix installées sur votre appareil ou utilisez Kokoro.');engine.cancel();},6000);
  try{engine.resume();engine.speak(utterance);}catch{finish('Impossible de lancer la voix du navigateur. Kokoro reste disponible.');}
 };
 const onFile=(file?:File)=>{if(!file)return;if(!['audio/wav','audio/x-wav','audio/mpeg','audio/mp3'].includes(file.type)&&!(/\.(wav|mp3)$/i.test(file.name))){setNotice('Importez uniquement un fichier WAV ou MP3.');return;}if(file.size>12*1024*1024){setNotice('Fichier trop volumineux (12 Mo maximum).');return;}stop();if(urlRef.current)URL.revokeObjectURL(urlRef.current);const url=URL.createObjectURL(file);urlRef.current=url;setClip(url);setFilename(file.name);setNotice('Échantillon chargé localement, sans envoi au serveur.');};
 return <main className="min-h-dvh bg-[#F5F4FD] px-5 py-9 text-[#1A2545] sm:px-10"><div className="mx-auto max-w-4xl"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#6653DC]"><ArrowLeft size={16}/> Tableau de bord</Link><div className="mt-8 flex items-center gap-3"><span className="rounded-2xl bg-[#EDE8FF] p-3 text-[#6B51DD]"><AudioLines/></span><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#7656C9]">InterviewLab · Prototype</p><h1 className="text-3xl font-semibold">Voice Lab</h1></div></div><p className="mt-4 max-w-2xl leading-7 text-[#61708E]">Comparez une voix française du navigateur et un fichier audio généré hors ligne avec Kokoro. Aucun abonnement ElevenLabs, aucun téléchargement du modèle dans votre entretien.</p>
 <div className="mt-7 rounded-[26px] border border-[#DDDDF0] bg-white p-6 shadow-sm"><label htmlFor="scenario" className="text-sm font-semibold">Scénario RH</label><select id="scenario" value={scenario} onChange={e=>{stop();setScenario(e.target.value as Sample);setClip(null);setFilename("");setKokoroState("idle");}} className="mt-3 w-full rounded-xl border border-[#CFCFE6] bg-white p-3"><option value="intro">Introduction</option><option value="relance">Relance contextuelle</option><option value="situation">Mise en situation</option></select><p className="mt-4 rounded-2xl bg-[#F5F4FD] p-5 leading-8">{samples[scenario]}</p></div>
 <div className="mt-5 grid gap-5 md:grid-cols-2"><section className="rounded-[26px] border border-[#DDDDF0] bg-white p-6"><h2 className="text-xl font-semibold">A · Voix navigateur</h2><p className="mt-2 text-sm text-[#64718E]">Référence actuelle, gratuite, dépend de votre appareil.</p><label htmlFor="voice" className="mt-5 block text-sm font-medium">Voix française</label><select id="voice" value={voiceURI} onChange={e=>setVoiceURI(e.target.value)} className="mt-2 w-full rounded-xl border border-[#CFCFE6] p-3"><option value="">Voix automatique</option>{voices.map(v=><option key={v.voiceURI} value={v.voiceURI}>{v.name} · {v.lang}</option>)}</select><label htmlFor="speed" className="mt-4 block text-sm">Vitesse : {speed.toFixed(2)}×</label><input id="speed" type="range" min="0.8" max="1.12" step="0.04" value={speed} onChange={e=>setSpeed(Number(e.target.value))} className="mt-3 w-full"/><button type="button" onClick={playBrowser} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#6755E4] px-5 font-semibold text-white"><Play size={17}/> Écouter</button></section>
 <section className="rounded-[26px] border border-[#DDDDF0] bg-white p-6"><h2 className="text-xl font-semibold">B · Kokoro français</h2><p className="mt-2 text-sm text-[#64718E]">Voix française <code>ff_siwis</code> · Kokoro 0.9.4. Trois WAV générés et vérifiés localement sur Mac.</p><label className="mt-5 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-[#B6ACEF] px-5 font-semibold text-[#5E4BC6]"><Upload size={17}/> Importer un fichier WAV/MP3<input className="sr-only" type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" onChange={e=>onFile(e.target.files?.[0])}/></label>{filename&&<p className="mt-3 text-xs text-[#687494]">{filename}</p>}<audio key={clip||kokoroSample} ref={audioRef} className="mt-5 w-full" controls preload="metadata" src={clip||kokoroSample} onError={()=>{setKokoroState("error");setNotice("Fichier audio non lisible dans ce navigateur. Essayez de l’ouvrir directement.");}} onEnded={()=>{setKokoroState("idle");setNotice("Échantillon Kokoro terminé.");}}/><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={()=>void playKokoro()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#6755E4] px-5 font-semibold text-white"><Play size={17}/> {kokoroState==="playing"?"Réécouter Kokoro":"Écouter Kokoro"}</button><a href={clip||kokoroSample} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-xl border border-[#B6ACEF] px-4 text-sm font-semibold text-[#5E4BC6]">Ouvrir le fichier audio</a></div><p className="mt-2 text-xs text-[#66748E]">{clip?"Échantillon importé localement":"Échantillon Kokoro français prêt à écouter"}</p></section></div>
 <section className="mt-5 rounded-[26px] border border-[#DDDDF0] bg-white p-6"><h2 className="text-xl font-semibold">V2 · Prononciation et naturel</h2><p className="mt-2 text-sm text-[#64718E]">Comparez trois rendus Kokoro réels. Le mot affiché reste « manager » ; seul le texte de synthèse varie. Ces réglages ne sont pas activés en entretien.</p><div className="mt-5 grid gap-4 sm:grid-cols-3">{([{name:"Sans correction",file:"kokoro-vocabulaire-original.wav",description:"Référence à 0,98×"},{name:"Prononciation adaptée",file:"kokoro-vocabulaire-corrige.wav",description:"Essai « manageur » à 0,98×"},{name:"Plus posé",file:"kokoro-situation-calme.wav",description:"Situation à 0,92×"}]).map(item=><div key={item.file} className="rounded-2xl bg-[#F5F4FD] p-4"><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-[#687494]">{item.description}</p><audio controls preload="none" className="mt-4 w-full" src={`/voice-lab/${item.file}`}/><a href={`/voice-lab/${item.file}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#5E4BC6]">Ouvrir l’audio</a></div>)}</div><p className="mt-4 text-xs text-[#64718E]">La vitesse, les pauses et les substitutions sont des hypothèses à évaluer à l'écoute ; ce ne sont pas des corrections validées.</p></section>
 <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[#DDDDF0] bg-white p-4"><p role="status" className="text-sm text-[#586987]">{notice||'Prêt à comparer les voix.'}</p><button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D2D0E8] px-4 text-sm font-semibold" onClick={stop}><Square size={15}/> Arrêter</button></div><p className="mt-5 text-sm leading-7 text-[#64718E]">Trois échantillons Kokoro sont disponibles pour comparaison. Le POC ne modifie pas la voix des entretiens en production. L'import de fichier reste exclusivement dans votre navigateur.</p></div></main>;
}
