alter table public.academy_attempts add column if not exists formative_feedback jsonb;
alter table public.academy_attempts add constraint academy_feedback_shape check (formative_feedback is null or (jsonb_typeof(formative_feedback)='object' and length(formative_feedback::text)<5000));
