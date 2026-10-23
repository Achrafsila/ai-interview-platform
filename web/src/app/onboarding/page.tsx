"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { OnboardingStages, type OnboardingProfile } from "@/components/ui/onboarding-stages";

export default function OnboardingPage() {
  function handleComplete(profile: OnboardingProfile) {
    // UX preview only — no real Supabase persistence at this stage.
    console.info("Onboarding preview completed", {
      professionalGoal: profile.professionalGoal,
      preparationGoalsCount: profile.preparationGoals.length,
      preferredLocale: profile.preferredLocale,
    });
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-14 text-[#172033]">
      <nav className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-6 sm:px-6" aria-label="Navigation principale">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#172033]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B1222] text-white"><Sparkles size={18}/></span>
          Interview Platform
        </Link>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#526079] hover:bg-[#E8EDF5]">
          <ArrowLeft size={16}/> Retour à l’accueil
        </Link>
      </nav>
      <div className="px-4 sm:px-6">
        <OnboardingStages onComplete={handleComplete} />
      </div>
    </main>
  );
}
