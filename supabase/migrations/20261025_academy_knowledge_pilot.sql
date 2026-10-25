create extension if not exists vector with schema extensions;
create table if not exists public.academy_knowledge (
 id bigint generated always as identity primary key,
 slug text not null unique,
 title text not null,
 domain text not null,
 content text not null,
 status text not null default 'draft' check (status in ('draft','approved')),
 source_label text not null,
 embedding extensions.vector(1536),
 updated_at timestamptz not null default now()
);
alter table public.academy_knowledge enable row level security;
revoke all on public.academy_knowledge from anon,authenticated;
create or replace function public.academy_search_knowledge(query_text text, match_count int default 4)
returns table(slug text,title text,domain text,content text,source_label text)
language sql stable security definer set search_path=public as $$
 select k.slug,k.title,k.domain,k.content,k.source_label from public.academy_knowledge k
 where k.status='approved' and length(trim(query_text))>=3
 and to_tsvector('french',k.title||' '||k.domain||' '||k.content) @@ plainto_tsquery('french',query_text)
 order by ts_rank_cd(to_tsvector('french',k.title||' '||k.domain||' '||k.content),plainto_tsquery('french',query_text)) desc
 limit least(greatest(match_count,1),5)
$$;
revoke all on function public.academy_search_knowledge(text,int) from public,anon;
grant execute on function public.academy_search_knowledge(text,int) to authenticated;
insert into public.academy_knowledge(slug,title,domain,content,status,source_label) values
('academy-star-reference','Illustrer une expérience avec STAR','communication','Utiliser une situation professionnelle réelle : situation, tâche, action personnelle et résultat. Le candidat peut commencer par exprimer la valeur ou le résultat de son projet en une phrase avant de structurer son exemple. Ne pas inventer de chiffres ni faire de STAR une obligation universelle.','approved','Dialogues de référence transmis par le responsable produit — guide interne'),
('academy-career-break-privacy','Interruption de carrière et confidentialité','entretien RH','Un candidat peut parler sobrement de sa période d’interruption professionnelle sans détailler sa santé ou ses motifs personnels. Ne pas lui demander de diagnostic ou lui proposer de révéler une raison médicale. L’aider à mettre en avant sa préparation à un retour, seulement s’il souhaite le faire.','approved','Dialogues de référence transmis par le responsable produit — guide interne'),
('academy-staffing-scope','Staffing Manager en ESN : périmètre à clarifier','staffing manager esn ssii','Le périmètre d’un poste de Staffing Manager peut inclure allocation de consultants, anticipation des disponibilités, coordination commerciale, arbitrage de ressources et suivi de missions. Ne pas supposer que staffing signifie management hiérarchique. Demander au candidat les responsabilités de l’offre et son expérience avant de personnaliser une préparation.','approved','Scénario de cadrage produit Academy — hypothèses non universelles'),
('academy-serverless-tradeoffs','Choix Serverless : expliquer les compromis','architecture technique','Pour défendre un choix serverless face à des conteneurs, demander le profil du trafic, les coûts, la maintenance, la latence au démarrage et les contraintes de l’équipe. Aucune option n’est toujours la moins chère ; demander des faits et les justifications du candidat.','draft','Contenu technique pilote — validation experte en attente')
on conflict(slug) do nothing;
