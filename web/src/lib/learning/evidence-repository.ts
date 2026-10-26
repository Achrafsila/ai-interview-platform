import type {SupabaseClient} from '@supabase/supabase-js';
export type StoredEvidence={competency:string;provenance:'jd_explicit'|'title_inferred';evidence_status:'candidate_statement_unverified'|'reviewed_observation';turn_index:number;candidate_quote:string;review_required:boolean};
/** Read-only owner-scoped repository; the database RLS is the second boundary. */
export async function readCompetencyEvidence(client:SupabaseClient,userId:string,resultId:string):Promise<StoredEvidence[]>{
 if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(resultId))return [];
 const {data,error}=await client.from('candidate_interview_competency_observations')
  .select('competency,provenance,evidence_status,turn_index,candidate_quote,review_required')
  .eq('user_id',userId).eq('interview_result_id',resultId).order('turn_index',{ascending:true}).limit(60);
 if(error?.code==='42P01'||error?.code==='PGRST205')return [];
 if(error)throw error;
 return (data??[]) as StoredEvidence[];
}
