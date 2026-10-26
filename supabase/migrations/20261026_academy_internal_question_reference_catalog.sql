-- Internal training reference. Publication approval for the official question bank remains separate.
create table if not exists public.academy_question_references (
 code text primary key,
 family text not null check (family in ('rh','technical','transversal')),
 category_code text not null,
 difficulty smallint not null check (difficulty between 1 and 4),
 question_type text not null,
 prompt_fr text not null,
 prompt_en text not null,
 provenance text not null default 'question_bank_draft',
 validation_status text not null default 'internal_pilot' check (validation_status in ('internal_pilot','approved')),
 imported_at timestamptz not null default now()
);
alter table public.academy_question_references enable row level security;
revoke all on public.academy_question_references from anon;
grant select on public.academy_question_references to authenticated;
create policy academy_question_references_authenticated_read on public.academy_question_references for select to authenticated using ((select auth.uid()) is not null);
insert into public.academy_question_references(code,family,category_code,difficulty,question_type,prompt_fr,prompt_en)
select q.code,c.family,c.code,v.difficulty,v.question_type,fr.prompt,en.prompt
from question_bank.questions q
join question_bank.categories c on c.id=q.category_id
join question_bank.question_versions v on v.question_id=q.id
join question_bank.localizations fr on fr.question_version_id=v.id and fr.locale='fr'
join question_bank.localizations en on en.question_version_id=v.id and en.locale='en'
where v.status='draft' and not v.approved_for_publication
on conflict(code) do update set prompt_fr=excluded.prompt_fr,prompt_en=excluded.prompt_en,category_code=excluded.category_code,difficulty=excluded.difficulty,question_type=excluded.question_type,imported_at=now();
