"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ChevronDown,LogOut,Settings2,SlidersHorizontal,UserRound} from "lucide-react";
import {getAuthClient} from "@/lib/supabase-auth";

export function CandidateProfileMenu(){
 const [open,setOpen]=useState(false);
 const [busy,setBusy]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 const router=useRouter();
 useEffect(()=>{
  if(!open)return;
  const dismiss=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);};
  const escape=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false);};
  document.addEventListener("mousedown",dismiss);document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("mousedown",dismiss);document.removeEventListener("keydown",escape);};
 },[open]);
 async function signOut(){
  setBusy(true);
  try{const client=getAuthClient();if(!client)throw new Error("Service indisponible");const {error}=await client.auth.signOut();if(error)throw error;router.replace("/login");router.refresh();}
  catch{setBusy(false);setOpen(false);}
 }
 return <div ref={ref} className="relative shrink-0">
  <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Ouvrir le menu du profil" onClick={()=>setOpen(x=>!x)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D8D6F0] bg-white px-2 py-1.5 pr-3 text-[#4B5183] shadow-[0_3px_12px_rgba(62,51,123,.07)] transition hover:border-[#A99BEB] hover:bg-[#F8F5FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7962DF]">
   <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#6259E8] to-[#B267D4] text-white"><UserRound size={17}/></span><span className="hidden text-sm font-semibold sm:inline">Profil</span><ChevronDown size={14} className={open?"rotate-180 transition-transform":"transition-transform"}/>
  </button>
  {open&&<div role="menu" aria-label="Compte candidat" className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[242px] rounded-2xl border border-[#DDD9F0] bg-white p-2 shadow-[0_18px_52px_rgba(34,33,76,.17)]">
   <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#8590AD]">Mon compte</p>
   <Link role="menuitem" href="/onboarding" onClick={()=>setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#3F4B71] transition hover:bg-[#F0ECFF]"><UserRound size={18} className="text-[#775ACA]"/> Mon profil</Link>
   <Link role="menuitem" href="/onboarding" onClick={()=>setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#3F4B71] transition hover:bg-[#F0ECFF]"><SlidersHorizontal size={18} className="text-[#775ACA]"/> Mes préférences</Link>
   <Link role="menuitem" href="/account/settings" onClick={()=>setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#3F4B71] transition hover:bg-[#F0ECFF]"><Settings2 size={18} className="text-[#775ACA]"/> Paramètres du compte</Link>
   <div className="my-2 border-t border-[#E8E7F2]"/>
   <button role="menuitem" type="button" disabled={busy} onClick={()=>void signOut()} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#A44562] transition hover:bg-[#FFF0F4] disabled:opacity-50"><LogOut size={18}/>{busy?"Déconnexion…":"Se déconnecter"}</button>
  </div>}
 </div>;
}
