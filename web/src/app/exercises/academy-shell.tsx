"use client";
import {CandidateSidebar} from "@/components/ui/candidate-sidebar";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {CandidateProfileMenu} from "@/components/ui/candidate-profile-menu";
import type {ReactNode} from "react";

export function AcademyShell({children}: {children:ReactNode}){
 const pathname=usePathname();
 return <main className="academy-ui relative min-h-dvh overflow-x-hidden bg-[#F8F9FF] text-[#172041]">
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden><div className="absolute -right-44 -top-48 h-[670px] w-[670px] rounded-full bg-[#EBCDF8]/55 blur-[110px]"/><div className="absolute -left-48 top-32 h-[680px] w-[680px] rounded-full bg-[#D7E5FF]/65 blur-[110px]"/></div>
  <div className="relative mx-auto flex min-h-screen max-w-[1720px]">
   <CandidateSidebar/>
   <div className="min-w-0 flex-1">
    <header className="flex min-h-[72px] items-center justify-between gap-3 border-b border-white/80 bg-white/60 px-5 backdrop-blur-xl sm:px-8 lg:px-9"><span className="text-xs font-semibold text-[#70819F]">Espace candidat <span className="mx-2">/</span><span className="text-[#172033]">Academy</span></span><div className="flex items-center gap-3"><nav aria-label="Navigation Academy" className="flex items-center gap-1 rounded-2xl border border-[#DDD9F4] bg-[#F2F0FC] p-1.5 shadow-[inset_0_1px_3px_rgba(60,50,116,.08)]">{[{href:"/exercises",label:"Exercices",active:pathname==="/exercises"},{href:"/exercises/paths",label:"Parcours",active:pathname.startsWith("/exercises/paths")}].map(tab=><Link key={tab.href} href={tab.href} aria-current={tab.active?"page":undefined} className={tab.active?"inline-flex min-h-10 items-center justify-center rounded-xl border border-[#A99AEF] bg-gradient-to-r from-[#6658E8] to-[#8753DA] px-4 text-sm font-bold text-white shadow-[0_5px_14px_rgba(102,72,203,.28)] transition-all duration-200":"inline-flex min-h-10 items-center justify-center rounded-xl border border-transparent bg-transparent px-4 text-sm font-semibold text-[#57618D] transition-all duration-200 hover:bg-white/85 hover:text-[#4935A2]"}>{tab.label}</Link>)}</nav><CandidateProfileMenu/></div></header>
    <div className="academy-content px-5 pb-12 pt-7 sm:px-7 lg:px-9">{children}</div>
   </div>
  </div>
 </main>;
}
