"""Authenticated multilingual embedding service for InterviewLab.
No Supabase/Groq credentials; deploy behind HTTPS on trusted managed infrastructure.
"""
import hmac
import os
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from fastembed import TextEmbedding

MODEL = 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'
TOKEN = os.environ.get('ACADEMY_EMBEDDING_TOKEN')
if not TOKEN or len(TOKEN) < 32:
    raise RuntimeError('ACADEMY_EMBEDDING_TOKEN must contain at least 32 characters')
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
model = TextEmbedding(model_name=MODEL, cache_dir=os.environ.get('MODEL_CACHE_DIR', '/tmp/academy-embed-model'))

class Request(BaseModel):
    text: str = Field(min_length=3, max_length=500)

@app.get('/health')
def health():
    return {'status': 'ok', 'model': MODEL, 'dimension': 384}

@app.post('/embed')
def embed(request: Request, authorization: str | None = Header(default=None)):
    if not authorization or not hmac.compare_digest(authorization, 'Bearer ' + TOKEN):
        raise HTTPException(status_code=401, detail='Unauthorized')
    vector = next(iter(model.embed([request.text])))
    return {'embedding': [float(value) for value in vector]}
