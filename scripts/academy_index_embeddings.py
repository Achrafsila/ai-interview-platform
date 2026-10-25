"""Generate 384-dimensional multilingual embeddings for approved Academy KB documents.
No credentials or external inference API required. Output vectors as JSON to a local file for review.
"""
import json
from pathlib import Path
from fastembed import TextEmbedding
root=Path(__file__).resolve().parent.parent
rows=json.loads((root/'.academy-approved-knowledge.json').read_text())
encoder=TextEmbedding(model_name='sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',cache_dir=str(root/'.academy-model-cache'))
texts=[f"{r['title']}. {r['domain']}. {r['content']}" for r in rows]
vectors=list(encoder.embed(texts))
assert len(vectors)==len(rows) and all(len(v)==384 for v in vectors)
out=[{'slug':r['slug'],'embedding':[round(float(x),7) for x in v]} for r,v in zip(rows,vectors)]
(root/'.academy-embeddings.json').write_text(json.dumps(out,ensure_ascii=False))
print('INDEX_VECTORS_READY',len(out),'dimension=384')
