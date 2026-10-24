-- Academy V1 formative attempts, owned by authenticated candidate.
create table if not exists public.academy_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 exercise_id text not null check (length(exercise_id) between 3 and 120),
 exercise_revision integer not null default 1 check (exercise_revision > 0),
 status text not null default 'completed' check (status = 'completed'),
 response_text text not null check (char_length(btrim(response_text)) between 20 and 8000),
 checked_criteria jsonb not null default '[]'::jsonb check (jsonb_typeof(checked_criteria)='array' and jsonb_array_length(checked_criteria)<=20),
 completed_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create index if not exists academy_attempts_user_recent_idx on public.academy_attempts(user_id, completed_at desc);
create index if not exists academy_attempts_user_exercise_idx on public.academy_attempts(user_id, exercise_id);
alter table public.academy_attempts enable row level security;
revoke all on public.academy_attempts from anon;
grant select,insert on public.academy_attempts to authenticated;
drop policy if exists academy_attempts_read_self on public.academy_attempts;
create policy academy_attempts_read_self on public.academy_attempts for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists academy_attempts_insert_self on public.academy_attempts;
create policy academy_attempts_insert_self on public.academy_attempts for insert to authenticated with check ((select auth.uid()) = user_id);
-- No update/delete policy: attempts are immutable evidence; future erasure is an admin-controlled privacy workflow.
