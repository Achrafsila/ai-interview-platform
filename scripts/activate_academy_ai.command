#!/bin/zsh
set -eu
cd "$(dirname "$0")/.."
print 'InterviewLab — configuration Groq commune'
print 'Modules : Academy Ask, feedback pédagogique, simulation locale, audio Whisper local.'
print 'La clé sera conservée seulement dans web/.env.local, exclu de Git.'
read -s 'GROQ_KEY?Nouvelle clé Groq (saisie invisible) : '
print ''
if [[ ${#GROQ_KEY} -lt 20 ]]; then
 print 'Clé vide ou trop courte. Configuration inchangée.'
 unset GROQ_KEY
 exit 1
fi
export GROQ_KEY
python3 - <<'PY'
import os
from pathlib import Path
p=Path("web/.env.local")
lines=p.read_text().splitlines() if p.exists() else []
lines=[x for x in lines if not x.startswith(("GROQ_API_KEY=","ACADEMY_AI_MODEL="))]
lines.extend(("GROQ_API_KEY="+os.environ["GROQ_KEY"],"ACADEMY_AI_MODEL=openai/gpt-oss-120b"))
p.write_text("\n".join(lines)+"\n")
p.chmod(0o600)
print("Clé configurée pour Next.js : Academy Ask et évaluation formative.")
PY
unset GROQ_KEY
print 'Pour les fonctions IA du simulateur Python, utiliser scripts/start_local_preview_ai.command.'
print 'Redémarrer Next.js afin de recharger les variables.'
print 'Les déploiements cloud requièrent une configuration séparée des secrets.'
