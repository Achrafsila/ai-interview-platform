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
const card = "rounded-[24px] border border-[#263759] bg-[#101D35]/85 shadow-[0_16px_45px_rgba(0,5,22,.18)] backdrop-blur-xl";

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
    <main className="relative min-h-screen overflow-hidden bg-[#070F20] text-[#F6F8FF] [color-scheme:dark]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_76%_0%,rgba(49,89,203,.21),transparent_80%),radial-gradient(ellipse_50%_45%_at_2%_82%,rgba(84,61,168,.11),transparent_78%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[246px] shrink-0 flex-col border-r border-[#24304A] bg-[#0A1428]/95 px-4 py-7 lg:flex">
          <Link href="/" className="flex items-center gap-3 px-3 text-base font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#446CE4] to-[#6553AD] shadow-[0_8px_24px_rgba(55,99,219,.3)]"><Sparkles size={19}/></span>
            <span>Interview<span className="block text-xs font-medium tracking-[.14em] text-[#91A8D8]">PLATFORM</span></span>
          </Link>
          <p className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#7789A8]">Espace candidat</p>
          <nav aria-label="Navigation candidat" className="mt-4 space-y-1.5">
            <Link href="/dashboard" aria-current="page" className="flex min-h-12 items-center gap-3 rounded-xl border border-[#456BD0]/30 bg-[#3157BD]/20 px-4 text-sm font-semibold text-[#DCE8FF]"><LayoutDashboard size={18}/> Vue d’ensemble</Link>
            <Link href="/preparation" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#A4B5D3] transition hover:bg-[#192C4B] hover:text-white"><CirclePlay size={18}/> Simulation</Link>
            <Link href="/onboarding" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-[#A4B5D3] transition hover:bg-[#192C4B] hover:text-white"><UserRound size={18}/> Mon profil</Link>
          </nav>
          <div className="mt-auto rounded-2xl border border-[#273C60] bg-[#111F38] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#BDD1FF]"><BrainCircuit size={16}/> Votre coach IA</div>
            <p className="text-xs leading-6 text-[#A9BBD6]">Votre premier conseil personnalisé arrivera après votre simulation.</p>
          </div>
          <button onClick={signOut} className="mt-5 flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm text-[#99ABC9] transition hover:bg-[#1A2945] hover:text-white"><LogOut size={17}/> Se déconnecter</button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-[82px] items-center justify-between gap-3 border-b border-[#22314F] px-5 sm:px-9 lg:px-12">
            <div className="flex items-center gap-3 text-sm font-semibold lg:hidden"><Sparkles className="text-[#91AAFF]" size={20}/> Interview Platform</div>
            <div className="hidden items-center gap-2 text-sm text-[#91A6C9] lg:flex"><LayoutDashboard size={15}/> Espace candidat <ChevronRight size={14}/> <span className="text-white">Vue d’ensemble</span></div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#294466] bg-[#142641] px-3 py-1.5 text-xs font-medium text-[#B8C9E8] sm:inline-flex"><span className="mr-2 h-2 w-2 rounded-full bg-[#67C8AF]"/> Espace personnel</span>
              <Link href="/onboarding" aria-label="Ouvrir mon profil" className="grid h-10 w-10 place-items-center rounded-full border border-[#46639F] bg-[#20375D] text-[#DCE8FF] transition hover:bg-[#2B4779]"><UserRound size={18}/></Link>
              <button onClick={signOut} aria-label="Se déconnecter" className="grid h-10 w-10 place-items-center rounded-full border border-[#354762] text-[#AABDDD] transition hover:bg-[#1B2A45] lg:hidden"><LogOut size={17}/></button>
            </div>
          </header>

          <div className="mx-auto max-w-[1230px] px-5 pb-20 pt-9 sm:px-9 lg:px-12 lg:pt-12">
            {loadError ? <div role="alert" className={card + " p-8"}>{loadError} <button onClick={() => window.location.reload()} className="ml-3 font-semibold text-[#9CB9FF] underline">Réessayer</button></div> :
              profile === undefined ? <div role="status" className="space-y-5 animate-pulse"><div className="h-10 w-2/3 rounded-xl bg-[#192846]"/><div className="h-56 rounded-3xl bg-[#172742]"/><div className="h-36 rounded-3xl bg-[#172742]"/></div> :
              profile === null ? <section className={card + " p-10"}><h1 className="text-3xl font-bold">Bienvenue dans votre espace</h1><p className="mt-4 text-[#ADBFDD]">Complétez votre profil pour personnaliser votre première simulation.</p><Link className="mt-8 inline-flex rounded-xl bg-[#5278ED] px-6 py-3 font-semibold text-white" href="/onboarding">Compléter mon profil <ArrowRight className="ml-2"/></Link></section> :
              <>
                <motion.section {...appear()} className="mb-8">
                  <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.17em] text-[#8BAAF5]"><span className="h-1.5 w-1.5 rounded-full bg-[#7AA6FF]"/> Votre espace de préparation</div>
                  <h1 className="text-[clamp(2rem,3.7vw,3.55rem)] font-bold leading-[1.1] tracking-[-.055em]">{profile.firstName ? `Bonjour, ${profile.firstName}.` : "Bienvenue."} <span className="block bg-gradient-to-r from-[#F5F8FF] via-[#B5C8FF] to-[#7FA3F8] bg-clip-text text-transparent">Votre prochain entretien commence ici.</span></h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A7B8D4] sm:text-base">Un espace pour vous entraîner, progresser et aborder chaque entretien avec plus de confiance.</p>
                </motion.section>

                <div className="grid gap-5 xl:grid-cols-[1.56fr_.84fr]">
                  <motion.section {...appear(.08)} className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[28px] border border-[#4767AC]/50 bg-[linear-gradient(135deg,#172B55_0%,#112343_52%,#1B2855_100%)] p-7 shadow-[0_25px_70px_rgba(4,12,39,.37)] sm:p-9">
                    <div aria-hidden className="pointer-events-none absolute -right-20 -top-32 h-[390px] w-[390px] rounded-full bg-[#496DE6]/25 blur-[72px] transition duration-700 group-hover:scale-125"/>
                    <div aria-hidden className="pointer-events-none absolute bottom-[-110px] right-[-40px] h-[260px] w-[260px] rounded-full border border-[#7290E8]/15 shadow-[0_0_0_38px_rgba(104,129,223,.04),0_0_0_80px_rgba(104,129,223,.03)]"/>
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#5672A8]/60 bg-[#304C83]/35 px-3 py-1.5 text-xs font-bold text-[#C7D9FF]"><Sparkles size={14}/> Votre première action</span>
                      <h2 className="mt-6 max-w-[520px] text-[clamp(1.9rem,3.1vw,2.8rem)] font-semibold leading-[1.14] tracking-[-.04em]">Passez de la théorie à la pratique.</h2>
                      <p className="mt-4 max-w-[470px] text-sm leading-7 text-[#B9CAE7]">Choisissez un entretien RH ou technique. Nous adapterons votre préparation à votre objectif et à vos priorités.</p>
                    </div>
                    <div className="relative z-10 mt-auto flex flex-wrap items-center gap-4 pt-9">
                      <Link href="/preparation" className="group/cta inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#E9F0FF] px-6 text-sm font-extrabold text-[#142754] shadow-[0_10px_30px_rgba(2,8,28,.22)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_35px_rgba(107,147,255,.30)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Préparer mon premier entretien <ArrowUpRight size={19} className="transition group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"/></Link>
                      <span className="text-xs text-[#A6B9DC]">À votre rythme · Sans pression</span>
                    </div>
                  </motion.section>

                  <motion.section {...appear(.15)} className={card + " flex flex-col p-7 sm:p-8"}>
                    <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.15em] text-[#91A6C8]">Votre objectif</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#213D72] text-[#A8C3FF]"><Target size={21}/></span></div>
                    <h2 className="mt-7 text-2xl font-semibold tracking-tight">{goalNames[profile.professionalGoal]}</h2>
                    <p className="mt-4 text-sm leading-7 text-[#A7B9D7]">Chaque séance sera adaptée à votre situation et aux compétences que vous souhaitez renforcer.</p>
                    {(situation || experience) && <div className="mt-6 flex flex-wrap gap-2">{situation && <span className="rounded-lg border border-[#324B70] bg-[#1B2E4C] px-3 py-2 text-xs text-[#BED0ED]">{situation}</span>}{experience && <span className="rounded-lg border border-[#324B70] bg-[#1B2E4C] px-3 py-2 text-xs text-[#BED0ED]">{experience}</span>}</div>}
                    <Link href="/onboarding" className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-semibold text-[#9EBBFF] transition hover:text-white">Ajuster mon profil <ChevronRight size={17}/></Link>
                  </motion.section>
                </div>

                <motion.section {...appear(.22)} aria-label="Tableau de bord de progression" className="mt-7">
                  <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold tracking-[-.02em]">Votre progression</h2><span className="text-xs text-[#8EA4C9]">Votre point de départ</span></div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Simulations réalisées", value: "0", detail: "Votre parcours commence ici", icon: MessageSquareText },
                      { label: "Score de préparation", value: "—", detail: "Disponible après votre 1er entretien", icon: Activity },
                      { label: "Évolution", value: "—", detail: "Suivez vos progrès au fil des séances", icon: TrendingUp },
                    ].map(({label,value,detail,icon:Icon}) => <div key={label} className={card + " group p-6 transition duration-300 hover:-translate-y-1 hover:border-[#4C69A5] hover:bg-[#152643]"}><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.08em] text-[#93A8CA]">{label}</span><Icon size={19} className="text-[#87AAFC]"/></div><div className="mt-6 text-[40px] font-bold leading-none tracking-[-.05em] text-white">{value}</div><p className="mt-3 text-xs leading-5 text-[#9DAFCF]">{detail}</p></div>)}
                  </div>
                </motion.section>

                <div className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
                  <motion.section {...appear(.29)} className={card + " p-7 sm:p-8"}>
                    <div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-3 text-lg font-semibold"><Target className="text-[#90AFFF]" size={21}/> Vos priorités</h2><Link href="/onboarding" className="text-xs font-semibold text-[#9DB9FA] hover:text-white">Modifier</Link></div>
                    <p className="mt-3 text-sm leading-6 text-[#A3B5D3]">Ces objectifs seront préremplis lors de votre simulation. Vous pourrez les ajuster pour chaque séance.</p>
                    <div className="mt-6 space-y-3">{profile.preparationGoals.map((key,index) => <div key={key} className="flex items-center gap-3 rounded-xl border border-[#293F62] bg-[#162A47]/70 px-4 py-3.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#2B4A80] text-xs font-bold text-[#C5D6FF]">{String(index+1).padStart(2,"0")}</span><span className="flex-1 text-sm font-medium text-[#E1EAFC]">{priorityNames[key]}</span><Check size={16} className="text-[#75C8B4]"/></div>)}</div>
                  </motion.section>
                  <motion.section {...appear(.36)} className={card + " flex flex-col p-7 sm:p-8"}>
                    <h2 className="flex items-center gap-3 text-lg font-semibold"><BrainCircuit className="text-[#9EAEFF]" size={22}/> Votre coach IA</h2>
                    <div className="mt-7 flex flex-1 flex-col justify-center rounded-2xl border border-dashed border-[#385078] bg-[#152743]/60 px-5 py-7">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#284273] text-[#B1C6FF]"><Compass size={22}/></span>
                      <h3 className="mt-5 text-lg font-semibold">Vos premiers conseils arrivent bientôt.</h3>
                      <p className="mt-3 text-sm leading-7 text-[#A8BAD7]">Après votre première simulation, votre coach pourra identifier vos points forts et vous proposer une prochaine action.</p>
                    </div>
                    <Link href="/preparation" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#A6BFFF] hover:text-white">Commencer ma préparation <ArrowRight size={17}/></Link>
                  </motion.section>
                </div>

                <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-[#253550] pt-6 text-xs leading-6 text-[#8FA3C4]"><span className="flex items-center gap-2"><BookOpen size={15}/> Aucun score fictif : votre suivi apparaîtra après la connexion des simulations.</span><span className="flex items-center gap-2"><GraduationCap size={15}/> Un espace qui évolue avec vous</span></div>
              </>}
          </div>
        </div>
      </div>
    </main>
  );
}
