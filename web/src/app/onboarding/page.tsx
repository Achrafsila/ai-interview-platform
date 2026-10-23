"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { OnboardingStages, type OnboardingProfile } from "@/components/ui/onboarding-stages";
import { getAuthClient } from "@/lib/supabase-auth";
import { readProfile, writeProfile } from "@/lib/profile";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [initialProfile, setInitialProfile] = useState<Partial<OnboardingProfile> | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const supabase = getAuthClient();
      if (!supabase) { if (mounted) setError("Supabase n’est pas configuré."); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      try {
        const saved = await readProfile(supabase, user.id);
        if (mounted) setInitialProfile(saved?.profile ?? {});
      } catch { if (mounted) setError("Nous n’avons pas pu charger vos informations."); }
    }
    void load();
    return () => { mounted = false; };
  }, [router]);

  async function handleComplete(profile: OnboardingProfile) {
    const supabase = getAuthClient();
    if (!supabase) throw new Error("Client non configuré");
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) throw new Error("Session expirée");
    await writeProfile(supabase, user.id, profile);
  }

  return (
    <main className="onboarding-atmosphere relative isolate min-h-screen overflow-hidden pb-14 text-[#172033]">
      <div className="atmosphere-orb atmosphere-orb-one" aria-hidden="true" />
      <div className="atmosphere-orb atmosphere-orb-two" aria-hidden="true" />
      <div className="atmosphere-orb atmosphere-orb-three" aria-hidden="true" />
      <nav className="relative z-10 mx-auto flex max-w-[1100px] items-center justify-between px-5 py-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#172033]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B1222] text-white"><Sparkles size={18}/></span>
          Interview Platform
        </Link>
        <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#526079] hover:bg-[#E8EDF5]">
          <ArrowLeft size={16}/> Mon espace
        </Link>
      </nav>
      <div className="relative z-10 px-4 sm:px-6">
        {error ? <p role="alert" className="mx-auto max-w-xl rounded-2xl border border-[#DDE5F2] bg-white p-5 text-sm text-[#172033]">{error}</p> :
          initialProfile === null ? <div className="mx-auto max-w-lg py-24 text-center text-[#526079]" role="status">On prépare votre parcours…</div> :
          <OnboardingStages onComplete={handleComplete} initialProfile={initialProfile} />}
      </div>
    </main>
  );
}
