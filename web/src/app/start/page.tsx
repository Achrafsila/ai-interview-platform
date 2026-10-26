"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Mic2, Sparkles, Target, LayoutDashboard } from "lucide-react";
import { getAuthClient } from "@/lib/supabase-auth";
import { getAppRole, readProfile } from "@/lib/profile";
import { professionalOptions, type OnboardingProfile } from "@/components/ui/onboarding-stages";

export default function StartPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const client = getAuthClient();
        if (!client) throw new Error("Supabase indisponible");
        const { data: { user } } = await client.auth.getUser();
        if (!user) { router.replace("/login"); return; }
        const role = await getAppRole(client, user.id);
        if (role !== "user") { router.replace("/role-preview"); return; }
        const saved = await readProfile(client, user.id);
        if (!saved?.completed) { router.replace("/onboarding"); return; }
        if (active) setProfile(saved.profile);
      } catch {
        if (active) setError("Nous ne pouvons pas charger votre parcours pour le moment.");
      }
    }
    void load();
    return () => { active = false; };
  }, [router]);

  const objective = professionalOptions.find(option => option.value === profile?.professionalGoal)?.title;
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#0B1430] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-52 -top-48 h-[650px] w-[650px] rounded-full bg-[#4F63E8]/20 blur-[110px]" />
        <div className="absolute -right-52 top-1/4 h-[700px] w-[700px] rounded-full bg-[#AE45CF]/15 blur-[110px]" />
      </div>
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-3 font-extrabold tracking-tight"><span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#5268FF] to-[#C34BCB]"><Sparkles size={19}/></span>InterviewLab</Link>
        <span className="text-xs font-semibold uppercase tracking-[.16em] text-[#A4B1D9]">Votre espace de préparation</span>
      </header>
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8 px-6 py-14 sm:px-10 lg:grid lg:grid-cols-[1.13fr_.87fr] lg:items-center lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#6877C3]/35 bg-[#263566]/45 px-4 py-2 text-xs font-semibold text-[#B9C5FF]"><Sparkles size={15}/> Un parcours conçu pour vous</span>
          <h1 className="mt-7 max-w-2xl text-[clamp(2.5rem,5vw,4.6rem)] font-extrabold leading-[1.1] tracking-[-.055em]">{profile ? `Bienvenue ${profile.firstName}.` : "Bienvenue."}<br/><span className="bg-gradient-to-r from-[#A7B7FF] to-[#F09EEB] bg-clip-text text-transparent">Passons à la pratique.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#BBC7E4]">Votre profil est prêt. Nous allons maintenant préparer un entretien adapté à votre objectif, puis vous accompagner avec des retours concrets.</p>
          <div className="mt-8 space-y-3 text-sm text-[#D9E1F5]">
            <p className="flex items-start gap-3"><Check className="mt-0.5 shrink-0 text-[#91E3D1]" size={18}/> Pas besoin de CV pour commencer.</p>
            <p className="flex items-start gap-3"><Check className="mt-0.5 shrink-0 text-[#91E3D1]" size={18}/> Vous choisissez votre entretien et vos priorités.</p>
            <p className="flex items-start gap-3"><Check className="mt-0.5 shrink-0 text-[#91E3D1]" size={18}/> À la fin, un bilan vous aide à progresser.</p>
          </div>
        </div>
        <div className="rounded-[30px] border border-[#6174B6]/30 bg-[#202B53]/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,.24)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-[#5868E7]/25 text-[#AEBBFF]"><Target size={23}/></span><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#A8B6DB]">Votre objectif</p><p className="mt-1 font-semibold">{objective ?? "Votre préparation"}</p></div></div>
          <div className="my-6 h-px bg-[#65749F]/25"/>
          <div className="mb-6 flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#8258DA]/25 text-[#D3BDFF]"><Mic2 size={23}/></span><div><h2 className="text-xl font-bold tracking-tight">Votre premier entretien</h2><p className="mt-2 text-sm leading-6 text-[#BDCAE5]">Choisissez un entretien RH ou technique, le poste préparé et votre rythme. Votre séance démarre uniquement après confirmation.</p></div></div>
          <Link href="/preparation" className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#5968F7] to-[#B34BD4] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(89,104,247,.22)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Préparer mon entretien <ArrowRight size={19}/></Link>
          <Link href="/dashboard" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[#BAC8EB] transition hover:text-white"><LayoutDashboard size={17}/> Accéder à mon espace</Link>
        </div>
      </section>
      <footer className="relative z-10 py-6 text-center text-xs text-[#8594BA]">Votre séance est un entraînement, pas une décision de recrutement.</footer>
      {!profile && <div role={error ? "alert" : "status"} className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B1430]/95 px-5 text-center text-[#D9E3FF]">{error || "Nous préparons votre expérience…"}</div>}
    </main>
  );
}
