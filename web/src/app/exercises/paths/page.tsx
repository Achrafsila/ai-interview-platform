"use client";
import Link from "next/link";
import {AcademyShell} from "../academy-shell";
import {useEffect,useMemo,useState} from "react";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Compass,Layers3,Route,Search,Sparkles,Target} from "lucide-react";
import {getAuthClient} from "@/lib/supabase-auth";
import {readProfile} from "@/lib/profile";
import {readInterviewResults} from "@/lib/interview-results";
import {learningRecommendations,adaptiveSteps,type LearningRecommendation} from "../learning-engine";
import {paths,pathCategories} from "../paths";
import type {AcademyPath} from "../paths";

export default function AcademyPathsPage(){
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("Tous");
 const [showAll,setShowAll]=useState(false);
 const [visibleCount,setVisibleCount]=useState(6);
 const [active,setActive]=useState<string|null>(()=>{if(typeof window==="undefined")return null;const id=new URLSearchParams(window.location.search).get("path");return id&&paths.some(p=>p.id===id)?id:null;});
 const [recommended,setRecommended]=useState<LearningRecommendation[]>([]);
 const [profileReady,setProfileReady]=useState(false);
 const [activePathId,setActivePathId]=useState<string|null>(null);
 const [completedExercises,setCompletedExercises]=useState<Set<string>>(new Set());
 const [savingPath,setSavingPath]=useState(false);
 const [pathError,setPathError]=useState("");
 useEffect(()=>{let live=true;(async()=>{try{
 const client=getAuthClient();if(!client)return;
 const {data:{user}}=await client.auth.getUser();if(!user)return;
 const record=await readProfile(client,user.id);if(!live)return;
 const p=record?.profile;
 const reports=await readInterviewResults(client,user.id);
 if(!live)return;
 setRecommended(learningRecommendations(p??null,reports));
 const [savedPath,savedAttempts]=await Promise.all([
  client.from("academy_active_paths").select("path_id").eq("user_id",user.id).maybeSingle(),
  client.from("academy_attempts").select("exercise_id").eq("user_id",user.id).limit(500)
 ]);
 if(!live)return;
 const storedId=savedPath.data?.path_id;if(storedId&&paths.some(path=>path.id===storedId))setActivePathId(storedId);
 if(savedAttempts.data)setCompletedExercises(new Set(savedAttempts.data.map(item=>item.exercise_id)));
 if(savedPath.error||savedAttempts.error)setPathError("Une partie de votre progression n'a pas pu être chargée.");
 }catch{}finally{if(live)setProfileReady(true);}})();return()=>{live=false;};},[]);
 const filtered=useMemo(()=>paths.filter(p=>(category==="Tous"||p.category===category)&&[p.title,p.audience,p.goal,p.description].join(" ").toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr"))),[category,query]);
 const chosen:AcademyPath|undefined=paths.find(p=>p.id===active);
 const currentPath=paths.find(p=>p.id===activePathId);
 const currentSteps=currentPath?adaptiveSteps(currentPath,recommended.find(x=>x.path.id===currentPath.id)?.priorityModule||null):[];
 const doneCount=currentSteps.filter(step=>completedExercises.has(step.exercise.id)).length;
 const nextStep=currentSteps.find(step=>!completedExercises.has(step.exercise.id));
 async function activatePath(pathId:string){
  if(savingPath)return;
  setSavingPath(true);setPathError("");
  try{
   const client=getAuthClient();
   if(!client)throw new Error("Connexion indisponible.");
   const {data:{user}}=await client.auth.getUser();
   if(!user)throw new Error("Connectez-vous pour suivre votre parcours.");
   const {error}=await client.from("academy_active_paths").upsert({user_id:user.id,path_id:pathId,updated_at:new Date().toISOString()},{onConflict:"user_id"});
   if(error)throw error;
   setActivePathId(pathId);
  }catch{setPathError("Impossible d'enregistrer ce parcours pour le moment.");}
  finally{setSavingPath(false);}
 }
 return <AcademyShell><div className="relative min-w-0"><div className="relative mx-auto max-w-6xl">
 <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/exercises" className="academy-back-link inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#C9D0ED] bg-[#EAEAFF] px-4 text-sm font-bold text-[#344D91] shadow-sm transition hover:bg-[#DDDFFF]"><ArrowLeft size={17}/> Bibliothèque d’exercices</Link><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8664D2]">INTERVIEWLAB · ACADEMY</p></div>
 <header className="mt-8 max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-[#BD99FF]/30 bg-[#AE76FE]/10 px-4 py-2 text-xs font-semibold text-[#6B49B9]"><Route size={15}/> Curriculum Academy</span><h1 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Un parcours pour chaque ambition.</h1><p className="mt-3 text-sm leading-7 sm:text-base text-[#62718D]">Choisissez un itinéraire d’apprentissage, explorez ses étapes et entraînez-vous à votre rythme. Les parcours conseillent : ils ne verrouillent jamais votre progression.</p></header>
 {!chosen?<>{currentPath&&<section className="mt-7 rounded-2xl border border-[#BDB5E8] bg-gradient-to-r from-[#F1ECFF] to-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#7154B7]">Votre parcours actif</p><h2 className="mt-2 text-xl font-bold">{currentPath.title}</h2><p className="mt-2 text-sm text-[#61708D]">{doneCount} étape{doneCount>1?"s":""} réalisée{doneCount>1?"s":""} sur {currentSteps.length} · {currentSteps.length?Math.round(doneCount/currentSteps.length*100):0}% d’activités réalisées</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#DDD9EE]"><div className="h-full rounded-full bg-[#7561D6]" style={{width:`${currentSteps.length?doneCount/currentSteps.length*100:0}%`}}/></div><div className="mt-4 flex flex-wrap gap-3"><button onClick={()=>setActive(currentPath.id)} className="min-h-11 rounded-xl bg-[#6755DF] px-5 text-sm font-semibold text-white">Voir mon curriculum</button>{nextStep&&<Link href={`/exercises?exercise=${encodeURIComponent(nextStep.exercise.id)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#C8BDEB] bg-white px-5 text-sm font-semibold text-[#5949A2]">Reprendre : {nextStep.exercise.categoryLabel} <ArrowRight size={16}/></Link>}</div></section>}<section className="mt-7 rounded-2xl border border-[#DDD5F8] bg-white p-6"><p className="text-xs font-bold uppercase text-[#7256C0]">Mon parcours conseillé</p><h2 className="mt-2 text-xl font-bold">Un parcours à la fois.</h2><p className="mt-2 text-sm text-[#63718D]">Nous pensons qu’un parcours utile part de votre objectif et de vos besoins réels. Voici notre recommandation prioritaire, avec deux alternatives au maximum.</p><div className="mt-4 grid gap-3 md:grid-cols-3">{(recommended.length?recommended.map(x=>x.path):paths.filter(p=>["first-job","star","week"].includes(p.id))).slice(0,3).map((p,i)=><button key={p.id} onClick={()=>setActive(p.id)} className="rounded-xl border border-[#D8D4EF] bg-[#F5F2FF] p-4 text-left transition hover:shadow-md"><p className="text-xs font-bold text-[#7256C0]">{i===0?"PRIORITAIRE":"ALTERNATIVE"}</p><p className="mt-2 font-semibold">{p.title}</p><p className="mt-2 text-xs text-[#62718D]">{p.goal}</p></button>)}</div><button onClick={()=>setShowAll(v=>!v)} className="mt-5 min-h-11 rounded-xl border border-[#C8BFF0] bg-white px-5 text-sm font-bold text-[#5746A7]">{showAll?"Masquer les autres parcours":"Explorer d’autres parcours"}</button></section>{showAll&&<><div className="mt-7 flex flex-wrap gap-3"><div className="flex min-h-12 flex-1 items-center gap-2 rounded-2xl border border-[#D9E0F1] bg-white/90 px-4"><Search size={18} className="text-[#AEBDE6]"/><input aria-label="Rechercher un parcours" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Métier, objectif, niveau, projet…" className="w-full min-w-40 bg-transparent text-sm text-[#172041] outline-none placeholder:text-[#8B9ABA]"/></div><select aria-label="Filtrer par domaine" value={category} onChange={e=>setCategory(e.target.value)} className="min-h-12 rounded-2xl border border-[#D9E0F1] bg-white/90 px-4 text-sm text-[#172041]">{pathCategories.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
 {profileReady&&recommended.length>0&&<section className="mt-8 rounded-[24px] border border-[#B9E3DB] bg-[#ECF7F6] p-5 sm:p-7"><div className="flex items-center gap-2 text-[#267C8C]"><Sparkles size={20}/><h2 className="font-semibold">Votre sélection pédagogique</h2></div><p className="mt-2 text-sm text-[#526889]">Recommandations explicables selon votre profil et vos bilans exploitables. La maîtrise des exercices n’est pas encore suivie.</p><div className="mt-4 flex flex-wrap gap-2">{recommended.map(({path:p,reasons})=><button key={p.id} onClick={()=>setActive(p.id)} className="max-w-xs rounded-xl border border-[#CADBF0] bg-[#EEF0FF] px-4 py-3 text-left text-sm transition hover:bg-[#E4E7FF]"><span className="block font-semibold">{p.title} <ArrowRight size={14} className="ml-1 inline"/></span><span className="mt-1 block text-xs leading-5 text-[#5F7293]">{reasons[0]||"À découvrir"}</span></button>)}</div></section>}
 <p aria-live="polite" className="mt-5 text-sm text-[#62718D]">{filtered.length} parcours disponibles · {pathCategories.length-1} familles</p>
 <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice(0,visibleCount).map((p,i)=><article key={p.id} className="report-v2-rise flex h-full flex-col rounded-[24px] border border-[#DCE3F4] bg-gradient-to-br from-white to-[#F3F0FF] p-5 shadow-[0_8px_24px_rgba(43,39,99,.05)]" style={{animationDelay:`${Math.min(i,8)*35}ms`}}><div className="flex items-center justify-between gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#AC92FF]/15 text-[#7256BC]"><Compass size={22}/></span><span className="text-xs font-semibold text-[#247A79]">{p.duration}</span></div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#7659C5]">{p.category} · {p.level==="foundation"?"Découverte":p.level==="practice"?"Approfondissement":"Challenge"}</p><h2 className="mt-2 text-xl font-semibold">{p.title}</h2><p className="mt-3 text-sm leading-7 text-[#506586]">{p.goal}</p><p className="mt-3 text-xs text-[#7885A4]">{p.audience}</p><div className="flex-1"/><button onClick={()=>setActive(p.id)} className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-2xl text-white bg-gradient-to-r from-[#566BF2] via-[#8154E8] to-[#B35BD5] px-4 text-sm font-bold transition hover:brightness-110">Découvrir ce parcours <ArrowRight size={16}/></button></article>)}</section>{!filtered.length&&<p className="mt-6 text-[#596C90]">Aucun parcours ne correspond à votre recherche.</p>}{filtered.length>visibleCount&&<button onClick={()=>setVisibleCount(v=>v+6)} className="mt-5 min-h-11 rounded-xl border border-[#C8BFF0] bg-white px-5 text-sm font-bold text-[#5746A7]">Voir 6 parcours supplémentaires</button>}</>}</>:
 <section className="mt-9 rounded-[24px] border border-[#DCE3F4] bg-white/85 p-6 sm:p-9"><button onClick={()=>setActive(null)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#5666AA]"><ArrowLeft size={17}/> Tous les parcours</button><p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#654DB2]">{chosen.category} · {chosen.duration}</p><h2 className="mt-3 text-3xl font-semibold">{chosen.title}</h2><p className="mt-3 text-sm leading-7 text-[#60718F]">{chosen.goal}</p><div className="mt-5 flex flex-wrap items-center gap-3"><button disabled={savingPath||activePathId===chosen.id} onClick={()=>void activatePath(chosen.id)} className="min-h-11 rounded-xl bg-[#6655DB] px-5 text-sm font-bold text-white disabled:opacity-55">{activePathId===chosen.id?"Parcours actif":savingPath?"Enregistrement…":"Choisir ce parcours"}</button>{activePathId===chosen.id&&<span className="text-sm font-semibold text-[#327768]">{adaptiveSteps(chosen,recommended.find(x=>x.path.id===chosen.id)?.priorityModule||null).filter(step=>completedExercises.has(step.exercise.id)).length} / {chosen.modules.length} étapes réalisées</span>}</div><div className="mt-8 space-y-3">{adaptiveSteps(chosen,recommended.find(x=>x.path.id===chosen.id)?.priorityModule||null).map(({index,exercise})=><div key={exercise.id} className="flex flex-col gap-4 rounded-[20px] border border-[#DCE3F4] bg-white/85 p-5 sm:flex-row sm:items-center"><span className={completedExercises.has(exercise.id)?"flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F5E9] font-bold text-[#25765F]":"flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#8464E7]/25 font-bold text-[#5A46A4]"}>{completedExercises.has(exercise.id)?<CheckCircle2 size={21}/>:String(index+1).padStart(2,"0")}</span><div className="flex-1"><p className="text-xs text-[#287C78]">{exercise.categoryLabel} · {exercise.duration}</p><h3 className="mt-1 font-semibold">{exercise.name}</h3><p className="mt-2 text-sm leading-6 text-[#63708D]">{exercise.intro}</p></div><Link href={`/exercises?exercise=${encodeURIComponent(exercise.id)}`} className="academy-cta interview-v2-primary inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold">{completedExercises.has(exercise.id)?"Refaire":"S’entraîner"} <ArrowRight size={16}/></Link></div>)}</div><p className="mt-6 text-xs leading-6 text-[#7182A0]">Itinéraire pédagogique conseillé, sans blocage, score ou certification. Les étapes réalisées proviennent des tentatives sauvegardées ; cela ne certifie pas une maîtrise.</p></section>}
 {pathError&&<p role="alert" className="mt-4 text-sm text-[#A84465]">{pathError}</p>}
 <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#E4E8F5] pt-6"><span className="inline-flex items-center gap-2 text-xs text-[#7483A3]"><Layers3 size={17}/> Parcours éditoriaux V1 · pilote interne</span><Link href="/exercises" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#7451C8]"><BookOpen size={17}/> Explorer les 288 exercices <Target size={15}/></Link></footer>
 </div></div></AcademyShell>;
}
