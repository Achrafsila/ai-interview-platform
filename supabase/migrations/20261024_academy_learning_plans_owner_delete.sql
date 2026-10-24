drop policy if exists academy_learning_plans_delete on public.academy_learning_plans;
create policy academy_learning_plans_delete on public.academy_learning_plans for delete to authenticated using ((select auth.uid())=user_id);
grant delete on public.academy_learning_plans to authenticated;
