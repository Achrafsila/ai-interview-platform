"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {BrainCircuit,CirclePlay,GraduationCap,LayoutDashboard,Sparkles,UserRound} from "lucide-react";

const items=[
 {href:"/dashboard",label:"Vue d’ensemble",icon:LayoutDashboard},
 {href:"/preparation",label:"Simulation",icon:CirclePlay},
 {href:"/exercises",label:"Academy",icon:GraduationCap},
 {href:"/onboarding",label:"Mon profil",icon:UserRound},
];
export function CandidateSidebar(){
 const pathname=usePathname();
 return <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-white/75 bg-white/65 px-5 py-7 backdrop-blur-2xl lg:flex">
  <Link href="/" className="flex items-center gap-2.5 px-2 text-[14px] font-extrabold tracking-tight"><span className="grid size-10 place-items-center rounded-[13px] bg-gradient-to-br from-[#5365FF] via-[#8755F4] to-[#E054C9] text-white"><Sparkles size={21}/></span><span>Interview<span className="block text-[10px] font-semibold tracking-[.15em] text-[#8B62E7]">LAB</span></span></Link>
  <p className="mb-3 mt-12 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#8593AF]">Espace candidat</p>
  <nav aria-label="Navigation candidat" className="space-y-1.5">
   {items.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/")||(item.href==="/preparation"&&pathname.startsWith("/interview"));return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={active?"flex min-h-12 items-center gap-3 rounded-2xl bg-[#EDE7FF] px-3.5 text-sm font-bold text-[#784DD6]":"flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-[#62718D] transition hover:bg-[#F2ECFF] hover:text-[#784DD6]"}><Icon size={18}/>{item.label}</Link>})}
  </nav>
  <div className="mt-auto rounded-2xl border border-[#E9DCFF] bg-gradient-to-br from-[#F4EEFF] to-[#E9F7FF] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#7055B3]"><BrainCircuit size={17}/> Coach IA</div><p className="mt-2 text-xs leading-6 text-[#695F83]">Des conseils personnalisés pour progresser à votre rythme.</p></div>
 </aside>;
}
