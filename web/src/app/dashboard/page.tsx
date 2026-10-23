"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Activity, ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, Check, ChevronRight, CirclePlay, Compass, GraduationCap, LayoutDashboard, LogOut, MessageSquareText, Sparkles, Target, TrendingUp, UserRound } from "lucide-react";
import { getAuthClient } from "@/lib/supabase-auth";
import { getAppRole, readProfile } from "@/lib/profile";
import { employmentOptions, experienceOptions, professionalOptions, type OnboardingProfile, type ProfessionalGoal, type PreparationGoal } from "@/components/ui/onboarding-stages";

const goalNames: Record<ProfessionalGoal, string> = Object.fromEntries(professionalOptions.map((item) => [item.value, item.title])) as Record<ProfessionalGoal, string>;
const priorityNames: Record<PreparationGoal, string> = {
  confidence: "Confiance en soi",
  answer_structure: "Structure des réponses",
  communication: "Communication",
  domain_knowledge: "Connaissances métier",
  stress_management: "Gestion du stress",
};
const card = "rounded-[24px] border border-[#CDD8F1] bg-white/75 shadow-[0_16px_45px_rgba(77,102,153,.08)] backdrop-blur-xl";

export default function DashboardPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [profile, setProfile] = useState<OnboardingProfile | null | undefined>(undefined);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const client = getAuthClient();
        if (!client) throw new Error("Supabase n’est pas configuré.");
        const { data: { user }, error } = await client.auth.getUser();
        if (error) throw error;
        if (!user) { router.replace("/login"); return; }
        const role = await getAppRole(client, user.id);
        if (role !== "user") { router.replace("/role-preview"); return; }
        const saved = await readProfile(client, user.id);
        if (!saved?.completed) { router.replace("/onboarding"); return; }
        if (active) setProfile(saved.profile);
      } catch {
        if (active) setLoadError("Impossible de charger votre espace. Veuillez réessayer.");
      }
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function signOut() {
    const client = getAuthClient();
    await client?.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const appear = (delay = 0) => ({
    initial: reducedMotion ? false as const : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: .52, delay, ease: "easeOut" as const },
  });
  const situation = profile?.employmentStatus ? employmentOptions.find((x) => x.value === profile.employmentStatus)?.title : null;
  const experience = profile?.experienceLevel ? experienceOptions.find((x) => x.value === profile.experienceLevel)?.title : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EDF3FE] text-[#172033] [color-scheme:light]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_56%_70%_at_92%_10%,rgba(156,174,246,.32),transparent_75%),radial-gradient(ellipse_65%_75%_at_5%_90%,rgba(189,211,254,.33),transparent_72%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[246px] shrink-0 flex-col border-r border-[#BFCEEA] bg-[#F8FAFF]/80 px-4 py-7 lg:flex">
          <Link href="/" className="flex items-center gap-3 px-3 text-base font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E1E9FF] shadow-[0_8px_24px_rgba(55,99,219,.3)]"><Sparkles size={19}/></span>
            <span>Interview<span className="block text-xs font-medium tracking-[.14em] text-[#4B64A7]">PLATFORM</span></span>
          </Link>
          <p className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#52678C]">Espace candidat</p>
          <nav aria-label="Navigation candidat" className="mt-4 space-y-1.5">
            <Link href="/dashboard" aria-current="page" className="flex min-h-12 items-center gap-3 rounded-xl border border-[#8C9FEE] bg-[#E4EAFE] px-4 text-sm font-semibold text-[#2947A3]"><LayoutDashboard size={18}/> Vue d’ensemble</Link>
            <Link href="/preparation" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#52678C] transition hover:bg-white/75 hover:text-[#2947A3]"><CirclePlay size={18}/> Simulation</Link>
            <Link href="/onboarding" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#52678C] transition hover:bg-white/75 hover:text-[#2947A3]"><UserRound size={18}/> Mon profil</Link>
          </nav>
          <div className="mt-auto rounded-2xl border border-[#CFC6FA] bg-[#F0EBFF] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#6550AD]"><BrainCircuit size={16}/> Votre coach IA</div>
            <p className="text-xs leading-6 text-[#465F84]">Votre premier conseil personnalisé arrivera après votre simulation.</p>
          </div>
          <button onClick={signOut} className="mt-5 flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm text-[#52678C] transition hover:bg-[#E1E9FA] hover:text-[#2947A3]"><LogOut size={17}/> Se déconnecter</button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-[82px] items-center justify-between gap-3 border-b border-[#B9C8E6] px-5 sm:px-9 lg:px-12">
            <div className="flex items-center gap-3 text-sm font-semibold lg:hidden"><Sparkles className="text-[#3656A1]" size={20}/> Interview Platform</div>
            <div className="hidden items-center gap-2 text-sm text-[#52678C] lg:flex"><LayoutDashboard size={15}/> Espace candidat <ChevronRight size={14}/> <span className="text-[#172033]">Vue d’ensemble</span></div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#B7C9EA] bg-white/60 px-3 py-1.5 text-xs font-medium text-[#52678C] sm:inline-flex"><span className="mr-2 h-2 w-2 rounded-full bg-[#67C8AF]"/> Espace personnel</span>
              <Link href="/onboarding" aria-label="Ouvrir mon profil" className="grid h-10 w-10 place-items-center rounded-full border border-[#B9CAEC] bg-[#DFE8FA] text-[#2947A3] transition hover:bg-white"><UserRound size={18}/></Link>
              <button onClick={signOut} aria-label="Se déconnecter" className="grid h-10 w-10 place-items-center rounded-full border border-[#B9C9E6] text-[#52678C] transition hover:bg-white lg:hidden"><LogOut size={17}/></button>
            </div>
          </header>

          <div className="w-full px-5 pb-20 pt-9 sm:px-9 lg:px-10 lg:pt-12">
            {loadError ? <div role="alert" className={card + " p-8"}>{loadError} <button onClick={() => window.location.reload()} className="ml-3 font-semibold text-[#9CB9FF] underline">Réessayer</button></div> :
              profile === undefined ? <div role="status" className="space-y-5 animate-pulse"><div className="h-10 w-2/3 rounded-xl bg-[#DCE6F6]"/><div className="h-56 rounded-3xl bg-[#DCE6F6]"/><div className="h-36 rounded-3xl bg-[#DCE6F6]"/></div> :
              profile === null ? <section className={card + " p-10"}><h1 className="text-3xl font-bold">Bienvenue dans votre espace</h1><p className="mt-4 text-[#526688]">Complétez votre profil pour personnaliser votre première simulation.</p><Link className="mt-8 inline-flex rounded-xl bg-[#5278ED] px-6 py-3 font-semibold text-white" href="/onboarding">Compléter mon profil <ArrowRight className="ml-2"/></Link></section> :
              <>
                <motion.section {...appear()} className="mb-8">
                  <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.17em] text-[#3656A1]"><span className="h-1.5 w-1.5 rounded-full bg-[#7AA6FF]"/> Votre espace de préparation</div>
                  <h1 className="text-[clamp(2rem,3.7vw,3.55rem)] font-bold leading-[1.1] tracking-[-.055em]">{profile.firstName ? `Bonjour, ${profile.firstName}.` : "Bienvenue."} <span className="block bg-gradient-to-r from-[#172033] via-[#2947A3] to-[#637CDF] bg-clip-text text-transparent">Votre prochain entretien commence ici.</span></h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#405574] sm:text-base">Un espace pour vous entraîner, progresser et aborder chaque entretien avec plus de confiance.</p>
                </motion.section>

                <div className="grid gap-5 xl:grid-cols-[1.56fr_.84fr]">
                  <motion.section {...appear(.08)} className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[28px] border border-[#BBC8F7] bg-[linear-gradient(132deg,#EDF1FF_0%,#E2E8FF_58%,#EDE6FF_100%)] p-7 shadow-[0_18px_55px_rgba(76,100,155,.14)] sm:p-9">
                    <div aria-hidden className="pointer-events-none absolute -right-20 -top-32 h-[390px] w-[390px] rounded-full bg-[#8C79EE]/25 blur-[72px] transition duration-700 group-hover:scale-125"/>
                    <div aria-hidden className="pointer-events-none absolute bottom-[-110px] right-[-40px] h-[260px] w-[260px] rounded-full border border-[#7290E8]/15 shadow-[0_0_0_38px_rgba(104,129,223,.04),0_0_0_80px_rgba(104,129,223,.03)]"/>
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#B1C5EE] bg-white/55 px-3 py-1.5 text-xs font-bold text-[#3656A1]"><Sparkles size={14}/> Votre première action</span>
                      <h2 className="mt-6 max-w-[520px] text-[clamp(1.9rem,3.1vw,2.8rem)] font-semibold leading-[1.14] tracking-[-.04em]">Passez de la théorie à la pratique.</h2>
                      <p className="mt-4 max-w-[470px] text-sm leading-7 text-[#465A7C]">Choisissez un entretien RH ou technique. Nous adapterons votre préparation à votre objectif et à vos priorités.</p>
                    </div>
                    <div className="relative z-10 mt-auto flex flex-wrap items-center gap-4 pt-9">
                      <Link href="/preparation" className="group/cta inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#2947A3] px-6 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(2,8,28,.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#3D5AC3] hover:shadow-[0_16px_35px_rgba(107,147,255,.30)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Préparer mon premier entretien <ArrowUpRight size={19} className="transition group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"/></Link>
                      <span className="rounded-full bg-white/65 px-3 py-2 text-xs font-medium text-[#566C95]">À votre rythme · Sans pression</span>
                    </div>
                  </motion.section>

                  <motion.section {...appear(.15)} className="flex flex-col rounded-[24px] border border-[#C8BEF3] bg-[#F4F0FF]/85 p-7 shadow-[0_16px_45px_rgba(110,90,170,.07)] sm:p-8">
                    <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.15em] text-[#52678C]">Votre objectif</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#E1D9FF] text-[#7254CA]"><Target size={21}/></span></div>
                    <h2 className="mt-7 text-2xl font-semibold tracking-tight">{goalNames[profile.professionalGoal]}</h2>
                    <p className="mt-4 text-sm leading-7 text-[#526688]">Chaque séance sera adaptée à votre situation et aux compétences que vous souhaitez renforcer.</p>
                    {(situation || experience) && <div className="mt-6 flex flex-wrap gap-2">{situation && <span className="rounded-lg border border-[#B6C7E9] bg-white/75 px-3 py-2 text-xs text-[#526688]">{situation}</span>}{experience && <span className="rounded-lg border border-[#B6C7E9] bg-white/75 px-3 py-2 text-xs text-[#526688]">{experience}</span>}</div>}
                    <p className="mt-auto pt-6 text-xs leading-6 text-[#52678C]">Objectif enregistré dans votre profil candidat.</p>
                  </motion.section>
                </div>

                <motion.section {...appear(.22)} aria-label="Tableau de bord de progression" className="mt-7">
                  <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold tracking-[-.02em]">Votre progression</h2><span className="text-xs text-[#52678C]">Votre point de départ</span></div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Simulations réalisées", value: "0", detail: "Votre parcours commence ici", icon: MessageSquareText, tone: "blue" },
                      { label: "Score de préparation", value: "—", detail: "Disponible après votre 1er entretien", icon: Activity, tone: "mint" },
                      { label: "Évolution", value: "—", detail: "Suivez vos progrès au fil des séances", icon: TrendingUp, tone: "amber" },
                    ].map(({label,value,detail,icon:Icon,tone}) => <div key={label} className={`group rounded-[24px] border p-6 shadow-[0_12px_30px_rgba(65,85,140,.06)] transition duration-300 hover:-translate-y-1 ${tone === "mint" ? "border-[#A8DFD2] bg-[#E8F9F3] hover:bg-[#DBF5EB]" : tone === "amber" ? "border-[#F2D5A4] bg-[#FFF5E5] hover:bg-[#FCEFD9]" : "border-[#B8C9F7] bg-[#EDF2FF] hover:bg-[#E5EDFF]"}`}><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.08em] text-[#52678C]">{label}</span><span className={`grid h-10 w-10 place-items-center rounded-2xl ${tone === "mint" ? "bg-[#C9EEE1] text-[#197F68]" : tone === "amber" ? "bg-[#FBE4BF] text-[#A56C17]" : "bg-[#DBE4FF] text-[#3456D7]"}`}><Icon size={20}/></span></div><div className="mt-6 text-[40px] font-bold leading-none tracking-[-.05em] text-[#172033]">{value}</div><p className="mt-3 text-xs leading-5 text-[#52678C]">{detail}</p></div>)}
                  </div>
                </motion.section>

                <div className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
                  <motion.section {...appear(.29)} className="rounded-[24px] border border-[#B7DFD5] bg-[#F2FCF8]/85 p-7 shadow-[0_16px_45px_rgba(77,153,129,.06)] sm:p-8">
                    <div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-3 text-lg font-semibold"><Target className="text-[#21866F]" size={21}/> Vos priorités</h2><span className="text-xs font-medium text-[#52678C]">Préférences enregistrées</span></div>
                    <p className="mt-3 text-sm leading-6 text-[#526688]">Ces objectifs seront préremplis lors de votre simulation. Vous pourrez les ajuster pour chaque séance.</p>
                    <div className="mt-6 space-y-3">{profile.preparationGoals.map((key,index) => <div key={key} className="flex items-center gap-3 rounded-xl border border-[#C6E6DD] bg-white/70 px-4 py-3.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#D9F4EA] text-xs font-bold text-[#21866F]">{String(index+1).padStart(2,"0")}</span><span className="flex-1 text-sm font-medium text-[#172033]">{priorityNames[key]}</span><Check size={16} className="text-[#269D81]"/></div>)}</div>
                  </motion.section>
                  <motion.section {...appear(.36)} className="flex flex-col rounded-[24px] border border-[#D5C9FA] bg-[#F6F2FF]/90 p-7 shadow-[0_16px_45px_rgba(124,94,176,.07)] sm:p-8">
                    <h2 className="flex items-center gap-3 text-lg font-semibold"><BrainCircuit className="text-[#7254CA]" size={22}/> Votre coach IA</h2>
                    <div className="mt-7 flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-[#CEC0F7] bg-white/60 px-5 py-7">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#E4DBFF] text-[#7254CA]"><Compass size={22}/></span>
                      <h3 className="mt-5 text-lg font-semibold">Vos premiers conseils arrivent bientôt.</h3>
                      <p className="mt-3 text-sm leading-7 text-[#526688]">Après votre première simulation, votre coach pourra identifier vos points forts et vous proposer une prochaine action.</p>
                    </div>
                    <p className="mt-6 text-xs leading-6 text-[#52678C]">Votre analyse sera disponible dans cet espace.</p>
                  </motion.section>
                </div>

                <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-[#B9C8E6] pt-6 text-xs leading-6 text-[#52678C]"><span className="flex items-center gap-2"><BookOpen size={15}/> Aucun score fictif : votre suivi apparaîtra après la connexion des simulations.</span><span className="flex items-center gap-2"><GraduationCap size={15}/> Un espace qui évolue avec vous</span></div>
              </>}
          </div>
        </div>
      </div>
    </main>
  );
}
