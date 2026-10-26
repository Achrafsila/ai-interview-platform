-- Milestone 9: securely store source-grounded, non-scoring interview observations.
-- Prerequisite: candidate_interview_results migration.
create table if not exists public.candidate_interview_competency_observations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 interview_result_id uuid not null references public.candidate_interview_results(id) on delete cascade,
 competency text not null check (char_length(competency) between 2 and 100),
 provenance text not null check (provenance in ('jd_explicit','title_inferred')),
 evidence_status text not null default 'candidate_statement_unverified' check (evidence_status in ('candidate_statement_unverified','reviewed_observation')),
 turn_index integer not null check (turn_index >= 0 and turn_index < 100),
 candidate_quote text not null check (char_length(candidate_quote) between 8 and 240),
 review_required boolean not null default true,
 created_at timestamptz not null default now(),
 unique(interview_result_id,competency,turn_index)
);
create index if not exists candidate_interview_competency_user_idx
 on public.candidate_interview_competency_observations (user_id,created_at desc);
alter table public.candidate_interview_competency_observations enable row level security;
revoke all on public.candidate_interview_competency_observations from anon;
grant select on public.candidate_interview_competency_observations to authenticated;
-- Inserts are deliberately server-only until we have signed interview evidence.
create policy "Candidates read their own competency observations"
 on public.candidate_interview_competency_observations for select to authenticated
 using (user_id = (select auth.uid()) and exists (
   select 1 from public.candidate_interview_results r
   where r.id = interview_result_id and r.user_id = (select auth.uid())
 ));
