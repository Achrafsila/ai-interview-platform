# Academy V3 — Offline semantic embedding feasibility (25 Oct 2026)

## Actual result
- Installed a local Python venv (not committed) with `fastembed==0.9.1` on Apple Silicon arm64.
- Downloaded and evaluated `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (ONNX via FastEmbed, 384 dimensions), without a paid inference API.
- Changed the Supabase `academy_knowledge.embedding` dimension from 1536 to 384 and prepared a partial HNSW cosine index. Existing embeddings were null.
- Added a reproducible offline five-question nearest-neighbour smoke benchmark: **5/5** after revising the conflict-document wording; the initial corpus scored **4/5**.
- Re-ran the authenticated knowledge-access / draft-exclusion test: **8/8**.

## Important limitation
The embedding model runs **on the development Mac only**. **Embeddings are not yet populated in Supabase** and Vercel cannot automatically invoke this local model. The deployed Academy currently uses French full-text + trigram retrieval, not online vector semantic retrieval. An authorized indexing job and an inference service accessible to Vercel are still required. Do not label it as deployed end-to-end semantic search.

## Reproduce
```sh
python3 -m venv .academy-embedding-venv
.academy-embedding-venv/bin/pip install fastembed==0.9.1
.academy-embedding-venv/bin/python scripts/academy_semantic_benchmark.py
node scripts/test_academy_knowledge.cjs
```
Local model cache and venv are gitignored. First run downloads model weights from Hugging Face. Before production, verify embedding model licence, resource consumption, governance and EU/Moroccan data-processing arrangements.

## Planned next release
Index approved documents, configure the same encoder for query-time requests from Next.js (with bounded retries/timeouts), measure recall@k on larger held-out datasets, and introduce fallback to lexical retrieval when encoder service is unavailable.
