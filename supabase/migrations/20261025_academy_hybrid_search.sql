-- Hybrid ranking: French full-text + trigram now, optional pgvector cosine when embeddings become available.
create extension if not exists pg_trgm with schema extensions;
create index if not exists academy_knowledge_fts_idx on public.academy_knowledge using gin (to_tsvector('french', title||' '||domain||' '||content));
create or replace function public.academy_hybrid_search(query_text text, query_embedding extensions.vector(1536) default null, match_count int default 4)
returns table(slug text,title text,domain text,content text,source_label text,relevance double precision)
language sql stable security definer set search_path=public,extensions as $$
 with q as (select nullif(trim(left(query_text,500)),'') as phrase, plainto_tsquery('french',left(query_text,500)) as phrase_ts),
 scored as (select k.slug,k.title,k.domain,k.content,k.source_label,
 (case when q.phrase is not null then ts_rank_cd(to_tsvector('french',k.title||' '||k.domain||' '||k.content),q.phrase_ts) else 0 end) as lexical,
 (case when q.phrase is not null then extensions.similarity(lower(k.title||' '||k.domain),lower(q.phrase)) else 0 end) as fuzzy,
 (case when query_embedding is not null and k.embedding is not null then (1-(k.embedding <=> query_embedding)) else null end) as vector_score
 from public.academy_knowledge k cross join q where k.status='approved' and q.phrase is not null),
 ranked as (select s.*, (least(s.lexical,1)*0.65+greatest(s.fuzzy,0)*0.35+coalesce(greatest(s.vector_score,0)*0.75,0)) as score from scored s)
 select r.slug,r.title,r.domain,r.content,r.source_label,r.score::double precision from ranked r
 where r.lexical>0 or r.fuzzy>=0.11 or (query_embedding is not null and r.vector_score>=0.40)
 order by r.score desc limit least(greatest(match_count,1),5)
$$;
revoke all on function public.academy_hybrid_search(text,extensions.vector,int) from public,anon;
grant execute on function public.academy_hybrid_search(text,extensions.vector,int) to authenticated;
