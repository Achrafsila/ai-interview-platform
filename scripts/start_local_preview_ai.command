#!/bin/zsh
set -eu
cd "$(dirname "$0")/.."
if [[ ! -f web/.env.local ]]; then
 print 'La configuration locale est absente. Lancez activate_academy_ai.command d’abord.'
 exit 1
fi
python3 - <<'PY'
import os,sys
from pathlib import Path
env=dict(os.environ)
for line in Path("web/.env.local").read_text().splitlines():
    if line.startswith(("GROQ_API_KEY=","ACADEMY_AI_MODEL=")):
        key,value=line.split("=",1)
        env[key]=value
if not env.get("GROQ_API_KEY"):
    print("GROQ_API_KEY absente. Exécutez activate_academy_ai.command.")
    sys.exit(1)
env["AI_PROVIDER"]="groq"
print("Lancement simulation locale avec fournisseur Groq (clé masquée).",flush=True)
os.execvpe(sys.executable,[sys.executable,"dev/local-preview/server.py"],env)
PY
