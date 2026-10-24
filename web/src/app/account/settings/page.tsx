"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {ArrowLeft,Mail,ShieldCheck,SlidersHorizontal,UserRound} from "lucide-react";
import {CandidateProfileMenu} from "@/components/ui/candidate-profile-menu";
import {getAuthClient} from "@/lib/supabase-auth";

export default function AccountSettings(){
 const [email,setEmail]=useState<string|null>(null);
 useEffect(()=>{let live=true;(async()=>{const client=getAuthClient();const {data}=await client?.auth.getUser()??{data:{user:null}};if(live)setEmail(data.user?.email||null);})();return()=>{live=false};},[]);
 return <main className="min-h-dvh bg-[#F8F9FF] text-[#172041]">
  <header className="flex min-h-[72px] items-center justify-between border-b border-[#E7E6F2] bg-white/80 px-5 sm:px-9"><Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#5F57A8]"><ArrowLeft size={18}/> Espace candidat</Link><CandidateProfileMenu/></header>
  <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
   <p className="text-xs font-bold uppercase tracking-[.14em] text-[#7554C7]">Votre compte</p><h1 className="mt-3 text-3xl font-bold">Paramètres du compte</h1><p className="mt-3 text-sm leading-7 text-[#657491]">Retrouvez vos informations de connexion et vos préférences de préparation.</p>
   <section className="mt-8 rounded-3xl border border-[#E0DFF0] bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 font-bold"><Mail size={19} className="text-[#7A62D2]"/> Adresse de connexion</h2><p className="mt-3 break-all text-sm text-[#556481]">{email||"Chargement ou session indisponible"}</p><p className="mt-3 flex items-center gap-2 text-xs text-[#72819B]"><ShieldCheck size={16}/> Authentification protégée par Supabase.</p></section>
   <section className="mt-4 grid gap-4 sm:grid-cols-2"><Link href="/onboarding" className="rounded-2xl border border-[#E0DFF0] bg-white p-5 transition hover:bg-[#F5F1FF]"><UserRound className="text-[#7A62D2]"/><h2 className="mt-3 font-semibold">Mon profil</h2><p className="mt-2 text-sm text-[#657491]">Consulter les informations de votre parcours.</p></Link><Link href="/onboarding" className="rounded-2xl border border-[#E0DFF0] bg-white p-5 transition hover:bg-[#F5F1FF]"><SlidersHorizontal className="text-[#7A62D2]"/><h2 className="mt-3 font-semibold">Mes préférences</h2><p className="mt-2 text-sm text-[#657491]">Retrouver vos objectifs et préférences de préparation.</p></Link></section>
   <p className="mt-6 text-xs leading-6 text-[#7E8AA5]">La modification de l’adresse email, du mot de passe et la gestion des photos de profil seront ajoutées ultérieurement.</p>
  </div>
 </main>;
}
