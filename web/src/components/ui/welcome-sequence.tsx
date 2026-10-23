"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Languages, Sparkles, Target, TrendingUp } from "lucide-react";
import type { OnboardingProfile } from "./onboarding-stages";

type Props = {
  profile: OnboardingProfile;
  objective: string;
  priorities: string[];
  onContinue: () => void;
  onPrevious: () => void;
};

const words = "Votre objectif est clair. Maintenant, on va le préparer ensemble.".split(" ");

export function WelcomeSequence({ profile, objective, priorities, onContinue, onPrevious }: Props) {
  const reducedMotion = useReducedMotion();
  const [skip, setSkip] = useState(false);
  const animate = !reducedMotion && !skip;
  const firstName = profile.firstName.trim();
  const language = profile.preferredLocale === "en" ? "English" : "Français";
  const chapters = [
    { label: "NOTRE OBJECTIF", text: objective, icon: Target, delay: 1.55 },
    { label: "CE QU’ON VA TRAVAILLER", text: priorities.join(" · "), icon: TrendingUp, delay: 1.85 },
    { label: "ON S’ENTRAÎNE EN", text: language, icon: Languages, delay: 2.15 },
  ];

  return (
    <section data-testid="welcome-sequence" aria-label="Bienvenue dans notre espace" className="welcome-stage relative isolate mx-auto flex min-h-[min(760px,calc(100dvh-130px))] w-full max-w-[1100px] flex-col justify-center overflow-hidden rounded-[30px] border border-white/50 px-6 py-10 text-white shadow-[0_40px_100px_rgba(21,32,73,0.24)] sm:px-14 sm:py-14">
      <div aria-hidden="true" className="welcome-aura welcome-aura-a" />
      <div aria-hidden="true" className="welcome-aura welcome-aura-b" />
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="flex min-h-10 items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B9C9EE]">
            <Sparkles size={16} aria-hidden="true"/> NOTRE AVENTURE COMMENCE ICI
          </span>
          {!skip && !reducedMotion && (
            <button type="button" onClick={() => setSkip(true)}
              className="min-h-11 rounded-xl px-3 text-xs font-semibold text-[#D2DCED] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Passer l’animation
            </button>
          )}
        </div>
        <motion.div initial={animate ? { opacity: 0, y: 34, filter: "blur(12px)" } : false}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: animate ? 0.8 : 0, ease: [0.2, 0.8, 0.2, 1] }} className="mt-8">
          <motion.span initial={animate ? { scale: 0.78, opacity: 0, rotate: -12 } : false}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={animate ? { type: "spring", damping: 16, stiffness: 160, delay: 0.1 } : { duration: 0 }}
            className="mb-7 grid h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/10 text-[#E6EDFF] shadow-[0_14px_40px_rgba(49,84,172,0.22)] backdrop-blur-xl">
            <Sparkles size={29} aria-hidden="true"/>
          </motion.span>
          <h1 className="text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[1.04] tracking-[-0.06em]">
            Bienvenue{firstName ? `, ${firstName}` : ""}<span className="text-[#A9C0FF]">.</span>
          </h1>
        </motion.div>
        <p aria-label="Votre objectif est clair. Maintenant, on va le préparer ensemble."
          className="mt-7 max-w-2xl text-[clamp(1.12rem,2.2vw,1.5rem)] font-medium leading-[1.55] tracking-[-0.02em] text-[#D8E3FC]">
          {words.map((word, index) => (
            <motion.span key={index} aria-hidden="true" className="mr-[0.3em] inline-block"
              initial={animate ? { opacity: 0, y: 15, filter: "blur(5px)" } : false}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: animate ? 0.4 : 0, delay: animate ? 0.54 + index * 0.095 : 0, ease: "easeOut" }}>
              {word}
            </motion.span>
          ))}
        </p>
        <div className="mt-9 grid gap-3 sm:grid-cols-3" aria-label="Notre plan de préparation">
          {chapters.map(({ label, text, icon: Icon, delay }) => (
            <motion.div key={label} initial={animate ? { opacity: 0, y: 28, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: animate ? 0.55 : 0, delay: animate ? delay : 0, ease: [0.2, 0.8, 0.2, 1] }}
              className="welcome-card flex min-h-[132px] flex-col rounded-[22px] border border-white/15 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#AFC3F4]">
                <Icon size={16} aria-hidden="true"/> {label}
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-white">{text}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={animate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animate ? 0.45 : 0, delay: animate ? 2.55 : 0 }}
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-7">
          <button type="button" onClick={onPrevious}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#CFDAF3] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <ArrowLeft size={18} aria-hidden="true"/> Précédent
          </button>
          <button type="button" onClick={onContinue}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#17264D] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#E9F1FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Découvrir notre espace <ArrowRight size={18} aria-hidden="true"/>
          </button>
        </motion.div>
        <p className="mt-5 text-xs leading-5 text-[#BCCBE6]">
          Aperçu UX : les réponses ne sont pas encore enregistrées dans Supabase.
        </p>
      </div>
    </section>
  );
}
