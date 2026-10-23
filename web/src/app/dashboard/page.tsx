"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, ChevronRight, Compass, GraduationCap, MessageCircle, Sparkles, Target, TrendingUp, UserRound } from "lucide-react";
import type { OnboardingProfile, ProfessionalGoal, PreparationGoal } from "@/components/ui/onboarding-stages";

const profileKey = "ai-interview-preview-profile";
const subscribeNoop = () => () => {};

const goals: Record<ProfessionalGoal, { label: string; detail: string; icon: typeof Target }> = {
  first_job: { label: "Décrocher un premier emploi", detail: "On va transformer votre potentiel et vos expériences en réponses convaincantes.", icon: GraduationCap },
  job_change: { label: "Changer de poste", detail: "On va préparer ensemble la façon de raconter votre parcours et vos envies.", icon: Compass },
  career_growth: { label: "Évoluer professionnellement", detail: "On va mettre en lumière vos réussites et préparer votre prochaine étape.", icon: TrendingUp },
};
const priorities: Record<PreparationGoal, string> = {
  confidence: "Prendre confiance",
  answer_structure: "Structurer nos réponses",
  communication: "Mieux communiquer",
  domain_knowledge: "Renforcer les connaissances métier",
  stress_management: "Gérer la pression",
};
const validGoal = (v: unknown): v is ProfessionalGoal => v === "first_job" || v === "job_change" || v === "career_growth";
const validPriority = (v: unknown): v is PreparationGoal => typeof v === "string" && v in priorities;

function loadPreviewProfile(raw: string | null): OnboardingProfile | null {
  try {
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const p = value as Partial<OnboardingProfile>;
    if (typeof p.firstName !== "string" || !p.firstName.trim() || typeof p.lastName !== "string" || !validGoal(p.professionalGoal)) return null;
    return {
      firstName: p.firstName.slice(0, 80),
      lastName: p.lastName.slice(0, 80),
      professionalGoal: p.professionalGoal,
      preparationGoals: Array.isArray(p.preparationGoals) ? p.preparationGoals.filter(validPriority).slice(0, 3) : [],
      preferredLocale: p.preferredLocale === "en" ? "en" : "fr",
    };
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const stored = useSyncExternalStore(subscribeNoop, () => window.sessionStorage.getItem(profileKey), () => undefined);
  const profile = stored === undefined ? undefined : loadPreviewProfile(stored);
  const reducedMotion = useReducedMotion();
  const goal = profile && goals[profile.professionalGoal];
  const GoalIcon = goal?.icon ?? Target;

  return (
    <main className="onboarding-atmosphere relative isolate min-h-screen overflow-hidden text-[#172033]">
      <div className="atmosphere-orb atmosphere-orb-one" aria-hidden="true" />
      <div className="atmosphere-orb atmosphere-orb-two" aria-hidden="true" />
      <div className="atmosphere-orb atmosphere-orb-three" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-16 sm:px-8">
        <header className="flex min-h-[96px] flex-wrap items-center justify-between gap-4 border-b border-white/60 py-5">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold tracking-tight">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#101A30] text-white shadow-lg"><Sparkles size={20}/></span>
            Interview Platform
          </Link>
          <nav aria-label="Navigation de l’espace candidat" className="flex flex-wrap items-center gap-3 sm:gap-5">
            <span aria-current="page" className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#172033]">Mon espace</span>
            <Link href="/onboarding" className="rounded-full px-3 py-2 text-sm font-medium text-[#526079] transition hover:bg-white/70">Mon profil</Link>
          </nav>
        </header>

        {profile === undefined ? (
          <div role="status" className="py-28 text-center text-[#526079]">On prépare votre espace…</div>
        ) : profile === null ? (
          <section className="onboarding-glass mx-auto mt-16 max-w-2xl rounded-[30px] border border-white/80 p-8 text-center shadow-xl sm:p-14">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E9EEFA] text-[#2947A3]"><UserRound size={28}/></span>
            <h1 className="mt-7 text-[32px] font-semibold tracking-tight sm:text-[43px]">On fait connaissance ?</h1>
            <p className="mx-auto mt-4 max-w-md leading-8 text-[#526079]">Pour préparer notre premier entretien, on commence par comprendre ce que vous souhaitez accomplir.</p>
            <Link href="/onboarding" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#2947A3] px-6 text-sm font-semibold text-white hover:bg-[#1E3586]">Commencer mon parcours <ArrowRight size={17}/></Link>
            <p className="mt-6 text-xs text-[#78859B]">Ce prototype ne conserve les réponses que dans cet onglet.</p>
          </section>
        ) : (
          <>
            <motion.section initial={reducedMotion ? false : {opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.48}} className="pt-12 sm:pt-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/65 px-4 py-2 text-xs font-semibold text-[#2947A3] backdrop-blur-xl"><Sparkles size={14}/> Notre espace d’entraînement</span>
              <h1 className="mt-6 max-w-3xl text-[clamp(2.35rem,5vw,4.2rem)] font-semibold leading-[1.08] tracking-[-0.052em]">Bonjour, {profile.firstName}.<span className="block text-[#3755A5]">On prépare la suite ?</span></h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[#526079]">On connaît maintenant notre direction. À chaque entraînement, on avancera un peu plus vers votre objectif.</p>
            </motion.section>

            <div className="mt-10 grid gap-5 lg:grid-cols-[1.28fr_0.72fr]">
              <motion.section initial={reducedMotion ? false : {opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.09}} className="relative flex min-h-[344px] flex-col overflow-hidden rounded-[30px] border border-white/30 bg-[#101B34] p-7 text-white shadow-[0_32px_70px_rgba(29,45,86,0.22)] sm:p-10">
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-20 h-[340px] w-[340px] rounded-full bg-[#6C8CF6]/20 blur-[60px]"/>
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-12 h-[310px] w-[310px] rounded-full bg-[#6F5CB5]/15 blur-[64px]"/>
                <div className="relative z-10">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#ACC0F5]">Notre prochaine étape</span>
                  <h2 className="mt-5 max-w-md text-[30px] font-semibold leading-tight tracking-[-0.04em] sm:text-[38px]">On passe de la préparation à la pratique.</h2>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-[#CBD4E5]">Choisissons un entretien RH ou technique. Trois questions pour commencer, des relances pour aller plus loin, et des pistes concrètes à la fin.</p>
                </div>
                <div className="relative z-10 mt-auto flex flex-wrap items-center gap-4 pt-9">
                  <Link href="/preparation" className="inline-flex min-h-13 items-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[#152344] transition hover:-translate-y-0.5 hover:bg-[#EDF2FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                    Préparer notre entretien <ArrowUpRight size={18}/>
                  </Link>
                  <span className="text-xs text-[#BCC7DC]">À votre rythme, sans pression.</span>
                </div>
              </motion.section>

              <motion.section initial={reducedMotion ? false : {opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.16}} className="onboarding-glass flex flex-col rounded-[30px] border border-white/80 p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748F]">Notre objectif</span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ECF1FD] text-[#2947A3]"><GoalIcon size={20}/></span>
                </div>
                <h2 className="mt-7 text-[25px] font-semibold leading-tight tracking-[-0.035em]">{goal?.label}</h2>
                <p className="mt-4 flex-1 text-sm leading-7 text-[#526079]">{goal?.detail}</p>
                <Link href="/onboarding" className="mt-8 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#2947A3] hover:underline">Revoir notre objectif <ChevronRight size={17}/></Link>
              </motion.section>
            </div>

            <section className="mt-9 grid gap-5 lg:grid-cols-[1.28fr_0.72fr]" aria-label="Notre programme">
              <div className="onboarding-glass rounded-[30px] border border-white/80 p-7 sm:p-9">
                <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ECF1FD] text-[#2947A3]"><Target size={20}/></span><h2 className="text-xl font-semibold tracking-tight">Ce qu’on va travailler ensemble</h2></div>
                <p className="mt-3 text-sm leading-7 text-[#526079]">Voici les points que vous avez choisis. On pourra les adapter à chaque entretien.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {profile.preparationGoals.length ? profile.preparationGoals.map((key)=><span key={key} className="rounded-full border border-[#D8E3F9] bg-[#F4F7FF]/85 px-4 py-2.5 text-sm font-semibold text-[#2947A3]">{priorities[key]}</span>) : <span className="text-sm text-[#526079]">On définira les priorités avant notre premier entretien.</span>}
                </div>
              </div>
              <div className="onboarding-glass rounded-[30px] border border-white/80 p-7 sm:p-9">
                <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ECF1FD] text-[#2947A3]"><BookOpen size={20}/></span><h2 className="text-xl font-semibold tracking-tight">Nos entraînements</h2></div>
                <p className="mt-5 text-sm leading-7 text-[#526079]">Nous n’avons pas encore d’entraînement enregistré. On commence quand vous voulez.</p>
                <Link href="/preparation" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2947A3] hover:underline">Choisir notre premier entretien <ArrowRight size={17}/></Link>
              </div>
            </section>

            <footer className="mt-9 flex items-start gap-3 rounded-2xl border border-white/70 bg-white/45 px-5 py-4 text-xs leading-6 text-[#66748A] backdrop-blur-md">
              <MessageCircle className="mt-0.5 shrink-0" size={16}/>
              <p><strong className="text-[#526079]">Aperçu UX.</strong> Vos réponses sont conservées uniquement dans cet onglet, sans enregistrement Supabase. Les résultats d’entretien et les scores ne sont pas encore connectés à ce nouveau frontend.</p>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
