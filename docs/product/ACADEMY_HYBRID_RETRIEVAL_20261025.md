# Academy V3 — Recherche hybride et corpus de référence (25/10/2026)

## Livré
- Fonction SQL `academy_hybrid_search` : combinaison de pertinence plein texte française, rapprochement trigramme et score vectoriel pgvector **optionnel**.
- Appel Academy : la requête du candidat sert directement à la recherche, sans liste fermée de métiers déclencheurs.
- RLS et permissions : accès table interdit aux comptes candidats ; RPC authentifié ; documents `draft` exclus.
- Corpus : sept nouveaux guides pédagogiques internes dérivés des dix conversations de référence, portant le total à **dix approuvés pour le pilote et un brouillon**.
- Modèle : Groq `openai/gpt-oss-120b` conservé, sans nouvelle souscription.

## Distinction essentielle
**La recherche sémantique vectorielle n’est pas encore active.** La fonction SQL accepte un vecteur de requête, mais il n’existe pas à ce jour de modèle d’embeddings configuré pour peupler `embedding` et encoder les questions. Le mode opérationnel est **plein texte + trigramme**, pas un système entièrement sémantique. Il faut sélectionner un encodeur local compatible 1536 dimensions ou adapter les dimensions à l’encodeur retenu, puis créer un pipeline d’indexation/évaluation.

## Tests
- `scripts/test_academy_knowledge.cjs` : 8/8, y compris nouveau moteur, exclusion brouillons et récupération de documents métiers.
- Le corpus est constitué de guides de coaching internes et ne prétend pas valider de manière externe le contenu métier.
- Les tests automatiques ne remplacent pas une revue pédagogique humaine ou un test de résistance aux injections documentaires.

## Suite
1. Configurer un encodeur d'embeddings local (coût API nul), vérifier licence, performances et dimension des vecteurs.
2. Indexer les documents approuvés et intégrer l’encodage des requêtes côté serveur.
3. Benchmark retrieval (recall@k, nDCG, faux positifs) sur des questions reformulées.
4. Étendre les fiches métiers et vérifier provenance, droits et validation L&D avant candidats réels.
