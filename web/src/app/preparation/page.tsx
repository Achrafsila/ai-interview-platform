"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Code2, LayoutDashboard, CirclePlay, UserRound, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type InterviewKind = "rh" | "technical";

export default function PreparationPage() {
  const [kind, setKind] = useState<InterviewKind>("rh");
  return (
    <main className="relative min-h-screen bg-[#070F20] text-[#F6F8FF] [color-scheme:dark]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_80%_0%,rgba(49,89,203,.20),transparent_80%)]"/>
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[246px] shrink-0 flex-col border-r border-[#24304A] bg-[#0A1428]/95 px-4 py-7 lg:flex">
          <Link href="/" className="flex items-center gap-3 px-3 text-base font-bold tracking-tight"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#446CE4] to-[#6553AD]"><Sparkles size={19}/></span><span>Interview<span className="block text-xs font-medium tracking-[.14em] text-[#91A8D8]">PLATFORM</span></span></Link>
          <p className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#7789A8]">Espace candidat</p>
          <nav aria-label="Navigation candidat" className="mt-4 space-y-1.5">
            <Link href="/dashboard" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#A4B5D3] transition hover:bg-[#192C4B] hover:text-white"><LayoutDashboard size={18}/> Vue d’ensemble</Link>
            <Link href="/preparation" aria-current="page" className="flex min-h-12 items-center gap-3 rounded-xl border border-[#456BD0]/30 bg-[#3157BD]/20 px-4 text-sm font-semibold text-[#DCE8FF]"><CirclePlay size={18}/> Simulation</Link>
            <Link href="/onboarding" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#A4B5D3] transition hover:bg-[#192C4B] hover:text-white"><UserRound size={18}/> Mon profil</Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-[#22314F] px-5 sm:px-9 lg:px-10">
            <div className="flex items-center gap-2 text-sm text-[#91A6C9]"><Link href="/dashboard" className="transition hover:text-white">Espace candidat</Link><span>/</span><span className="font-semibold text-white">Simulation</span></div>
            <Link href="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-[#ABC2F4] transition hover:bg-[#1B2F51]"><ArrowLeft size={16}/> Retour</Link>
          </header>
          <div className="w-full px-5 pb-20 pt-9 sm:px-9 lg:px-10 lg:pt-12">
            <div className="mb-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#91B0FB]"><Sparkles size={15}/> Préparer un entretien</p>
              <h1 className="mt-4 text-[clamp(2rem,3.5vw,3.35rem)] font-bold tracking-[-.05em]">Choisissez votre type d’entretien.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#A8BAD7]">Chaque simulation sera adaptée à vos objectifs. Commencez par sélectionner le format que vous souhaitez travailler.</p>
            </div>
            <section className="max-w-[1000px] rounded-[28px] border border-[#2B3F62] bg-[#101D35]/90 p-6 shadow-[0_20px_60px_rgba(0,5,20,.22)] sm:p-9">
              <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">Votre prochaine simulation</h2><span className="rounded-full border border-[#37537F] bg-[#1D3458] px-3 py-1.5 text-xs font-semibold text-[#B5CCFF]">Étape 1 · Format</span></div>
              <div role="radiogroup" aria-label="Type d’entretien" className="mt-8 grid gap-4 md:grid-cols-2">
                {([
                  {value:"rh" as const,title:"Entretien RH",detail:"Parcours, motivation, réalisations et mises en situation professionnelle.",Icon:BriefcaseBusiness},
                  {value:"technical" as const,title:"Entretien technique",detail:"Connaissances métier, raisonnement, résolution de problèmes et pratique.",Icon:Code2},
                ]).map(({value,title,detail,Icon})=>(
                  <button type="button" role="radio" aria-checked={kind===value} key={value} onClick={()=>setKind(value)}
                    className={cn("group flex min-h-[200px] flex-col items-start rounded-2xl border p-6 text-left transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8C2FF]",kind===value?"border-[#7299F8] bg-[#1E3766] shadow-[0_12px_40px_rgba(40,85,190,.16)]":"border-[#314768] bg-[#14253F] hover:border-[#6386C5]")}>
                    <span className="flex w-full items-center justify-between"><span className={cn("grid h-11 w-11 place-items-center rounded-xl",kind===value?"bg-[#2E53A0] text-[#DAE6FF]":"bg-[#213658] text-[#9EB9F2]")}><Icon size={22}/></span>{kind===value&&<Check size={19} className="text-[#9FD1FF]"/>}</span>
                    <span className="mt-6 text-lg font-semibold text-white">{title}</span><span className="mt-2 text-sm leading-6 text-[#A8BAD7]">{detail}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-[#2C3C5A] pt-7">
                <p className="max-w-[480px] text-xs leading-6 text-[#9CAFCF]"><strong className="text-[#D9E6FF]">Version de démonstration :</strong> le moteur de simulation existant s’ouvre séparément. Le choix du format devra encore être transmis automatiquement.</p>
                <a href="http://127.0.0.1:8765/e2e" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center gap-3 rounded-xl bg-[#E9F0FF] px-6 py-3 text-sm font-bold text-[#17305E] transition hover:-translate-y-0.5 hover:bg-white">Tester le simulateur existant <ArrowRight size={18}/></a>
              </div>
              <p className="mt-4 text-xs text-[#8599BE]">Format sélectionné : {kind==="rh"?"Entretien RH":"Entretien technique"}. Aucune séance n’est enregistrée depuis cette page.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
