import { notFound } from "next/navigation";
import { InterviewReport } from "@/app/interview/InterviewReport";

const fictitiousFeedback = `**Bilan bref** : Vous présentez votre parcours avec clarté et montrez une bonne compréhension des enjeux du recrutement. Vos réponses sont pertinentes et votre motivation est perceptible. Pour convaincre davantage, étayez vos réalisations par des exemples précis et des résultats mesurables.

**Point fort observable** : Votre capacité à expliquer des situations de collaboration avec les managers et à formuler vos décisions de façon professionnelle.

**Axe d'amélioration prioritaire** : Certains exemples gagneraient à être mieux structurés. Précisez la situation de départ, votre contribution personnelle et l'impact obtenu, idéalement avec des chiffres.

**Conseil concret** : Préparez deux réussites professionnelles en utilisant la méthode STAR. Entraînez-vous à les expliquer en moins de deux minutes, puis reformulez votre conclusion pour montrer la valeur créée.`;

export default function ReportPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <>
    <div className="fixed bottom-4 right-4 z-50 rounded-full border border-fuchsia-300/50 bg-[#24204A]/95 px-4 py-2 text-xs font-semibold text-white shadow-xl">DÉMO · DONNÉES FICTIVES</div>
    <InterviewReport feedback={fictitiousFeedback} jobTitle="Talent Acquisition Lead" family="rh" elapsed={1120}/>
  </>;
}
