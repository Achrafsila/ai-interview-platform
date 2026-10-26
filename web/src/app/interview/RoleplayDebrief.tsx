/* eslint-disable react/no-unescaped-entities */
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Headphones, MessageSquareText, Mic2, PlayCircle, Sparkles, Target } from "lucide-react";

type Turn = {question:string;answer:string};
type Props={transcript?:Turn[];feedback?:string;jobTitle?:string;audioUrl?:string};
const cls="rounded-[22px] border border-white/15 bg-white/[.055] p-5";
function clean(s:string){return s.replace(/\\*\\*(.*?)\\*\\*/g,"$1").trim();}
export function RoleplayDebrief({transcript=[],feedback="",audioUrl}:Props){
 const [tab,setTab]=useState<"coaching"|"analytics">("coaching");
 const [selected,setSelected]=useState(0);
 const [open,setOpen]=useState<"structure"|"expression"|"relevance"|null>("structure");
 const [showAll,setShowAll]=useState(false);
 const turns=useMemo(()=>transcript.filter(t=>t.question?.trim()||t.answer?.trim()),[transcript]);
 const active=turns[selected];
 const tokens=useMemo(()=>turns.flatMap(t=>t.answer.toLocaleLowerCase("fr").match(/[\\p{L}']+/gu)||[]),[turns]);
 const repeats=useMemo(()=>{
  const words=tokens.filter(w=>w.length>3);const counts=new Map<string,number>();
  for(const word of words)counts.set(word,(counts.get(word)||0)+1);
  return [...counts].filter(([word,count])=>count>=3&&!["pour","avec","dans","vous","nous","mais","cette","comme","alors","était","avoir","faire","plus","tout","très"].includes(word)).sort((a,b)=>b[1]-a[1]).slice(0,6);
 },[tokens]);
 const hasAudio=Boolean(audioUrl);
 return <section aria-label="Débriefing interactif Roleplay" className="report-v2-rise mt-8 rounded-[30px] border border-white/15 bg-[#121C42]/90 p-4 shadow-[0_28px_85px_#05091b55] sm:p-6">
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#A7B9E6]">Débriefing Roleplay</p><h2 className="mt-1 text-xl font-semibold">Revivez votre entretien, progressez à chaque réponse</h2></div>
   <span className="rounded-full border border-[#92DDD3]/30 bg-[#245B63]/30 px-3 py-2 text-xs text-[#B6EEE7]">{turns.length} échange{turns.length>1?"s":""} analysable{turns.length>1?"s":""}</span>
  </div>
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.17fr)_minmax(320px,.83fr)]">
   <div className="min-w-0 space-y-4">
    <div className={cls}>
     <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#767AFB]/20 text-[#C2C5FF]"><PlayCircle size={23}/></span><div><h3 className="font-semibold">Relecture de la séance</h3><p className="text-xs leading-5 text-[#B9C6E6]">{hasAudio?"Enregistrement disponible":"Transcription disponible · enregistrement synchronisé non disponible"}</p></div></div>
     {hasAudio?<audio className="mt-5 w-full" controls src={audioUrl} preload="metadata"/>:<div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-[#0D1735] p-5 text-sm leading-6 text-[#B7C8E6]"><Headphones className="mb-3 text-[#A8B9FF]" size={22}/>La séance actuelle ne conserve pas encore d’enregistrement audio complet. Les échanges peuvent être relus ci-dessous. Aucun horodatage ni bouton de lecture fictif n’est affiché.</div>}
    </div>
    <div className={cls}>
     <div className="flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 font-semibold"><MessageSquareText size={18} className="text-[#9BC5FF]"/> Transcription de l'entretien</h3><span className="text-xs text-[#AEC0E9]">{turns.length?"Échange "+(selected+1)+"/"+turns.length:"Non disponible"}</span></div>
     {turns.length?<>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><p className="text-xs leading-5 text-[#ABB9DA]">Sélectionnez un échange pour examiner la question et votre réponse.</p><div className="flex gap-2"><button type="button" disabled={selected===0} onClick={()=>setSelected(n=>n-1)} aria-label="Échange précédent" className="rounded-xl border border-white/20 p-2 disabled:opacity-30"><ChevronLeft size={17}/></button><button type="button" disabled={selected===turns.length-1} onClick={()=>setSelected(n=>n+1)} aria-label="Échange suivant" className="rounded-xl border border-white/20 p-2 disabled:opacity-30"><ChevronRight size={17}/></button></div></div>
      <div className="mt-3 space-y-2">{turns.slice(0,showAll?undefined:6).map((t,i)=><button type="button" key={i} onClick={()=>setSelected(i)} aria-pressed={selected===i} className={"w-full rounded-2xl border p-4 text-left transition "+(selected===i?"border-[#999AFF] bg-[#6D6BFD]/15":"border-white/10 bg-white/[.035] hover:border-white/30")}>
       <span className="text-xs font-bold text-[#A8BAFF]">Échange {i+1} · Intervieweur</span><p className="mt-1 line-clamp-2 text-sm leading-6 text-[#F0F2FF]">{t.question||"Question non transcrite"}</p>
       <span className="mt-3 block text-xs font-bold text-[#86DCD2]">Votre réponse</span><p className="mt-1 line-clamp-3 whitespace-pre-line text-sm leading-6 text-[#D5DDF1]">{t.answer||"Aucune réponse enregistrée"}</p>
      </button>)}</div>
      {turns.length>6&&<button className="mt-3 text-sm font-semibold text-[#C1B6FF]" type="button" onClick={()=>setShowAll(v=>!v)}>{showAll?"Réduire":"Afficher tous les échanges"} <ChevronDown className="inline" size={16}/></button>}
     </>:<p className="mt-4 text-sm leading-6 text-[#BCC9E8]">Aucune transcription disponible pour cette séance. Le rapport pédagogique reste accessible.</p>}
    </div>
   </div>
   <div className="min-w-0 space-y-4">
    <div className="flex rounded-2xl border border-white/15 bg-white/[.05] p-1" role="tablist" aria-label="Type d'analyse">
     <button type="button" role="tab" aria-selected={tab==="coaching"} className={"min-h-11 flex-1 rounded-xl px-3 text-sm font-semibold "+(tab==="coaching"?"bg-[#635AF5] text-white":"text-[#BFC9E6]")} onClick={()=>setTab("coaching")}>Coaching</button>
     <button type="button" role="tab" aria-selected={tab==="analytics"} className={"min-h-11 flex-1 rounded-xl px-3 text-sm font-semibold "+(tab==="analytics"?"bg-[#635AF5] text-white":"text-[#BFC9E6]")} onClick={()=>setTab("analytics")}>Analytique</button>
    </div>
    {tab==="coaching"?<>
     <div className={cls}><h3 className="flex items-center gap-2 font-semibold"><Sparkles size={18} className="text-[#C2ACFF]"/> Retour contextualisé</h3><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#DDE5F7]">{feedback?clean(feedback).slice(0,950):"Aucun retour qualitatif disponible pour cette séance."}</p>{feedback.length>950&&<p className="mt-3 text-xs text-[#ACBBDA]">Le bilan complet figure plus bas sur cette page.</p>}</div>
     {active&&<div className={cls}><h3 className="font-semibold">Échange sélectionné · {selected+1}</h3><p className="mt-3 text-xs font-semibold text-[#A9BCFF]">Question posée</p><p className="mt-1 text-sm leading-6 text-[#E4EAFE]">{active.question}</p><p className="mt-4 text-xs font-semibold text-[#86DCD2]">Preuve : votre réponse</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#E4EAFE]">{active.answer||"Réponse absente"}</p><p className="mt-3 text-xs leading-5 text-[#ACBADB]">Cette sélection sert à consulter la preuve. Une évaluation individuelle vérifiée par question nécessitera un moteur dédié ; aucune appréciation n'est inventée ici.</p></div>}
     <div className={cls}><h3 className="font-semibold">Passez de l'analyse à la pratique</h3><p className="mt-2 text-sm leading-6 text-[#D0DAF2]">Travaillez un objectif précis avec un exercice, puis recommencez un entretien.</p><Link href="/exercises" className="interview-v2-primary mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold">Démarrer un entraînement <ArrowRight size={16}/></Link><p className="mt-3 text-xs text-[#AEBBDB]">Coaching individuel : réservation prochainement.</p></div>
    </>:<>
     <div className={cls}><h3 className="flex items-center gap-2 font-semibold"><Activity size={18} className="text-[#9FC7FF]"/> Indicateurs observables</h3><p className="mt-2 text-xs leading-5 text-[#AEBBDD]">Statistiques textuelles dérivées des réponses transcrites, sans inventer de données vocales.</p><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/[.06] p-3"><span className="block text-2xl font-semibold">{tokens.length}</span><span className="text-xs text-[#C0CCEB]">Mots transcrits</span></div><div className="rounded-xl bg-white/[.06] p-3"><span className="block text-2xl font-semibold">{turns.filter(t=>t.answer.trim()).length}</span><span className="text-xs text-[#C0CCEB]">Réponses enregistrées</span></div></div></div>
     {([{id:"structure",title:"Choix des mots",icon:BookOpen},{id:"expression",title:"Répétitions lexicales",icon:ClipboardList},{id:"relevance",title:"Analyse vocale",icon:Mic2}] as const).map(item=><div key={item.id} className={cls}><button className="flex w-full items-center justify-between gap-2 text-left font-semibold" type="button" onClick={()=>setOpen(open===item.id?null:item.id)} aria-expanded={open===item.id}><span className="flex items-center gap-2"><item.icon size={18} className="text-[#9FC7FF]"/>{item.title}</span><ChevronDown size={17} className={open===item.id?"rotate-180":""}/></button>{open===item.id&&<div className="mt-4 text-sm leading-6 text-[#D4DEF5]">{item.id==="structure"?<p>L'analyse du fond et de la structure figure dans le coaching. Aucun score STAR automatique n'est attribué sans grille d'évaluation dédiée.</p>:item.id==="expression"?repeats.length?<div className="flex flex-wrap gap-2">{repeats.map(([word,count])=><span key={word} className="rounded-lg border border-white/15 bg-white/[.06] px-3 py-2">{word} · {count}</span>)}</div>:<p>Pas de répétitions lexicales fréquentes détectées dans la transcription disponible.</p>:<p>Le rythme, les pauses, le ton, le temps de parole et la synchronisation audio nécessitent un enregistrement horodaté. Ces indicateurs seront activés uniquement lorsqu'une source fiable sera disponible.</p>}</div>}</div>)}
    </>}
   </div>
  </div>
  <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[#8FADF4]/25 bg-[#6070DD]/[.10] p-4"><Target size={23} className="text-[#B7C9FF]"/><div className="min-w-[180px] flex-1"><p className="font-semibold">Votre prochaine étape</p><p className="mt-1 text-xs leading-5 text-[#C6D3ED]">Un exercice ciblé pour progresser, puis une nouvelle simulation pour vérifier vos acquis.</p></div><Link href="/exercises" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#605CF4] px-5 text-sm font-bold text-white hover:bg-[#7773FF]">S'entraîner <ArrowRight size={16}/></Link></div>
 </section>;
}
