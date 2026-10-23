"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ChevronRight, Compass, Languages, ShieldCheck, Sparkles, Target, TrendingUp, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type ProfessionalGoal = "first_job" | "job_change" | "career_growth";
export type PreparationGoal = "confidence" | "answer_structure" | "communication" | "domain_knowledge" | "stress_management";
export type Locale = "fr" | "en";
export type OnboardingProfile = {
  firstName: string;
  lastName: string;
  professionalGoal: ProfessionalGoal;
  preparationGoals: PreparationGoal[];
  preferredLocale: Locale;
};

type Props = {
  className?: string;
  onComplete?: (profile: OnboardingProfile) => void;
  initialProfile?: Partial<OnboardingProfile>;
  enableAnimations?: boolean;
};

const professionalOptions: { value: ProfessionalGoal; title: string; detail: string; icon: typeof Target }[] = [
  { value: "first_job", title: "Décrocher mon premier emploi", detail: "Présenter mon potentiel, mes projets et convaincre dès le premier entretien.", icon: Compass },
  { value: "job_change", title: "Changer de poste", detail: "Mettre en valeur mon expérience et expliquer la suite que je veux donner à ma carrière.", icon: BriefcaseBusiness },
  { value: "career_growth", title: "Évoluer professionnellement", detail: "Prendre confiance pour accéder à un nouveau niveau de responsabilités.", icon: TrendingUp },
];

const preparationOptions: { value: PreparationGoal; title: string; detail: string }[] = [
  { value: "confidence", title: "Prendre confiance", detail: "Être plus à l’aise pour parler de moi et de mes réalisations." },
  { value: "answer_structure", title: "Donner des réponses plus claires", detail: "Organiser mes idées et illustrer mes réponses avec des exemples." },
  { value: "communication", title: "Mieux communiquer", detail: "M'exprimer naturellement, avec précision et conviction." },
  { value: "domain_knowledge", title: "Renforcer mes connaissances métier", detail: "Approfondir les sujets liés à mon domaine professionnel." },
  { value: "stress_management", title: "Mieux gérer la pression", detail: "Rester concentré, même face à une question inattendue." },
];

const steps = [
  { label: "Votre identité", icon: UserRound },
  { label: "Votre ambition", icon: Target },
  { label: "Vos priorités", icon: Sparkles },
  { label: "Votre langue", icon: Languages },
] as const;

const defaultProfile: OnboardingProfile = {
  firstName: "",
  lastName: "",
  professionalGoal: "job_change",
  preparationGoals: [],
  preferredLocale: "fr",
};

export function OnboardingStages({
  className,
  onComplete,
  initialProfile,
  enableAnimations = true,
}: Props) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const animated = enableAnimations && !reducedMotion;
  const [profile, setProfile] = useState<OnboardingProfile>({ ...defaultProfile, ...initialProfile });
  const [step, setStep] = useState(0);
  const [fieldError, setFieldError] = useState("");
  const [finished, setFinished] = useState(false);
  const percent = Math.round(((step + 1) / steps.length) * 100);
  const firstName = profile.firstName.trim();

  const canProceed = useMemo(() => {
    if (step === 0) return firstName.length > 0 && profile.lastName.trim().length > 0;
    if (step === 2) return profile.preparationGoals.length > 0;
    return true;
  }, [step, firstName, profile.lastName, profile.preparationGoals.length]);

  function next() {
    if (!canProceed) {
      setFieldError(step === 0
        ? "Indiquez votre prénom et votre nom pour continuer."
        : "Sélectionnez au moins un axe de progression.");
      return;
    }
    if (step === steps.length - 1) {
      const completed = { ...profile, firstName, lastName: profile.lastName.trim() };
      onComplete?.(completed);
      setFinished(true);
      return;
    }
    setFieldError("");
    setStep((current) => current + 1);
  }

  function toggleGoal(value: PreparationGoal) {
    setProfile((current) => ({
      ...current,
      preparationGoals: current.preparationGoals.includes(value)
        ? current.preparationGoals.filter((v) => v !== value)
        : current.preparationGoals.length < 3
          ? [...current.preparationGoals, value]
          : current.preparationGoals,
    }));
    setFieldError("");
  }

  function restart() {
    setFinished(false);
    setStep(0);
    setFieldError("");
  }

  return (
    <div className={cn("mx-auto w-full max-w-[1100px]", className)}>
      <div className="grid min-h-[660px] grid-cols-1 overflow-hidden rounded-[28px] border border-[#E0E6EF] bg-white shadow-[0_28px_90px_rgba(22,35,68,0.10)] lg:grid-cols-[330px_1fr]">
        <aside className="relative overflow-hidden bg-[#0B1222] p-7 text-white sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-[#5474CF]/15 blur-[85px]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <Sparkles size={20} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold tracking-wide">Votre espace de préparation</span>
            </div>
            <div className="mt-12 lg:mt-20">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A6B8E4]">Votre parcours</p>
              <h2 className="mt-4 max-w-[260px] text-3xl font-semibold leading-tight tracking-[-0.04em]">
                Un entraînement qui vous ressemble.
              </h2>
              <p className="mt-4 max-w-[260px] text-sm leading-7 text-[#BAC4D6]">
                Quelques réponses suffisent pour adapter vos prochains entretiens à vos ambitions.
              </p>
            </div>
            <ol className="mt-10 hidden space-y-1 lg:block" aria-label="Étapes de création du profil">
              {steps.map(({ label, icon: Icon }, index) => {
                const complete = finished || index < step;
                const active = !finished && index === step;
                return (
                  <li key={label} aria-current={active ? "step" : undefined}
                    className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm", active ? "bg-white/10 text-white" : "text-[#AEB8CC]")}>
                    <span className={cn("grid h-8 w-8 place-items-center rounded-full border", complete ? "border-[#6DBEA8] bg-[#356D65] text-white" : active ? "border-white/50 bg-white/10" : "border-white/20")}>
                      {complete ? <Check size={16} aria-hidden="true" /> : <Icon size={16} aria-hidden="true" />}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ol>
            <div className="mt-auto hidden items-center gap-2 pt-12 text-xs text-[#AEB8CC] lg:flex">
              <ShieldCheck size={15} aria-hidden="true" />
              Vos préférences restent modifiables.
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col px-6 py-7 sm:px-10 sm:py-10 lg:px-14" aria-label="Onboarding personnalisé">
          {!finished ? (
            <>
              <div className="flex items-center justify-between gap-5">
                <span className="text-sm font-medium text-[#526079]">Étape {step + 1} sur {steps.length}</span>
                <span className="text-sm font-semibold tabular-nums text-[#2947A3]">{percent}%</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E8EDF5]" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Progression de l'onboarding">
                <motion.div className="h-full rounded-full bg-[#2947A3]" initial={false}
                  animate={{ width: `${percent}%` }} transition={animated ? { duration: 0.35, ease: "easeOut" } : { duration: 0 }} />
              </div>
              <div className="mt-12 flex-1 sm:mt-16">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} initial={animated ? { opacity: 0, y: 12 } : false}
                    animate={{ opacity: 1, y: 0 }} exit={animated ? { opacity: 0, y: -8 } : { opacity: 1 }}
                    transition={{ duration: animated ? 0.22 : 0 }}>
                    {step === 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2947A3]">Commençons par faire connaissance</p>
                        <h1 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.04em] text-[#172033] sm:text-[39px]">Comment souhaitez-vous qu’on vous appelle ?</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-[#526079]">Votre prénom nous permettra de rendre l’expérience plus personnelle, dès votre premier entretien.</p>
                        <div className="mt-9 grid gap-5 sm:grid-cols-2">
                          <label className="block text-sm font-medium text-[#172033]">Prénom
                            <input autoComplete="given-name" value={profile.firstName} maxLength={80}
                              onChange={(e) => setProfile((v) => ({ ...v, firstName: e.target.value }))} placeholder="Votre prénom"
                              className="mt-2 block min-h-12 w-full rounded-xl border border-[#D7DFEA] bg-white px-4 text-base outline-none transition focus:border-[#2947A3] focus:ring-2 focus:ring-[#2947A3]/15" />
                          </label>
                          <label className="block text-sm font-medium text-[#172033]">Nom
                            <input autoComplete="family-name" value={profile.lastName} maxLength={80}
                              onChange={(e) => setProfile((v) => ({ ...v, lastName: e.target.value }))} placeholder="Votre nom"
                              className="mt-2 block min-h-12 w-full rounded-xl border border-[#D7DFEA] bg-white px-4 text-base outline-none transition focus:border-[#2947A3] focus:ring-2 focus:ring-[#2947A3]/15" />
                          </label>
                        </div>
                      </div>
                    )}
                    {step === 1 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2947A3]">Votre objectif professionnel</p>
                        <h1 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.04em] text-[#172033] sm:text-[39px]">{firstName ? `${firstName}, quelle est votre prochaine étape ?` : "Quelle est votre prochaine étape ?"}</h1>
                        <p className="mt-4 text-base leading-7 text-[#526079]">Choisissez ce qui décrit le mieux votre situation. Votre parcours s’adaptera à cet objectif.</p>
                        <div className="mt-8 space-y-3" role="radiogroup" aria-label="Objectif professionnel principal">
                          {professionalOptions.map(({ value, title, detail, icon: Icon }) => {
                            const selected = profile.professionalGoal === value;
                            return <button key={value} type="button" role="radio" aria-checked={selected}
                              onClick={() => setProfile((p) => ({ ...p, professionalGoal: value }))}
                              className={cn("flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition hover:border-[#7590D1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2947A3]", selected ? "border-[#2947A3] bg-[#F3F6FE]" : "border-[#E0E6EF]")}>
                              <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", selected ? "bg-[#2947A3] text-white" : "bg-[#EEF2F7] text-[#526079]")}><Icon size={20} aria-hidden="true" /></span>
                              <span className="flex-1"><span className="block text-[15px] font-semibold text-[#172033]">{title}</span><span className="mt-1 block text-sm leading-6 text-[#526079]">{detail}</span></span>
                              {selected && <Check className="mt-2 shrink-0 text-[#2947A3]" size={19} aria-hidden="true" />}
                            </button>;
                          })}
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2947A3]">Un accompagnement sur mesure</p>
                        <h1 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.04em] text-[#172033] sm:text-[39px]">Sur quoi aimeriez-vous progresser ?</h1>
                        <p className="mt-4 text-base leading-7 text-[#526079]">Sélectionnez jusqu’à trois priorités. Vous pourrez les modifier à tout moment.</p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                          {preparationOptions.map(({ value, title, detail }) => {
                            const selected = profile.preparationGoals.includes(value);
                            const disabled = !selected && profile.preparationGoals.length >= 3;
                            return <button key={value} type="button" aria-pressed={selected} disabled={disabled}
                              onClick={() => toggleGoal(value)}
                              className={cn("min-h-28 rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2947A3]", selected ? "border-[#2947A3] bg-[#F3F6FE]" : "border-[#E0E6EF] hover:border-[#7590D1]", disabled && "cursor-not-allowed opacity-45")}>
                              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-[#172033]">{title}<span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border", selected ? "border-[#2947A3] bg-[#2947A3] text-white" : "border-[#D1DAE7]")}>{selected && <Check size={14} aria-hidden="true" />}</span></span>
                              <span className="mt-2 block text-sm leading-6 text-[#526079]">{detail}</span>
                            </button>;
                          })}
                        </div>
                        <p className="mt-4 text-sm text-[#526079]">{profile.preparationGoals.length}/3 priorités sélectionnées</p>
                      </div>
                    )}
                    {step === 3 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2947A3]">Dernière étape</p>
                        <h1 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.04em] text-[#172033] sm:text-[39px]">Dans quelle langue souhaitez-vous vous entraîner ?</h1>
                        <p className="mt-4 max-w-lg text-base leading-7 text-[#526079]">Choisissez votre langue de préparation. Vous pourrez la changer avant chaque entretien.</p>
                        <div className="mt-10 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Langue préférée">
                          {([{ value: "fr", title: "Français", subtitle: "Préparer mes entretiens en français" }, { value: "en", title: "English", subtitle: "Practice my interviews in English" }] as const).map((item) => {
                            const selected = profile.preferredLocale === item.value;
                            return <button key={item.value} type="button" role="radio" aria-checked={selected}
                              onClick={() => setProfile((p) => ({ ...p, preferredLocale: item.value }))}
                              className={cn("rounded-2xl border p-6 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2947A3]", selected ? "border-[#2947A3] bg-[#F3F6FE]" : "border-[#E0E6EF] hover:border-[#7590D1]")}>
                              <span className="flex items-center justify-between font-semibold text-[#172033]">{item.title}{selected && <Check size={19} className="text-[#2947A3]" aria-hidden="true" />}</span>
                              <span className="mt-2 block text-sm leading-6 text-[#526079]">{item.subtitle}</span>
                            </button>;
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-10 border-t border-[#E8EDF5] pt-6">
                {fieldError && <p role="alert" className="mb-4 text-sm text-[#B42318]">{fieldError}</p>}
                <div className="flex items-center justify-between gap-4">
                  <button type="button" onClick={() => { setFieldError(""); setStep((current) => Math.max(0, current - 1)); }}
                    disabled={step === 0} className="inline-flex min-h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-[#526079] transition hover:bg-[#F1F4F9] disabled:cursor-not-allowed disabled:opacity-30">
                    <ArrowLeft size={17} aria-hidden="true" /> Retour
                  </button>
                  <button type="button" onClick={next} disabled={!canProceed}
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#2947A3] px-6 text-sm font-semibold text-white transition hover:bg-[#1E3586] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2947A3] disabled:cursor-not-allowed disabled:opacity-50">
                    {step === steps.length - 1 ? "Terminer mon profil" : "Continuer"}
                    {step === steps.length - 1 ? <Check size={17} aria-hidden="true" /> : <ChevronRight size={17} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <motion.div initial={animated ? { opacity: 0, scale: 0.96 } : false} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-1 flex-col justify-center py-14">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#E9F5F0] text-[#19715B]"><Check size={30} aria-hidden="true" /></div>
              <p className="mt-9 text-xs font-semibold uppercase tracking-[0.16em] text-[#2947A3]">Votre espace est prêt</p>
              <h1 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-0.04em] text-[#172033] sm:text-[43px]">Bienvenue, {firstName}.</h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-[#526079]">Nous avons maintenant une meilleure idée de ce que vous souhaitez accomplir. Place à la pratique, à votre rythme.</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button type="button" onClick={() => router.push("/")}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#2947A3] px-6 text-sm font-semibold text-white hover:bg-[#1E3586]">
                  Découvrir mon espace <ArrowRight size={17} aria-hidden="true" />
                </button>
                <button type="button" onClick={restart} className="min-h-12 rounded-xl px-5 text-sm font-semibold text-[#526079] hover:bg-[#F1F4F9]">Modifier mes réponses</button>
              </div>
              <p className="mt-6 text-xs leading-6 text-[#78859B]">Aperçu UX : vos réponses ne sont pas encore enregistrées dans Supabase.</p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
