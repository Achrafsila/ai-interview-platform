"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ChevronRight, CirclePlay, Code2, FileText, LayoutDashboard, Sparkles, UserRound, Languages, Clock3, Target, Pencil, Play } from "lucide-react";
import { getAuthClient } from "@/lib/supabase-auth";
import { getAppRole, readProfile } from "@/lib/profile";
import { experienceOptions, type OnboardingProfile, type PreparationGoal, type ExperienceLevel } from "@/components/ui/onboarding-stages";
import { cn } from "@/lib/utils";

type Kind = "rh" | "technical";
type Duration = 10 | 20 | 35;
const goalLabels: Record<PreparationGoal, string> = {confidence:"Prendre confiance",answer_structure:"Structurer mes réponses",communication:"Mieux communiquer",domain_knowledge:"Connaissances métier",stress_management:"Gérer la pression"};
const choices=Object.entries(goalLabels) as [PreparationGoal,string][];
const surface="rounded-[24px] border border-[#D7E0F2] bg-white/90 p-6 shadow-[0_12px_35px_rgba(54,83,141,.065)] sm:p-8";

export default function PreparationPage() {
 const router=useRouter();
 const reduced=useReducedMotion();
 const [profile,setProfile]=useState<OnboardingProfile|null|undefined>(undefined);
 const [loadError,setLoadError]=useState("");
 const [step,setStep]=useState(0);
 const [kind,setKind]=useState<Kind|null>(null);
 const [job,setJob]=useState("");
 const [description,setDescription]=useState("");
 const [file,setFile]=useState<File|null>(null);
 const [experience,setExperience]=useState<ExperienceLevel|"">("");
 const [language,setLanguage]=useState<"fr"|"en">("fr");
 const [priorities,setPriorities]=useState<PreparationGoal[]>([]);
 const [duration,setDuration]=useState<Duration>(20);
 const [error,setError]=useState("");
 const [complete,setComplete]=useState(false);
 const [saving,setSaving]=useState(false);
 const currentRef=useRef<HTMLDivElement>(null);

 useEffect(()=>{let mounted=true;async function load(){
  try{const client=getAuthClient();if(!client)throw new Error("Supabase non configuré");
   const {data:{user}}=await client.auth.getUser();if(!user){router.replace("/login");return;}
   const role=await getAppRole(client,user.id);if(role!=="user"){router.replace("/role-preview");return;}
   const saved=await readProfile(client,user.id);if(!saved?.completed){router.replace("/onboarding");return;}
   if(mounted){setProfile(saved.profile);setExperience(saved.profile.experienceLevel??"");setLanguage(saved.profile.preferredLocale);setPriorities(saved.profile.preparationGoals);}
  }catch{if(mounted)setLoadError("Impossible de récupérer votre profil. Réessayez.");}
 }void load();return()=>{mounted=false};},[router]);
 useEffect(()=>{if(step>0 && !reduced)currentRef.current?.scrollIntoView({behavior:"smooth",block:"start"});},[step,reduced]);
 const valid=step===0?kind!==null:step===1?description.length<=12000 && job.length<=120 && (!file||file.size<=5*1024*1024):priorities.length>=1&&priorities.length<=3;
 function advance(){if(!valid){setError("Vérifiez les informations de cette étape.");return;}setError("");if(step<2){setStep(s=>s+1);return;}setComplete(true);}
 function toggleGoal(v:PreparationGoal){setPriorities(prev=>prev.includes(v)?prev.filter(x=>x!==v):prev.length<3?[...prev,v]:prev);}
 async function stageDraft(){
  if(!kind||!profile||priorities.length===0)return;
  setSaving(true);setError("");
  try {
   const client=getAuthClient();if(!client)throw new Error();
   const {data:{user}}=await client.auth.getUser();if(!user)throw new Error();
   // Draft settings are session-scoped and do not change candidate_profiles.
   const draft={kind,jobTitle:job.trim(),jobDescription:description.trim(),experienceLevel:experience||null,locale:language,preparationGoals:priorities,durationMinutes:duration,jobFileName:file?.name??null,createdAt:new Date().toISOString()};
   sessionStorage.setItem(`interview-config:${user.id}`,JSON.stringify(draft));
   setSaving(false);
  }catch{setSaving(false);setError("Impossible de préparer cette session. Réessayez.");}
 }
 const summary=[kind==="rh"?"Entretien RH":kind==="technical"?"Entretien technique":"",job.trim()||"Poste non précisé",`${language==="fr"?"Français":"Anglais"} · ${duration} min · ${priorities.length} priorité(s)`];
 return <main className="min-h-screen bg-[#F5F7FC] text-[#172033]">
 <div className="mx-auto flex min-h-screen max-w-[1640px]">
 <aside className="sticky top-0 hidden h-screen w-[212px] shrink-0 flex-col border-r border-[#E0E6F1] bg-white/75 px-4 py-6 lg:flex">
  <Link href="/" className="flex items-center gap-2.5 px-2 text-sm font-extrabold"><span className="grid size-10 place-items-center rounded-xl bg-[#E2E9FF] text-[#3E56C1]"><Sparkles size={20}/></span><span>Interview<span className="block text-[10px] tracking-[.16em] text-[#6779A2]">PLATFORM</span></span></Link>
  <p className="mb-3 mt-12 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#8593AF]">Espace candidat</p>
  <nav aria-label="Navigation candidat" className="space-y-1.5">
   <Link href="/dashboard" className="flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm text-[#62718D] hover:bg-[#F0F4FE]"><LayoutDashboard size={18}/> Vue d’ensemble</Link>
   <Link href="/preparation" aria-current="page" className="flex min-h-12 items-center gap-3 rounded-xl bg-[#E8EDFF] px-3.5 text-sm font-bold text-[#3A55B9]"><CirclePlay size={18}/> Simulation</Link>
   <Link href="/onboarding" className="flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm text-[#62718D] hover:bg-[#F0F4FE]"><UserRound size={18}/> Mon profil</Link>
  </nav>
 </aside>
 <div className="min-w-0 flex-1">
  <header className="flex min-h-[78px] items-center justify-between border-b border-[#E1E6F1] bg-white/55 px-5 sm:px-8 lg:px-9">
   <span className="flex items-center gap-2 text-xs text-[#6A7A97]"><CirclePlay size={17} className="text-[#3456D7]"/> Simulation <ChevronRight size={14}/> <strong className="text-[#172033]">Configuration</strong></span>
   <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#405AB7] hover:bg-white"><ArrowLeft size={16}/> Mon espace</Link>
  </header>
  <div className="mx-auto max-w-[1070px] px-5 pb-20 pt-10 sm:px-8">
   <div className="mb-9"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#4B64B6]">PERSONNALISONS VOTRE ENTRAÎNEMENT</p><h1 className="mt-3 text-[clamp(2.1rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-.055em]">Votre entretien, vos objectifs.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#677792]">Trois étapes pour une préparation qui vous ressemble. Chaque choix validé reste visible et modifiable.</p>
    <div className="mt-7 flex items-center gap-2">{[0,1,2].map(i=><div key={i} className={cn("h-1.5 flex-1 rounded-full",i<=step?"bg-[#4A67DC]":"bg-[#D8E0F0]")}/>)}</div>
   </div>
   {loadError?<div role="alert" className={surface}>{loadError}</div>:profile===undefined?<p role="status" className={surface}>Chargement de votre profil…</p>:profile===null?<p className={surface}>Complétez votre profil pour préparer une simulation.</p>:
   <>
    <div className="space-y-3">
     {Array.from({length:step},(_,i)=><motion.div layout key={i} initial={reduced?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} className="flex items-center justify-between gap-4 rounded-2xl border border-[#CAE0D8] bg-[#F0FAF5] px-5 py-4">
       <div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#D8F2E5] text-[#16816B]"><Check size={18}/></span><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#3D8B75]">Étape 0{i+1} validée</p><p className="truncate text-sm font-semibold">{summary[i]}</p></div></div><button type="button" onClick={()=>{setComplete(false);setStep(i);setError("");}} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#315F7C] hover:bg-white"><Pencil size={14}/> Modifier</button>
      </motion.div>)}
    </div>
    <div ref={currentRef} className="scroll-mt-8">
    <AnimatePresence mode="wait">
     {!complete?<motion.section key={step} initial={reduced?false:{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-15}} transition={{duration:reduced?0:.36}} className={surface+" mt-4"}>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#4D63B0]">Étape 0{step+1} / 03</p>
      {step===0&&<><h2 className="mt-3 text-2xl font-bold">Quel entretien souhaitez-vous préparer ?</h2><p className="mt-3 text-sm leading-7 text-[#65748D]">Choisissez le format pour adapter les questions et les relances.</p>
        <div role="radiogroup" aria-label="Type d'entretien" className="mt-7 grid gap-4 sm:grid-cols-2">{([{key:"rh" as Kind,title:"Entretien RH",detail:"Parcours, motivation, comportement et mises en situation.",icon:BriefcaseBusiness},{key:"technical" as Kind,title:"Entretien technique",detail:"Connaissances métier, raisonnement et résolution de problèmes.",icon:Code2}]).map(x=><button key={x.key} type="button" role="radio" aria-checked={kind===x.key} onClick={()=>{setKind(x.key);setError("");}} className={cn("rounded-2xl border p-6 text-left transition hover:-translate-y-1",kind===x.key?"border-[#6075E7] bg-[#E9EDFF] shadow-md":"border-[#DCE4F4] bg-[#FBFCFF] hover:border-[#A9B9EE]")}><span className="flex items-center justify-between"><x.icon size={24} className="text-[#4563CA]"/>{kind===x.key&&<Check size={18} className="text-[#4563CA]"/>}</span><strong className="mt-5 block text-lg">{x.title}</strong><span className="mt-2 block text-sm leading-6 text-[#63738E]">{x.detail}</span></button>)}</div>
       </>}
      {step===1&&<><h2 className="mt-3 text-2xl font-bold">Parlons du contexte professionnel.</h2><p className="mt-3 text-sm leading-7 text-[#65748D]">Ces informations sont facultatives. Elles permettent des questions plus ciblées.</p>
       <label className="mt-7 block text-sm font-semibold">Poste ciblé<input value={job} maxLength={120} onChange={e=>setJob(e.target.value)} placeholder="Ex. Data Analyst, Chargé de recrutement…" className="mt-2 block w-full rounded-xl border border-[#CBD7EE] bg-white px-4 py-3 outline-none focus:border-[#5474DB]"/></label>
       <label className="mt-5 block text-sm font-semibold">Niveau d’expérience<select value={experience} onChange={e=>setExperience(e.target.value as ExperienceLevel|"")} className="mt-2 block w-full rounded-xl border border-[#CBD7EE] bg-white px-4 py-3"><option value="">Ne pas préciser</option>{experienceOptions.map(x=><option value={x.value} key={x.value}>{x.title}</option>)}</select></label>
       <label className="mt-5 block text-sm font-semibold">Description du poste (facultative)<textarea value={description} onChange={e=>setDescription(e.target.value.slice(0,12000))} rows={4} placeholder="Collez ici la description des missions et compétences recherchées…" className="mt-2 block w-full resize-y rounded-xl border border-[#CBD7EE] bg-white p-4 text-sm outline-none focus:border-[#5474DB]"/></label>
       <div className="mt-5 rounded-xl border border-[#D6E0F4] bg-[#F5F8FF] p-4"><label className="flex items-center gap-2 text-sm font-semibold"><FileText size={18} className="text-[#4A65CB]"/> Joindre une fiche de poste (facultatif)<input type="file" accept=".pdf,.doc,.docx" className="mt-2 block w-full text-xs" onChange={e=>{const next=e.target.files?.[0]??null;if(next&&next.size>5*1024*1024){setFile(null);setError("Le fichier doit faire 5 Mo maximum.");e.target.value="";}else{setFile(next);setError("");}}}/></label><p className="mt-2 text-xs text-[#697B99]">PDF ou Word, 5 Mo maximum. La lecture et la transmission du fichier au moteur seront raccordées ultérieurement.</p></div>
       </>}
      {step===2&&<><h2 className="mt-3 text-2xl font-bold">Personnalisons votre séance.</h2><p className="mt-3 text-sm text-[#65748D]">Vos préférences sont préremplies depuis votre profil, sans le modifier.</p>
       <div className="mt-7"><p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Languages size={17}/> Langue</p><div className="grid grid-cols-2 gap-3">{([{value:"fr" as const,title:"Français"},{value:"en" as const,title:"English"}]).map(x=><button key={x.value} onClick={()=>setLanguage(x.value)} className={cn("rounded-xl border px-4 py-3 text-sm font-semibold",language===x.value?"border-[#6A7DE1] bg-[#E8EDFF] text-[#3E55B7]":"border-[#D8E2F3] bg-white")}>{x.title}</button>)}</div></div>
       <div className="mt-7"><p className="mb-3 flex items-center justify-between text-sm font-semibold"><span className="flex items-center gap-2"><Target size={17}/> Objectifs de préparation</span><span className="text-xs text-[#687896]">{priorities.length}/3</span></p><div className="grid gap-2 sm:grid-cols-2">{choices.map(([key,title])=><button key={key} type="button" aria-pressed={priorities.includes(key)} disabled={!priorities.includes(key)&&priorities.length>=3} onClick={()=>toggleGoal(key)} className={cn("flex items-center justify-between gap-2 rounded-xl border p-3.5 text-left text-sm disabled:opacity-40",priorities.includes(key)?"border-[#A6DCCD] bg-[#EAF9F3]":"border-[#DAE2F0] bg-white")}><span>{title}</span>{priorities.includes(key)&&<Check size={16} className="text-[#18816A]"/>}</button>)}</div></div>
       <div className="mt-7"><p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Clock3 size={17}/> Durée cible</p><div className="grid grid-cols-3 gap-3">{([10,20,35] as Duration[]).map(min=><button key={min} onClick={()=>setDuration(min)} className={cn("rounded-xl border px-2 py-4 text-sm font-bold",duration===min?"border-[#8071D9] bg-[#EEE9FF] text-[#6952B5]":"border-[#DAE2F0] bg-white")}>{min} min{min===20&&<span className="mt-1 block text-[10px] font-medium">Standard</span>}</button>)}</div></div>
       </>}
       {error&&<p role="alert" className="mt-5 text-sm font-medium text-red-700">{error}</p>}
       <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E7F3] pt-6"><button type="button" onClick={()=>{if(step===0)router.push("/dashboard");else setStep(s=>s-1);setError("");}} className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[#687995]"><ArrowLeft size={17}/> Retour</button><button type="button" onClick={advance} disabled={!valid} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#3456D7] px-6 text-sm font-bold text-white transition hover:bg-[#2645BD] disabled:opacity-40">{step===2?"Vérifier ma configuration":"Valider et continuer"}<ArrowRight size={17}/></button></div>
      </motion.section>:
      <motion.section key="recap" initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} className={surface+" mt-4"}>
       <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#21856A]"><Check size={17}/> Configuration terminée</div><h2 className="mt-4 text-2xl font-bold">Tout est prêt pour votre simulation.</h2>
       <div className="mt-6 space-y-3 rounded-2xl bg-[#F2F5FD] p-5 text-sm"><p><strong>Format :</strong> {summary[0]}</p><p><strong>Poste :</strong> {summary[1]}</p><p><strong>Expérience :</strong> {experienceOptions.find(x=>x.value===experience)?.title??"Non précisée"}</p><p><strong>Langue et durée :</strong> {language==="fr"?"Français":"English"} · {duration} minutes</p><p><strong>Priorités :</strong> {priorities.map(x=>goalLabels[x]).join(", ")}</p>{file&&<p><strong>Fiche sélectionnée :</strong> {file.name} (non transmise)</p>}</div>
       <p className="mt-6 rounded-xl border border-[#E7D6B5] bg-[#FFF7E8] p-4 text-sm leading-6 text-[#80602D]">Le nouveau configurateur est opérationnel, mais le moteur d’entretien n’est pas encore relié à cette interface. L’enregistrement du brouillon dans cette session ne lance pas de simulation et n’envoie pas de fichier.</p>
       {error&&<p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
       <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={()=>{setComplete(false);setStep(2)}} className="rounded-xl border border-[#C8D4EA] px-5 py-3 text-sm font-semibold"><ArrowLeft size={16} className="mr-2 inline"/>Modifier</button><button type="button" onClick={stageDraft} disabled={saving} className="rounded-xl bg-[#3456D7] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving?"Enregistrement…":"Conserver cette configuration"}<Check size={16} className="ml-2 inline"/></button><a href="http://127.0.0.1:8765/e2e" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#C8D4EA] px-5 py-3 text-sm font-semibold text-[#48609E]"><Play size={16}/> Tester le moteur séparément</a></div>
      </motion.section>}
     </AnimatePresence></div>
   </>}
  </div>
 </div></div></main>;
}
