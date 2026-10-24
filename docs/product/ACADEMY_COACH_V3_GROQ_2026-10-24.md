# Academy Coach V3 — premier lot conversationnel Groq

## Livré
- Conservation de Groq et du modèle `openai/gpt-oss-120b`.
- Troisième action IA `answer` : explication métier ou pédagogique libre, affichée comme message de discussion, sans création de parcours.
- Distinction entre une demande d'information et une demande de préparation, d'exercice ou de programme ; maintien du parcours L&D quand le candidat veut s'entraîner.
- Possibilité de reformuler le contexte ou demander une clarification avant prescription ; scénario Staffing Manager en ESN protégé.
- Conservation des garanties antérieures : contrôle rôle et origine, quota, persistance du programme et contrôle des IDs d'exercices côté serveur.

## Evidences et limites
- `node scripts/test_academy_api.cjs` : 13/13, comprenant une question métier sans prescription, le cas Staffing Manager, le stage PFE, les multi-besoins et les changements explicites d'objectif.
- TypeScript et ESLint Academy : réussis.
- Ce lot n'est pas encore le système RAG complet : pas de vectorisation métier, pas de recherche documentaire fondée sur des sources validées.
- Les poids du modèle ne sont pas fine-tunés. Les contenus d'exercices restent soumis à validation humaine L&D avant usage avec de vrais candidats.
