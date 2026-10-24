#!/bin/zsh
set -eu
cd "$(dirname "$0")/.."
print 'Activation locale du coach IA InterviewLab Academy'
print 'La clé sera enregistrée uniquement dans web/.env.local (exclu de Git).'
read -s 'GROQ_KEY?Clé Groq (saisie masquée) : '
print ''
if [[ ${#GROQ_KEY} -lt 20 ]]; then
  print 'Clé absente ou trop courte. Aucune modification.'
  unset GROQ_KEY
  exit 1
fi
export GROQ_KEY
python3 - <<'PY'
import os
from pathlib import Path
p=Path('web/.env.local')
lines=p.read_text().splitlines() if p.exists() else []
lines=[line for line in lines if not line.startswith('GROQ_API_KEY=') and not line.startswith('ACADEMY_AI_MODEL=')]
lines.extend(['GROQ_API_KEY='+os.environ['GROQ_KEY'],'ACADEMY_AI_MODEL=llama-3.3-70b-versatile'])
p.write_text('\n'.join(lines)+'\n')
p.chmod(0o600)
print('Configuration locale enregistrée. Aucune clé affichée.')
PY
unset GROQ_KEY
print 'Redémarrez ensuite le serveur Next.js pour charger la clé.'
