-- Per-candidate conversation session; only authenticated owners may read/write.
create table if not exists public.interview_live_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 job_title text not null check (char_length(job_title) between 1 and 160),
 job_description text not null default '',
 family text not null check (family in ('rh','technical')),
 locale text not null check (locale in ('fr','en')),
 max_turns integer not null check (max_turns between 1 and 6),
 transcript jsonb not null default '[]'::jsonb,
 question text not null default '',
 stage text not null default 'active' check (stage in ('active','completed')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists interview_live_sessions_owner_idx on public.interview_live_sessions(user_id,created_at desc);
alter table public.interview_live_sessions enable row level security;
create policy "owner manages interview live sessions" on public.interview_live_sessions
 for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.interview_live_sessions from anon;
grant select,insert,update,delete on public.interview_live_sessions to authenticated;
