"use client";
import Link from "next/link";
import {useState} from "react";
import {ArrowRight,BrainCircuit,Send,Sparkles} from "lucide-react";

type Suggestion={pathId:string;pathTitle:string;reason:string;exerciseId:string;exerciseName:string};
export function AcademyAsk(){
 const [prompt,setPrompt]=useState("");
 const [busy,setBusy]=useState(false);
 const [suggestion,setSuggestion]=useState<Suggestion|null>(null);
 const [error,setError]=useState("");
 async function ask(){
  const text=prompt.trim();if(text.length<5||busy)return;
  setBusy(true);setError("");setSuggestion(null);
  try{
   const response=await fetch("/api/academy/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:text})});
   const body=await response.json() as Suggestion&{error?:string};
   if(!response.ok)throw new Error(body.error||"Le coach n’est pas disponible.");
   setSuggestion(body);
  }catch(e){setError(e instanceof Error?e.message:"Le coach n’est pas disponible.");}
  finally{setBusy(false);}
 }
 return <section aria-label="Demander à mon coach Academy" className="mt-6 rounded-[24px] border border-[#D7D0F2] bg-gradient-to-br from-white via-[#F8F6FF] to-[#F1F0FF] p-5 shadow-[0_12px_36px_rgba(72,55,138,.07)] sm:p-7">
  <div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6259EB] to-[#AE63D8] text-white shadow-md"><BrainCircuit size={23}/></span><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#7253C7]">Votre coach Academy</p><h2 className="mt-1 text-xl font-bold text-[#172041]">Qu’aimeriez-vous travailler aujourd’hui ?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#5D6B88]">Un entretien précis, une difficulté, un métier, ou simplement un objectif : décrivez votre besoin, nous vous orienterons vers un parcours ou un exercice.</p></div></div>
  <div className="mt-5 rounded-2xl border border-[#CFD4EA] bg-white p-3 shadow-[0_8px_24px_rgba(76,57,140,.06)] focus-within:border-[#8877E0]">
   <label className="sr-only" htmlFor="academy-ask">Votre demande au coach Academy</label>
   <textarea id="academy-ask" value={prompt} onChange={e=>setPrompt(e.target.value.slice(0,700))} rows={2} maxLength={700} placeholder="Par exemple : j’ai un entretien Data Analyst mardi et j’ai du mal à structurer mes réponses…" className="min-h-16 w-full resize-y bg-transparent p-2 text-sm leading-6 text-[#172041] outline-none placeholder:text-[#7E8BA7]" onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void ask();}}}/>
   <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E6F2] pt-3"><span className="inline-flex items-center gap-2 text-xs font-medium text-[#6B77A0]"><Sparkles size={14}/> Orientation pédagogique par IA</span><button type="button" onClick={()=>void ask()} disabled={busy||prompt.trim().length<5} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#6258EB] to-[#9854D7] px-5 text-sm font-bold text-white shadow-[0_7px_18px_rgba(96,69,199,.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"><Send size={16}/>{busy?"Recherche en cours…":"Demander au coach"}</button></div>
  </div>
  {error&&<p role="alert" className="mt-3 text-sm text-[#A23E58]">{error}</p>}
  {suggestion&&<div role="status" className="mt-5 rounded-2xl border border-[#C5E1D6] bg-[#F1FAF7] p-5"><p className="text-xs font-bold uppercase text-[#267A70]">Notre proposition</p><h3 className="mt-2 text-lg font-bold text-[#172041]">{suggestion.pathTitle}</h3><p className="mt-2 text-sm leading-6 text-[#596B82]">{suggestion.reason}</p><div className="mt-4 flex flex-wrap gap-3"><Link href={`/exercises/paths?path=${encodeURIComponent(suggestion.pathId)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6258D5] px-4 text-sm font-bold text-white">Découvrir mon parcours <ArrowRight size={16}/></Link><Link href={`/exercises?exercise=${encodeURIComponent(suggestion.exerciseId)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#C7D8DD] bg-white px-4 text-sm font-semibold text-[#436A7A]">Faire un exercice <ArrowRight size={16}/></Link></div></div>}
  <p className="mt-3 text-xs leading-5 text-[#7A85A0]">Ce conseil vous aide à choisir votre entraînement. Il ne constitue ni une évaluation de vos compétences ni une garantie de résultat.</p>
 </section>;
}
