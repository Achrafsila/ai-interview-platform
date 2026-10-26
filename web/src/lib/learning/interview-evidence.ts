/** Transcript-backed evidence for transparent debriefs. Not an AI score. */
export type TranscriptTurn={question:string;answer:string};
export type TurnEvidence={turnIndex:number;question:string;answer:string;status:"candidate_statement_unverified"};
export function transcriptEvidence(turns:readonly TranscriptTurn[]|undefined):TurnEvidence[]{
 if(!turns)return [];
 return turns.slice(0,60).flatMap((turn,index)=>{
  if(typeof turn?.answer!=="string"||!turn.answer.trim())return [];
  return [{turnIndex:index,question:typeof turn.question==="string"?turn.question.slice(0,1200):"",answer:turn.answer.trim().slice(0,1800),status:"candidate_statement_unverified" as const}];
 });
}
export function evidenceCoverage(turns:readonly TranscriptTurn[]|undefined){
 const evidence=transcriptEvidence(turns);
 return {answers:evidence.length,reviewed:0,scored:false,needsReview:evidence.length>0};
}
