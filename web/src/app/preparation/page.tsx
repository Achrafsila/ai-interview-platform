"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Code2, LayoutDashboard, CirclePlay, UserRound, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type InterviewKind = "rh" | "technical";

export default function PreparationPage() {
  const [kind, setKind] = useState<InterviewKind>("rh");
  return (
    <main className="relative min-h-screen bg-[#EDF3FE] text-[#172033] [color-scheme:light]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_56%_78%_at_92%_18%,rgba(156,174,246,.35),transparent_75%)]"/>
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[246px] shrink-0 flex-col border-r border-[#C2CFEB] bg-white/45 px-4 py-7 lg:flex">
          <Link href="/" className="flex items-center gap-3 px-3 text-base font-bold tracking-tight"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E1E9FF]"><Sparkles size={19}/></span><span>Interview<span className="block text-xs font-medium tracking-[.14em] text-[#4B64A7]">PLATFORM</span></span></Link>
          <p className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#52678C]">Espace candidat</p>
          <nav aria-label="Navigation candidat" className="mt-4 space-y-1.5">
            <Link href="/dashboard" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#52678C] transition hover:bg-white/75 hover:text-[#172033]"><LayoutDashboard size={18}/> Vue d’ensemble</Link>
            <Link href="/preparation" aria-current="page" className="flex min-h-12 items-center gap-3 rounded-xl border border-[#B4C5F0] bg-[#DFE8FF] px-4 text-sm font-semibold text-[#2947A3]"><CirclePlay size={18}/> Simulation</Link>
            <Link href="/onboarding" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#52678C] transition hover:bg-white/75 hover:text-[#172033]"><UserRound size={18}/> Mon profil</Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-[#BFCCEB] px-5 sm:px-9 lg:px-10">
            <div className="flex items-center gap-2 text-sm text-[#52678C]"><Link href="/dashboard" className="transition hover:text-[#172033]">Espace candidat</Link><span>/</span><span className="font-semibold text-[#172033]">Simulation</span></div>
            <Link href="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-[#2947A3] transition hover:bg-white/70"><ArrowLeft size={16}/> Retour</Link>
          </header>
          <div className="w-full px-5 pb-20 pt-9 sm:px-9 lg:px-10 lg:pt-12">
            <div className="mb-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#3656A1]"><Sparkles size={15}/> Préparer un entretien</p>
              <h1 className="mt-4 text-[clamp(2rem,3.5vw,3.35rem)] font-bold tracking-[-.05em]">Choisissez votre type d’entretien.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#526688]">Chaque simulation sera adaptée à vos objectifs. Commencez par sélectionner le format que vous souhaitez travailler.</p>
            </div>
            <section className="max-w-[1000px] rounded-[28px] border border-[#B3C6EF] bg-white/65 p-6 shadow-[0_20px_60px_rgba(0,5,20,.22)] sm:p-9">
              <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">Votre prochaine simulation</h2><span className="rounded-full border border-[#37537F] bg-[#DFE8FB] px-3 py-1.5 text-xs font-semibold text-[#3656A1]">Étape 1 · Format</span></div>
              <div role="radiogroup" aria-label="Type d’entretien" className="mt-8 grid gap-4 md:grid-cols-2">
                {([
                  {value:"rh" as const,title:"Entretien RH",detail:"Parcours, motivation, réalisations et mises en situation professionnelle.",Icon:BriefcaseBusiness},
                  {value:"technical" as const,title:"Entretien technique",detail:"Connaissances métier, raisonnement, résolution de problèmes et pratique.",Icon:Code2},
                ]).map(({value,title,detail,Icon})=>(
                  <button type="button" role="radio" aria-checked={kind===value} key={value} onClick={()=>setKind(value)}
                    className={cn("group flex min-h-[200px] flex-col items-start rounded-2xl border p-6 text-left transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8C2FF]",kind===value?"border-[#4762DB] bg-[#E2EBFF] shadow-[0_12px_40px_rgba(40,85,190,.16)]":"border-[#C1CFEB] bg-[#F9FBFF] hover:border-[#6386C5]")}>
                    <span className="flex w-full items-center justify-between"><span className={cn("grid h-11 w-11 place-items-center rounded-xl",kind===value?"bg-[#D6E3FF] text-[#3656A1]":"bg-[#E1E9FA] text-[#3656A1]")}><Icon size={22}/></span>{kind===value&&<Check size={19} className="text-[#3656A1]"/>}</span>
                    <span className="mt-6 text-lg font-semibold text-[#172033]">{title}</span><span className="mt-2 text-sm leading-6 text-[#526688]">{detail}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-[#B9C8E6] pt-7">
                <p className="max-w-[480px] text-xs leading-6 text-[#526688]"><strong className="text-[#172033]">Version de démonstration :</strong> le moteur de simulation existant s’ouvre séparément. Le choix du format devra encore être transmis automatiquement.</p>
                <a href="http://127.0.0.1:8765/e2e" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center gap-3 rounded-xl bg-[#2947A3] px-6 py-3 text-sm font-bold text-[#172033] transition hover:-translate-y-0.5 hover:bg-[#3D5AC3]">Tester le simulateur existant <ArrowRight size={18}/></a>
              </div>
              <p className="mt-4 text-xs text-[#526688]">Format sélectionné : {kind==="rh"?"Entretien RH":"Entretien technique"}. Aucune séance n’est enregistrée depuis cette page.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
