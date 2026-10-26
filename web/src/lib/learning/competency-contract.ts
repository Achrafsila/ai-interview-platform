/** Shared, non-scoring contract for Simulator → Academy recommendations. */
export type CompetencySource = "jd_explicit" | "title_inferred";
export type EvidenceStatus = "candidate_statement_unverified" | "reviewed_observation";
export type CompetencyEvidence = {
 competency: string;
 source: CompetencySource;
 status: EvidenceStatus;
 turnIndex: number;
 quote: string;
};
export type LearningNeed = {competency:string;reason:string;turnIndex:number;status:"review_required"};
const MAX_QUOTE=260;
/** Never infer a coaching gap automatically from job title or an unreviewed candidate assertion. */
export function deriveLearningNeeds(evidence:readonly CompetencyEvidence[]):LearningNeed[]{
 const result:LearningNeed[]=[];
 for(const item of evidence){
  if(item.status!=="reviewed_observation"||item.source!=="jd_explicit")continue;
  if(!item.competency.trim()||!Number.isInteger(item.turnIndex)||item.turnIndex<0||!item.quote.trim())continue;
  if(result.some(existing=>existing.competency===item.competency))continue;
  result.push({competency:item.competency,reason:item.quote.trim().slice(0,MAX_QUOTE),turnIndex:item.turnIndex,status:"review_required"});
 }
 return result.slice(0,6);
}
