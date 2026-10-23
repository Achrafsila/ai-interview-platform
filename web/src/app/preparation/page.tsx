"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Code2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type InterviewKind = "rh" | "technical";

export default function PreparationPage() {
  const [kind, setKind] = useState<InterviewKind>("rh");
  return (
    <main className="onboarding-atmosphere relative isolate min-h-screen overflow-hidden text-[#172033]">
      <div aria-hidden="true" className="atmosphere-orb atmosphere-orb-one" />
      <div aria-hidden="true" className="atmosphere-orb atmosphere-orb-two" />
      <div className="relative z-10 mx-auto max-w-[960px] px-5 pb-16 sm:px-8">
        <nav className="flex min-h-[94px] items-center justify-between gap-4" aria-label="Parcours de préparation">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#526079] hover:bg-white/70"><ArrowLeft size={17}/> Mon espace</Link>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748F]">Notre prochaine séance</span>
        </nav>
        <section className="onboarding-glass mt-6 rounded-[32px] border border-white/80 p-7 sm:p-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2947A3]"><Sparkles size={15}/> On prépare notre entretien</span>
          <h1 className="mt-5 text-[34px] font-semibold leading-tight tracking-[-0.045em] sm:text-[48px]">On commence par quoi ?</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#526079]">Un entretien RH ou un échange technique ? Choisissons le format qui vous sera le plus utile aujourd’hui.</p>
          <div role="radiogroup" aria-label="Type d’entretien" className="mt-9 grid gap-4 sm:grid-cols-2">
            {([
              {value:"rh" as const, title:"Entretien RH", detail:"Parcours, motivation, réalisations et situations professionnelles.", Icon:BriefcaseBusiness},
              {value:"technical" as const, title:"Entretien technique", detail:"Connaissances, raisonnement, résolution de problèmes et mise en pratique.", Icon:Code2},
            ]).map(({value,title,detail,Icon})=>(
              <button type="button" role="radio" aria-checked={kind===value} key={value} onClick={()=>setKind(value)}
                className={cn("flex min-h-[178px] flex-col items-start rounded-2xl border p-6 text-left transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2947A3]",kind===value?"border-[#2947A3] bg-[#F0F4FC] shadow-[0_12px_30px_rgba(41,71,163,0.10)]":"border-[#DDE5F2] bg-white/65")}>
                <span className="flex w-full items-center justify-between"><Icon size={23} className="text-[#2947A3]"/>{kind===value&&<Check size={18} className="text-[#2947A3]"/>}</span>
                <span className="mt-5 text-lg font-semibold">{title}</span>
                <span className="mt-2 text-sm leading-6 text-[#526079]">{detail}</span>
              </button>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-[#DDE5F2] pt-7">
            <p className="max-w-lg text-sm leading-6 text-[#526079]"><strong>Version de démonstration :</strong> le simulateur Groq existe déjà, mais son intégration dans cette nouvelle interface est encore en cours.</p>
            <a href="http://127.0.0.1:8765/e2e" target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#2947A3] px-6 text-sm font-semibold text-white transition hover:bg-[#1E3586]">
              Tester le simulateur existant <ArrowRight size={18}/>
            </a>
          </div>
          <p className="mt-4 text-xs text-[#78859B]">Votre choix {kind==="rh"?"RH":"technique"} sera à confirmer dans le simulateur actuel. Aucune séance n’est enregistrée depuis cet écran.</p>
        </section>
      </div>
    </main>
  );
}
