"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {CirclePlay,GraduationCap,LayoutDashboard,Sparkles,UserRound} from "lucide-react";
import type {ReactNode} from "react";

const nav=[
 {href:"/dashboard",label:"Vue d’ensemble",icon:LayoutDashboard},
 {href:"/preparation",label:"Simulation",icon:CirclePlay},
 {href:"/exercises",label:"Academy",icon:GraduationCap},
 {href:"/onboarding",label:"Mon profil",icon:UserRound},
];
export function AcademyShell({children}: {children:ReactNode}){
 const pathname=usePathname();
 return <main className="academy-ui relative min-h-dvh overflow-x-hidden bg-[#F8F9FF] text-[#172041]">
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden><div className="absolute -right-44 -top-48 h-[670px] w-[670px] rounded-full bg-[#EBCDF8]/55 blur-[110px]"/><div className="absolute -left-48 top-32 h-[680px] w-[680px] rounded-full bg-[#D7E5FF]/65 blur-[110px]"/></div>
  <div className="relative mx-auto flex min-h-screen max-w-[1720px]">
   <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-white/75 bg-white/65 px-5 py-7 backdrop-blur-2xl lg:flex">
    <Link href="/" className="flex items-center gap-2.5 px-2 text-[14px] font-extrabold tracking-tight"><span className="grid size-10 place-items-center rounded-[13px] bg-gradient-to-br from-[#5365FF] via-[#8755F4] to-[#E054C9] text-white"><Sparkles size={21}/></span><span>Interview<span className="block text-[10px] font-semibold tracking-[.15em] text-[#8B62E7]">LAB</span></span></Link>
    <p className="mb-3 mt-12 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#8593AF]">Espace candidat</p>
    <nav aria-label="Navigation candidat" className="space-y-1.5">{nav.map(item=>{const Icon=item.icon;const selected=item.href==="/exercises"?pathname.startsWith("/exercises"):pathname===item.href;return <Link key={item.href} href={item.href} aria-current={selected?"page":undefined} className={selected?"flex min-h-12 items-center gap-3 rounded-2xl bg-[#EDE7FF] px-3.5 text-sm font-bold text-[#784DD6]":"flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-[#62718D] transition hover:bg-[#F2ECFF] hover:text-[#784DD6]"}><Icon size={18}/>{item.label}</Link>})}</nav>
    <div className="mt-auto rounded-2xl border border-[#E9DCFF] bg-gradient-to-br from-[#F4EEFF] to-[#E9F7FF] p-4"><p className="text-xs font-bold text-[#7055B3]">Votre Academy</p><p className="mt-2 text-xs leading-6 text-[#695F83]">Un parcours et des exercices adaptés à votre progression.</p></div>
   </aside>
   <div className="min-w-0 flex-1">
    <header className="flex min-h-[78px] items-center justify-between gap-3 border-b border-white/80 bg-white/60 px-5 backdrop-blur-xl sm:px-8 lg:px-9"><span className="text-xs font-semibold text-[#70819F]">Espace candidat <span className="mx-2">/</span><span className="text-[#172033]">Academy</span></span><nav aria-label="Navigation Academy" className="flex items-center gap-2 rounded-2xl border border-[#DDD9F4] bg-[#F2F0FC] p-1.5 shadow-[inset_0_1px_3px_rgba(60,50,116,.08)]">{[{href:"/exercises",label:"Exercices",active:pathname==="/exercises"},{href:"/exercises/paths",label:"Parcours",active:pathname.startsWith("/exercises/paths")}].map(tab=><Link key={tab.href} href={tab.href} aria-current={tab.active?"page":undefined} className={tab.active?"inline-flex min-h-10 items-center justify-center rounded-xl border border-[#A99AEF] bg-gradient-to-r from-[#6658E8] to-[#8753DA] px-5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(102,72,203,.28)] transition-all duration-200":"inline-flex min-h-10 items-center justify-center rounded-xl border border-transparent bg-transparent px-5 text-sm font-semibold text-[#57618D] transition-all duration-200 hover:bg-white/85 hover:text-[#4935A2]"}>{tab.label}</Link>)}</nav></header>
    <div className="academy-content px-5 pb-16 pt-8 sm:px-8 lg:px-10">{children}</div>
   </div>
  </div>
 </main>;
}
