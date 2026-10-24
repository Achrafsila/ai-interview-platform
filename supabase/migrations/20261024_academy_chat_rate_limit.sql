create table if not exists public.academy_chat_limits (
 user_id uuid primary key references auth.users(id) on delete cascade,
 window_started_at timestamptz not null default now(),
 request_count integer not null default 0
);
revoke all on public.academy_chat_limits from anon, authenticated;
create or replace function public.academy_claim_chat_quota()
returns boolean language plpgsql security definer set search_path=public as $$
declare
 claim_user uuid := (select auth.uid());
 claim_count integer;
begin
 if claim_user is null then return false; end if;
 insert into public.academy_chat_limits(user_id,window_started_at,request_count)
 values(claim_user,now(),1)
 on conflict(user_id) do update set
  request_count=case when public.academy_chat_limits.window_started_at <= now()-interval '1 minute' then 1 else public.academy_chat_limits.request_count+1 end,
  window_started_at=case when public.academy_chat_limits.window_started_at <= now()-interval '1 minute' then now() else public.academy_chat_limits.window_started_at end
 returning request_count into claim_count;
 return claim_count <= 12;
end;
$$;
revoke all on function public.academy_claim_chat_quota() from public;
grant execute on function public.academy_claim_chat_quota() to authenticated;
