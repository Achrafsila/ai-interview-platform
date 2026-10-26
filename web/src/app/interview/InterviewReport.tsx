"use client";

import Link from "next/link";
import { RoleplayDebrief } from "./RoleplayDebrief";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Dumbbell, Lightbulb, RotateCcw, Sparkles, Target } from "lucide-react";

type ReportSection = { title: string; body: string };
const strip = (value: string) => value.replace(/\*\*(.*?)\*\*/g, "$1").replace(/__(.*?)__/g, "$1").replace(/^\s*[-*•]\s+/gm, "").replace(/^#{1,6}\s+/gm, "").trim();

function parseFeedback(raw: string) {
 const content = raw.replace(/\r/g, "").trim();
 const rows = content.split("\n");
 const sections: ReportSection[] = [];
 let title = "Synthèse";
 let body: string[] = [];
 function flush() { const clean = strip(body.join("\n")).trim(); if (clean) sections.push({ title, body: clean }); body = []; }
 for (const row of rows) {
  const line = row.trim();
  const heading = line.match(/^(?:#{1,5}\s*)?(?:\*\*)?((?:bilan bref|synthèse(?: globale)?|résumé(?: global)?|point(?:s)? fort(?:s)?(?: observable(?:s)?)?|axe(?:s)? d.amélioration(?: prioritaire)?|point(?:s)? à améliorer|conseil(?: concret)?|recommandation(?:s)?|prochaine étape|exercice recommandé|qualité perçue)[^:*.]*)(?:\*\*)?\s*:?\s*(.*)$/i);
  if (heading) { flush(); title = strip(heading[1]); if (heading[2]) body.push(heading[2]); }
  else body.push(row);
 }
 flush();
 const find = (pattern: RegExp) => sections.find(section => pattern.test(section.title));
 return { summary: find(/synthèse|bilan|résumé/i)?.body || sections[0]?.body || "Votre séance est terminée.", strength: find(/point.*fort/i)?.body, improvement: find(/amélior|à améliorer/i)?.body, advice: find(/conseil|recommandation|exercice|prochaine étape/i)?.body, extras: sections.filter(section => !/synthèse|bilan|résumé|point.*fort|amélior|à améliorer|conseil|recommandation|exercice|prochaine étape/i.test(section.title)) };
}

function recommendedFocus(improvement?: string) {
 const value = (improvement || "").toLocaleLowerCase("fr");
 if (/structur|star|organis|fil conducteur/.test(value)) return { name: "Structurer vos réponses", detail: "Travaillez le contexte, votre rôle, les actions réalisées et le résultat avec la méthode STAR." };
 if (/élocution|oral|communication|fluidit|hésit|clarté|expression/.test(value)) return { name: "Gagner en aisance à l’oral", detail: "Entraînez-vous à exprimer une idée principale, puis à l’illustrer sans précipitation." };
 if (/chiffr|impact|résultat|mesur|exemple|concret/.test(value)) return { name: "Renforcer vos exemples", detail: "Préparez une réalisation précise et expliquez votre contribution et son impact." };
 if (/techni|métier|connaissance|compétence/.test(value)) return { name: "Approfondir votre argumentation", detail: "Préparez un exemple qui relie vos compétences aux attentes du poste." };
 return { name: "Consolider votre préparation", detail: "Reprenez la priorité identifiée dans votre bilan lors de votre prochaine simulation." };
}

export function InterviewReport({ feedback, jobTitle, family, elapsed, interrupted = false, transcript }: { feedback?: string; jobTitle?: string; family?: "rh" | "technical"; elapsed: number; interrupted?: boolean; transcript?: {question:string;answer:string}[] }) {
 const data = parseFeedback(feedback || "Aucun retour pédagogique disponible pour cette séance.");
 const focus = recommendedFocus(data.improvement);
 const duration = `${Math.floor(elapsed / 60)} min ${String(elapsed % 60).padStart(2, "0")} s`;
 const academyHref = `/exercises?source=interview&focus=${encodeURIComponent(focus.name)}&job=${encodeURIComponent((jobTitle||"").slice(0,120))}`;
 const retryHref = `/preparation?source=interview&job=${encodeURIComponent((jobTitle||"").slice(0,120))}&family=${family||"rh"}`;
 return <main className="report-v2 relative min-h-dvh overflow-hidden bg-[#0A1028] px-4 pb-16 pt-8 text-white sm:px-8 sm:pt-12">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_8%,#2D3C82_0%,#17204B_34%,#0A1028_74%)]" />
  <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-12 size-96 rounded-full bg-[#A453FA]/15 blur-[100px]" />
  <div aria-hidden="true" className="pointer-events-none absolute -left-36 top-80 size-96 rounded-full bg-[#32CCC8]/10 blur-[100px]" />
  <div className="relative mx-auto max-w-5xl">
   <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/dashboard" className="interview-v2-glass inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold"><ArrowLeft size={17}/> Tableau de bord</Link><p className="text-xs font-bold uppercase tracking-[.2em] text-[#BFC7F7]">INTERVIEW<span className="text-[#DEACFB]">LAB</span></p></div>
   <header className="report-v2-rise mx-auto mt-12 max-w-3xl text-center sm:mt-16">
    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-[22px] border border-[#88E6DB]/35 bg-[#31C5B8]/15 shadow-[0_0_52px_#31C5B822]"><Check aria-hidden size={29} className="text-[#75EEE0]"/></div>
    <p className="text-xs font-bold uppercase tracking-[.25em] text-[#BFA7FF]">{interrupted ? "Séance interrompue" : "Séance terminée"}</p>
    <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-.045em] sm:text-5xl">{interrupted ? "Votre séance est terminée" : "Chaque entretien vous fait progresser."}</h1>
    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#C7D2EE] sm:text-base">{interrupted ? "Aucun bilan pédagogique complet n'est disponible pour cette séance interrompue." : "Votre retour pédagogique, pour mieux comprendre vos points d’appui et préparer votre prochain entretien."}</p>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[#DCE3FD]"><span className="interview-v2-pill rounded-full px-4 py-2">{family === "technical" ? "Entretien technique" : "Entretien RH"}</span><span className="interview-v2-pill rounded-full px-4 py-2">{duration}</span><span className="interview-v2-pill rounded-full px-4 py-2">Analyse non notée</span></div>
   </header>
   {!interrupted && <RoleplayDebrief transcript={transcript} feedback={feedback} jobTitle={jobTitle}/>}
   <section aria-labelledby="report-summary" className="report-v2-rise report-v2-delay-1 mt-10 rounded-[30px] border border-white/15 bg-white/[.075] p-6 shadow-[0_28px_85px_#05091b55] backdrop-blur-xl sm:p-9">
    <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#BCA1FF]/15 text-[#D2BEFF]"><Sparkles size={21}/></span><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#BCB5E8]">Votre retour immédiat</p><h2 id="report-summary" className="mt-1 text-xl font-semibold">L’essentiel de votre séance</h2></div></div>
    {jobTitle && <p className="mt-5 text-xs font-medium text-[#B8C9EA]">Contexte · {jobTitle}</p>}
    <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#E5EAFE]">{data.summary}</p>
   </section>
   {!interrupted && <div className="mt-5 grid gap-5 md:grid-cols-2">
    <section className="report-v2-rise report-v2-delay-2 rounded-[28px] border border-[#76E5D1]/20 bg-[#2F847A]/[.12] p-6 sm:p-7"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-2xl bg-[#64DCC6]/15 text-[#80EDD9]"><Check size={21}/></span><h2 className="text-lg font-semibold">Votre point fort</h2></div><p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#DFEEE9]">{data.strength || "Aucun point fort spécifique n’a pu être établi avec suffisamment de certitude."}</p></section>
    <section className="report-v2-rise report-v2-delay-3 rounded-[28px] border border-[#DBB0FF]/20 bg-[#7B4FA6]/[.13] p-6 sm:p-7"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-2xl bg-[#D4ACFF]/15 text-[#E1C1FF]"><Target size={21}/></span><h2 className="text-lg font-semibold">Votre priorité de progression</h2></div><p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#E8E2F2]">{data.improvement || "Aucun axe prioritaire fiable n’a été identifié. Vous pouvez refaire une séance pour approfondir l’analyse."}</p></section>
   </div>}
   {!interrupted && <section className="report-v2-rise report-v2-delay-4 mt-5 flex flex-col gap-4 rounded-[28px] border border-white/15 bg-white/[.06] p-6 sm:flex-row sm:items-start sm:p-7"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#8BAFFF]/15 text-[#B9CCFF]"><Lightbulb size={22}/></span><div><h2 className="text-lg font-semibold">Pour votre prochain entretien</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#D5DDF5]">{data.advice || "Entraînez-vous à présenter une situation concrète, votre action personnelle et le résultat obtenu. Recommencez une simulation pour mesurer votre progression."}</p></div></section>}
   {data.extras.length > 0 && <section className="report-v2-rise report-v2-delay-4 mt-5 rounded-[28px] border border-white/10 bg-white/[.045] p-6 sm:p-7"><h2 className="text-lg font-semibold">Observations complémentaires</h2>{data.extras.map((section, index) => <div key={`${section.title}-${index}`} className="mt-4 border-t border-white/10 pt-4"><h3 className="text-sm font-semibold text-[#D6C6FF]">{section.title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#D5DDF5]">{section.body}</p></div>)}</section>}
   {!interrupted && <section aria-labelledby="next-step-heading" className="report-v2-rise report-v2-delay-4 relative mt-7 overflow-hidden rounded-[30px] border border-[#BAA6FE]/25 bg-gradient-to-br from-[#252657]/90 via-[#1B2751]/95 to-[#14354D]/90 p-6 shadow-[0_24px_70px_#060B2966] sm:p-9">
    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-[#BA82FF]/15 blur-[85px]"/>
    <div className="relative">
     <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#C9ACFF]"><Sparkles size={15}/> La suite de votre parcours</p>
     <h2 id="next-step-heading" className="mt-4 text-balance text-2xl font-semibold tracking-[-.035em] sm:text-3xl">Votre prochaine étape, à votre rythme.</h2>
     <p className="mt-3 max-w-2xl text-sm leading-7 text-[#D2DDF5]">À partir de votre bilan, voici un point à travailler en priorité. Les autres formes d’accompagnement arriveront progressivement.</p>
     <div className="mt-7 rounded-[25px] border border-[#9BD9EC]/25 bg-white/[.09] p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[.13em] text-[#A9E9E6]">Recommandation pour votre prochaine simulation</p>
      <h3 className="mt-3 text-xl font-semibold">{focus.name}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#D8E6F7]">{focus.detail}</p>
      <Link href={academyHref} className="interview-v2-primary mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold">Travailler ce point maintenant <ArrowRight size={17}/></Link>
      <p className="mt-3 text-xs leading-5 text-[#B7C9DF]">Ouvrez un exercice guidé, puis revenez à une simulation pour mettre vos acquis en pratique.</p>
     </div>
     <div className="mt-4 grid gap-4 md:grid-cols-2">
      <article className="rounded-[24px] border border-white/15 bg-white/[.055] p-5 sm:p-6">
       <Dumbbell size={22} className="text-[#A3C8FF]" aria-hidden="true"/>
       <h3 className="mt-4 text-lg font-semibold">Explorer des entraînements</h3>
       <p className="mt-2 text-sm leading-7 text-[#CDD8EF]">Des exercices courts et des supports pratiques adaptés à chaque compétence.</p>
       <Link href="/exercises" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#A6C6FF]/40 bg-[#5A83F0]/20 px-4 text-sm font-bold text-white transition hover:bg-[#5A83F0]/35">Explorer les exercices <ArrowRight size={17}/></Link>
      </article>
      <article className="rounded-[24px] border border-white/15 bg-white/[.055] p-5 sm:p-6">
       <CalendarDays size={22} className="text-[#DAB4FF]" aria-hidden="true"/>
       <h3 className="mt-4 text-lg font-semibold">Échanger avec un expert</h3>
       <p className="mt-2 text-sm leading-7 text-[#CDD8EF]">Un accompagnement individuel pour travailler votre discours, votre posture et vos réponses.</p>
       <p className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#BBA3D8]/30 bg-white/[.07] px-4 text-center text-sm font-semibold text-[#D4B9F3]">Réservation prochainement</p>
      </article>
     </div>
    </div>
   </section>}
   <nav aria-label="Actions après entretien" className="report-v2-rise report-v2-delay-4 mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href={retryHref} className="interview-v2-primary inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl px-7 py-4 text-sm font-bold">Refaire un entretien <RotateCcw size={17}/></Link><Link href="/dashboard" className="interview-v2-glass inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl px-7 py-4 text-sm font-semibold">Retour au tableau de bord <ArrowRight size={17}/></Link></nav>
   <p className="mx-auto mt-9 max-w-xl text-center text-xs leading-6 text-[#ABB8D9]">Retour pédagogique indicatif, sans note ni jugement de recrutement. Cette séance locale n’est pas encore enregistrée dans Supabase.</p>
  </div>
 </main>;
}
