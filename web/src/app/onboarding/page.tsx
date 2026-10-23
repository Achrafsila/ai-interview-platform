"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { OnboardingStages, type OnboardingProfile } from "@/components/ui/onboarding-stages";

const previewKey = "ai-interview-preview-profile";
const subscribeNoop = () => () => {};

function readPreview(raw: string): Partial<OnboardingProfile> | undefined {
  try {
    if (!raw) return undefined;
    const p = JSON.parse(raw) as Partial<OnboardingProfile>;
    if (typeof p.firstName !== "string" || typeof p.lastName !== "string") return undefined;
    return p;
  } catch {
    return undefined;
  }
}

export default function OnboardingPage() {
  const stored = useSyncExternalStore(subscribeNoop, () => window.sessionStorage.getItem(previewKey), () => undefined);
  const initialProfile = stored === undefined ? null : stored ? (readPreview(stored) ?? {}) : {};

  function handleComplete(profile: OnboardingProfile) {
    // UX preview only. No Auth or Supabase persistence.
    console.info("Onboarding preview completed", {
      professionalGoal: profile.professionalGoal,
      preparationGoalsCount: profile.preparationGoals.length,
      preferredLocale: profile.preferredLocale,
    });
  }

  return (
    <main className="onboarding-atmosphere relative isolate min-h-screen overflow-hidden pb-14 text-[#172033]">
      <div className="atmosphere-orb atmosphere-orb-one" aria-hidden="true" />
      <div className="atmosphere-orb atmosphere-orb-two" aria-hidden="true" />
      <div className="atmosphere-orb atmosphere-orb-three" aria-hidden="true" />
      <nav className="relative z-10 mx-auto flex max-w-[1100px] items-center justify-between px-5 py-6 sm:px-6" aria-label="Navigation principale">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#172033]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B1222] text-white"><Sparkles size={18}/></span>
          Interview Platform
        </Link>
        <Link href={initialProfile?.firstName ? "/dashboard" : "/"} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#526079] hover:bg-[#E8EDF5]">
          <ArrowLeft size={16}/> {initialProfile?.firstName ? "Mon espace" : "Retour à l’accueil"}
        </Link>
      </nav>
      <div className="relative z-10 px-4 sm:px-6">
        {initialProfile === null ? <div className="mx-auto max-w-lg py-24 text-center text-[#526079]" role="status">On prépare votre parcours…</div>
          : <OnboardingStages onComplete={handleComplete} initialProfile={initialProfile} />}
      </div>
    </main>
  );
}
