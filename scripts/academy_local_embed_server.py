"""Local-only multilingual Academy embeddings endpoint.

Security: binds to 127.0.0.1. Never expose directly on public internet.
Requires local FastEmbed venv and model cached on disk.
"""
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from fastembed import TextEmbedding

ROOT = Path(__file__).resolve().parent.parent
MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
model = TextEmbedding(model_name=MODEL, cache_dir=str(ROOT / ".academy-model-cache"))

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/embed":
            self.send_error(404)
            return
        if int(self.headers.get("Content-Length", "0")) > 4096:
            self.send_error(413)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length))
            query = body.get("text")
            if not isinstance(query, str) or not 3 <= len(query.strip()) <= 500:
                self.send_error(400)
                return
            vector = next(iter(model.embed([query])))
            payload = json.dumps({"embedding": [float(x) for x in vector]}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except (ValueError, KeyError, TypeError):
            self.send_error(400)

if __name__ == "__main__":
    port = int(os.getenv("ACADEMY_EMBEDDING_PORT", "8765"))
    print(f"Academy embedder listening only on localhost:{port}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
