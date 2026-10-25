create table if not exists public.academy_conversations (
 user_id uuid primary key references auth.users(id) on delete cascade,
 turns jsonb not null default '[]'::jsonb,
 diagnostic jsonb,
 updated_at timestamptz not null default now(),
 constraint academy_turns_array check (jsonb_typeof(turns)='array' and jsonb_array_length(turns)<=20)
);
alter table public.academy_conversations enable row level security;
revoke all on public.academy_conversations from anon;
grant select,insert,update,delete on public.academy_conversations to authenticated;
create policy academy_conversation_owner_select on public.academy_conversations for select to authenticated using ((select auth.uid())=user_id);
create policy academy_conversation_owner_insert on public.academy_conversations for insert to authenticated with check ((select auth.uid())=user_id);
create policy academy_conversation_owner_update on public.academy_conversations for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy academy_conversation_owner_delete on public.academy_conversations for delete to authenticated using ((select auth.uid())=user_id);
