"use client";
import { Timer } from "@ark-ui/react/timer";
import { Clock3 } from "lucide-react";

export function CountdownTimer({seconds=5,onComplete,variant="dark"}:{seconds?:number;onComplete:()=>void;variant?:"light"|"dark"}){
 return <div className="flex flex-col items-center gap-3" role="timer" aria-label="Compte à rebours avant l'entretien">
   <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] ${variant==="light"?"text-[#796CA5]":"text-[#B5C6EF]"}`}><Clock3 size={16}/> Démarrage dans</div>
   <Timer.Root key={seconds} countdown autoStart startMs={seconds*1000} onComplete={onComplete} className="flex flex-col items-center">
     <Timer.Area className={`flex items-center justify-center font-mono text-[clamp(6rem,20vw,11rem)] font-bold leading-none tracking-[-.07em] ${variant==="light"?"bg-gradient-to-br from-[#5667F6] to-[#BD52CE] bg-clip-text text-transparent":"text-white"}`}>
       <Timer.Item type="seconds" className="min-w-[2ch] text-center"/>
     </Timer.Area>
   </Timer.Root>
   <p className={`text-sm ${variant==="light"?"text-[#75819F]":"text-[#B7C7EA]"}`}>Installez-vous confortablement, l’intervieweur arrive.</p>
 </div>;
}
