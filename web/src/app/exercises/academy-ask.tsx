"use client";
import Link from "next/link";
import {useState} from "react";
import {ArrowRight,ArrowUp,BrainCircuit,Sparkles} from "lucide-react";

type Reference={slug:string;title:string;source:string};
type Suggestion={kind:"recommend";references?:Reference[];understanding?:string;need:string;pathId:string;pathTitle:string;reason:string;exerciseId:string;exerciseName:string;source?:"rules"|"ai-ld";saved?:boolean;needs?:{key:string;label:string}[];steps?:{exerciseId:string;exerciseName:string;pathId:string;pathTitle:string;goal:string;method?:string}[]};
type Clarification={kind:"clarify";references?:Reference[];understanding?:string;question:string;options:string[]};
type Answer={kind:"answer";references?:Reference[];reply:string;question?:string};

function CoachMascot({thinking}:{thinking:boolean}){
 return <div aria-hidden="true" className="academy-mascot relative flex h-[80px] w-[92px] shrink-0 items-center justify-center sm:h-[92px] sm:w-[108px]">
  <span className="absolute -left-1 top-[38%] h-7 w-2 rounded-l-md bg-[#17BDAF] shadow-[0_0_14px_#36D9C3]"/>
  <span className="absolute -right-1 top-[38%] h-7 w-2 rounded-r-md bg-[#17BDAF] shadow-[0_0_14px_#36D9C3]"/>
  <div className="absolute inset-x-2 inset-y-1 rounded-[25px] border-[3px] border-[#535E82] bg-gradient-to-br from-[#58648E] to-[#293451] p-[5px] shadow-[0_9px_20px_rgba(30,32,73,.2)]">
   <div className="flex h-full items-center justify-center gap-3 overflow-hidden rounded-[18px] border border-[#28334B] bg-[#101A2D] shadow-[inset_0_2px_12px_rgba(0,0,0,.65)]">
    <span className={`academy-mascot-eye h-7 w-3 rounded-[3px] bg-[#26E3C4] shadow-[0_0_15px_rgba(37,235,198,.8)] ${thinking?"animate-pulse":""}`}/>
    <span className={`academy-mascot-eye h-7 w-3 rounded-[3px] bg-[#26E3C4] shadow-[0_0_15px_rgba(37,235,198,.8)] ${thinking?"animate-pulse":""}`}/>
   </div>
  </div>
 </div>;
}
export function AcademyAsk({compact=false,onRecommendation}:{compact?:boolean;onRecommendation?:(exerciseId:string)=>void}={}){
 const [prompt,setPrompt]=useState("");
 const [busy,setBusy]=useState(false);
 const [suggestion,setSuggestion]=useState<Suggestion|null>(null);
 const [error,setError]=useState("");
 const [clarification,setClarification]=useState<Clarification|null>(null);
 const [references,setReferences]=useState<Reference[]>([]);
 const [history,setHistory]=useState<{role:"user"|"assistant";content:string}[]>([]);
 async function ask(override?:string){
  const text=(override||prompt).trim();if(text.length<3||busy)return;
  const next=[...history,{role:"user" as const,content:text}].slice(-9);setHistory(next);setPrompt("");
  setBusy(true);setError("");setSuggestion(null);setClarification(null);
  try{
   const response=await fetch("/api/academy/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:next})});
   const body=await response.json() as (Suggestion|Clarification|Answer)&{error?:string};
   if(!response.ok)throw new Error(body.error||"Le coach n’est pas disponible.");
   setReferences(body.references||[]);
   if(body.kind==="answer"){setHistory(items=>[...items,{role:"assistant" as const,content:`${body.reply}${body.question?"\n\n"+body.question:""}`}].slice(-9));}else if(body.kind==="clarify"){setClarification(body);setHistory(items=>[...items,{role:"assistant" as const,content:`${body.understanding?body.understanding+"\n\n":""}${body.question}`}].slice(-9));}else{setSuggestion(body);onRecommendation?.(body.exerciseId);setHistory(items=>[...items,{role:"assistant" as const,content:`${body.understanding?body.understanding+"\n\n":""}${body.needs&&body.needs.length>1?"J’ai retenu plusieurs axes de préparation : "+body.needs.map(n=>n.label.toLowerCase()).join(", ")+". ":""}${body.reason}`}].slice(-9));}
  }catch(e){setHistory(items=>items.slice(0,-1));setPrompt(text);setError(e instanceof Error?e.message:"Le coach n’est pas disponible.");}
  finally{setBusy(false);}
 }
 return <section aria-label="Demander à mon coach Academy" className={compact?"mt-5 max-w-5xl":"mt-7 max-w-5xl"}>
  <div className={compact?"flex items-center gap-3":"flex items-center gap-4 sm:gap-6"}>
   <div className={compact?"scale-[.65] -ml-3 -mr-3 -my-3":""}><CoachMascot thinking={busy}/></div>
   <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#7253C7]">Votre coach Academy</p><h2 className={compact?"mt-1 text-base font-bold text-[#172041] sm:text-lg":"mt-1 text-2xl font-bold tracking-tight text-[#172041] sm:text-[30px]"}>Comment puis-je vous aider aujourd’hui ?</h2>{!compact&&<p className="mt-2 text-sm text-[#667591] sm:text-base">Décrivez votre objectif. Je vous proposerai un parcours ou un exercice adapté.</p>}</div>
  </div>
  {history.length>0&&<div className="mt-3 flex justify-end"><button type="button" disabled={busy} onClick={()=>{setHistory([]);setSuggestion(null);setClarification(null);setReferences([]);setPrompt("");setError("");}} className="min-h-9 rounded-lg px-3 text-xs font-semibold text-[#6953AD] hover:bg-[#F0EEFC] disabled:opacity-50">Nouvelle discussion</button></div>}
  {history.length>0&&<div aria-live="polite" className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-[#E2DFF1] bg-[#FBFAFF] p-3">{history.map((item,i)=><div key={i} className={item.role==="user"?"ml-auto max-w-[87%] rounded-2xl rounded-br-md bg-[#E8E2FF] p-3 text-sm text-[#433A78]":"mr-auto max-w-[90%] rounded-2xl rounded-bl-md bg-white p-3 text-sm text-[#263654] shadow-sm"}>{item.content}</div>)}</div>}
  {references.length>0&&<div className="mt-2 text-xs text-[#62718D]">Références internes : {references.map(item=>item.title).join(" · ")}</div>}
  {busy&&<p role="status" className="mt-3 flex items-center gap-2 text-xs font-medium text-[#6955B5]"><span className="size-2 animate-pulse rounded-full bg-[#8262E1]"/> Le coach prépare sa réponse…</p>}
  <div className={compact?"mt-3 rounded-2xl border border-[#C7CAE3] bg-white p-3 shadow-sm focus-within:border-[#8275DA]":"mt-5 rounded-[26px] border border-[#C7CAE3] bg-gradient-to-br from-white to-[#FBFAFF] px-4 pb-3 pt-4 shadow-[0_16px_44px_rgba(61,54,125,.10)] transition-all focus-within:border-[#8275DA] focus-within:shadow-[0_18px_48px_rgba(93,74,185,.17)] sm:px-6 sm:pt-5"}>
   <label className="sr-only" htmlFor="academy-ask">Votre demande au coach Academy</label>
   <textarea id="academy-ask" value={prompt} onChange={e=>setPrompt(e.target.value.slice(0,700))} rows={compact?1:3} maxLength={700} placeholder="Qu’aimeriez-vous améliorer ? Décrivez votre entretien, votre difficulté, ou votre objectif…" className={compact?"min-h-11 w-full resize-none bg-transparent px-2 text-sm leading-7 text-[#172041] outline-none placeholder:text-[#828BA3]":"min-h-24 w-full resize-y bg-transparent text-base leading-7 text-[#172041] outline-none placeholder:text-[#828BA3] sm:min-h-28"} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void ask();}}}/>
   <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E4F0] pt-3">
    <span className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#F0EEFF] px-3 text-xs font-semibold text-[#6855B5]"><BrainCircuit size={16}/> Coach Academy · référentiel L&D</span>
    <button type="button" aria-label="Envoyer votre demande au coach" title="Envoyer votre demande" onClick={()=>void ask()} disabled={busy||prompt.trim().length<3} className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#6556E8] to-[#9557D3] px-3 font-bold text-white shadow-[0_6px_18px_rgba(95,77,197,.23)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45">
     {busy?<span className="text-xs">…</span>:<ArrowUp size={21}/>}
    </button>
   </div>
  </div>
  {!compact&&<div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="inline-flex items-center gap-1.5 text-xs text-[#72809A]"><Sparkles size={14}/> Une demande libre, une recommandation concrète</span><span className="text-xs text-[#8290A7]">Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne</span></div>}
  {error&&<p role="alert" className="mt-4 rounded-xl border border-[#F0CAD3] bg-[#FFF4F6] p-4 text-sm text-[#A23E58]">{error}</p>}
  {clarification&&<div className="mt-4 rounded-2xl border border-[#D5CEF0] bg-white p-4">{clarification.understanding&&<p className="mb-3 text-sm leading-6 text-[#54678A]">{clarification.understanding}</p>}<p className="text-sm font-semibold text-[#29395C]">{clarification.question}</p><div className="mt-3 flex flex-wrap gap-2">{clarification.options.map(option=><button key={option} disabled={busy} onClick={()=>void ask(option)} className="min-h-11 rounded-xl border border-[#CAC2EB] bg-[#F3F0FF] px-3 text-xs font-semibold text-[#5A45A8] hover:bg-[#E7E0FF]">{option}</button>)}</div></div>}
  {suggestion&&<div role="status" className="mt-5 rounded-2xl border border-[#C5E1D6] bg-[#F1FAF7] p-5"><p className="text-xs font-bold uppercase text-[#267A70]">Proposition du référentiel L&D · {suggestion.need}</p><h3 className="mt-2 text-lg font-bold text-[#172041]">{suggestion.pathTitle}</h3><p className="mt-2 text-sm leading-6 text-[#596B82]">{suggestion.reason}</p>{suggestion.saved===false&&<p className="mt-2 text-xs text-[#9B5F35]">Le programme n’a pas pu être enregistré : il reste accessible dans cette conversation.</p>}{suggestion.source==="rules"&&<p className="mt-2 text-xs text-[#8B5D37]">Mode de secours : recommandation par règles L&D. L’analyse conversationnelle IA n’a pas pu être confirmée.</p>}{suggestion.steps&&suggestion.steps.length>1&&<div className="mt-4 space-y-2"><p className="text-xs font-bold uppercase tracking-wide text-[#34776C]">Votre programme proposé · {suggestion.steps.length} ateliers</p>{suggestion.steps.map((step,i)=><Link key={step.exerciseId} href={`/exercises?exercise=${encodeURIComponent(step.exerciseId)}`} className="flex min-h-11 items-center gap-3 rounded-xl border border-[#C7DEDA] bg-white p-3 text-left text-sm text-[#334E66] transition hover:border-[#81B4A7]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#E2F5EE] text-xs font-bold text-[#217363]">{i+1}</span><span className="flex-1"><strong className="block text-xs text-[#24786A]">{step.goal}</strong>{step.exerciseName}{step.method&&<span className="mt-1 block text-xs leading-5 text-[#697E7A]">Pourquoi : {step.method}</span>}</span><ArrowRight size={15}/></Link>)}</div>}{suggestion.needs&&suggestion.needs.length>1&&<p className="mt-3 text-xs text-[#527E71]">Vous pouvez préciser un de ces axes dans la conversation pour ajuster le programme.</p>}<div className="mt-4 flex flex-wrap gap-3"><Link href={`/exercises/paths?path=${encodeURIComponent(suggestion.pathId)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6258D5] px-4 text-sm font-bold text-white">Découvrir mon parcours <ArrowRight size={16}/></Link><Link href={`/exercises?exercise=${encodeURIComponent(suggestion.exerciseId)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#C7D8DD] bg-white px-4 text-sm font-semibold text-[#436A7A]">Faire un exercice <ArrowRight size={16}/></Link></div></div>}
  {!compact&&<p className="mt-4 text-xs leading-5 text-[#7A85A0]">Orientation pédagogique uniquement, sans évaluation automatique des compétences. Les fonctions vocales et les pièces jointes ne sont pas encore activées.</p>}
 </section>;
}
