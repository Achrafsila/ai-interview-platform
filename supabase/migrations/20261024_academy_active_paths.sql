create table if not exists public.academy_active_paths (
 user_id uuid primary key references auth.users(id) on delete cascade,
 path_id text not null check (length(path_id) between 2 and 100),
 started_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.academy_active_paths enable row level security;
revoke all on public.academy_active_paths from anon;
grant select,insert,update on public.academy_active_paths to authenticated;
drop policy if exists academy_active_paths_self_select on public.academy_active_paths;
create policy academy_active_paths_self_select on public.academy_active_paths for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists academy_active_paths_self_insert on public.academy_active_paths;
create policy academy_active_paths_self_insert on public.academy_active_paths for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists academy_active_paths_self_update on public.academy_active_paths;
create policy academy_active_paths_self_update on public.academy_active_paths for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
