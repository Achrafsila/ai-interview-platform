-- Multilingual MiniLM embeddings are 384-dimensional; no vectors were stored before this migration.
alter table public.academy_knowledge alter column embedding type extensions.vector(384) using null::extensions.vector(384);
create index if not exists academy_knowledge_embedding_hnsw_idx on public.academy_knowledge using hnsw (embedding extensions.vector_cosine_ops) where status='approved' and embedding is not null;
comment on column public.academy_knowledge.embedding is '384-dimensional multilingual MiniLM local embeddings; null until reviewed indexing pipeline completes.';
