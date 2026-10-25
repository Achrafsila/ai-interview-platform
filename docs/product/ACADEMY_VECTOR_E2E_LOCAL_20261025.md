# Academy Coach V3 — chaîne vectorielle locale (25 octobre 2026)

## Réalisation effective
- Dix guides internes `approved` présents dans Supabase ont été encodés avec `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (FastEmbed ONNX, dimension 384).
- Le champ `academy_knowledge.embedding` a été alimenté pour ces dix documents via une opération SQL administrateur ; le document `draft` reste non indexé.
- L'index HNSW cosine existant est utilisé par la recherche hybride Supabase.
- `scripts/academy_local_embed_server.py` sert le même encodeur sur `127.0.0.1` exclusivement et ne doit jamais être exposé tel quel sur le réseau public.
- L'API Next.js peut choisir une recherche vectorielle lorsqu'une variable serveur `ACADEMY_EMBEDDING_URL` vers ce service local est disponible. Sans service, elle conserve le repli lexical + trigramme. Le modèle Groq reste inchangé.

## Tests réellement observés
- `node scripts/test_academy_vector_live.cjs` : **4/5** cas de recherche hybride en top-1. Échec : la demande « situation, actions, résultat » classe le guide sur les conflits devant STAR ; ce défaut de pertinence reste ouvert.
- `node scripts/test_academy_knowledge.cjs` : **8/8** contrôles de droits, brouillons et recherche.
- `node scripts/test_academy_matching.cjs` : **9/9**.
- Compilation TypeScript et `npm run build` Next.js : réussies.

## Activer localement
```sh
ACADEMY_EMBEDDING_PORT=18765 .academy-embedding-venv/bin/python scripts/academy_local_embed_server.py
# Dans le processus Next.js exécuté sur le même Mac :
ACADEMY_EMBEDDING_URL=http://127.0.0.1:18765
node scripts/test_academy_vector_live.cjs
```
Le test de vecteurs utilise le port 18765 et exige que le serveur soit démarré. Pour changer de port, mettre à jour sa configuration dans le script de test. Les exports locaux JSON et les poids du modèle sont exclus de Git.

## Limites bloquantes pour Vercel
L'encodeur local n'est **pas hébergé en production**, et `127.0.0.1` sur Vercel ne désigne pas le Mac. Aucune connexion publique au Mac ni nouvelle plateforme payante n'a été activée. L'app déployée reste en mode lexical jusqu'à ce qu'un service d'encodage sûr et accessible au runtime Vercel soit installé, ou qu'un modèle compatible puisse s'exécuter directement dans ce runtime. La recherche reste un pilote interne ; le benchmark 4/5 ne permet pas de promettre une pertinence générale.
