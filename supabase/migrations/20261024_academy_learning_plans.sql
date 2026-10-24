create table if not exists public.academy_learning_plans (
 user_id uuid primary key references auth.users(id) on delete cascade,
 needs jsonb not null default '[]'::jsonb check (jsonb_typeof(needs)='array'),
 steps jsonb not null default '[]'::jsonb check (jsonb_typeof(steps)='array'),
 primary_path_id text not null check (length(primary_path_id) between 2 and 100),
 context text,
 source text not null default 'rules' check (source in ('rules','ai-ld')),
 updated_at timestamptz not null default now()
);
alter table public.academy_learning_plans enable row level security;
revoke all on public.academy_learning_plans from anon;
grant select, insert, update on public.academy_learning_plans to authenticated;
drop policy if exists academy_learning_plans_select on public.academy_learning_plans;
create policy academy_learning_plans_select on public.academy_learning_plans for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists academy_learning_plans_insert on public.academy_learning_plans;
create policy academy_learning_plans_insert on public.academy_learning_plans for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists academy_learning_plans_update on public.academy_learning_plans;
create policy academy_learning_plans_update on public.academy_learning_plans for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
