# Academy V4 — Mémoire conversationnelle bornée

## Réalisé
- Historique Academy étendu de 9 à 20 tours conservés et affichés, sans modifier la fenêtre de contexte Groq, limitée aux 9 derniers tours transmis.
- La route `/api/academy/ask` recharge depuis Supabase les derniers messages enregistrés pour le candidat authentifié.
- `memory.ts` sélectionne au maximum quatre déclarations antérieures exactes du candidat, uniquement lorsque les messages récents prouvent la continuité de la même conversation ; jamais des affirmations générées par le coach.
- Une demande explicite de changement d'objectif coupe cet héritage. Une nouvelle discussion supprime l'historique en base. Les sujets sensibles listés sont exclus de cette mémoire condensée.
- Les éléments cités sont présentés à Groq comme des déclarations antérieures et non comme des compétences évaluées ou des instructions.

## Limites
- Il ne s'agit pas encore d'une mémoire résumée, évaluée ou durable au-delà de 20 messages. Le mécanisme est volontairement borné, conservateur et fondé sur des citations vérifiables.
- Le filtre des informations sensibles est heuristique ; il n'offre pas une garantie de détection exhaustive. Une revue confidentialité reste nécessaire avant extension.
- La continuité à travers plusieurs sessions repose sur le même historique sauvegardé par candidat ; plusieurs fils de conversation parallèles ne sont pas encore gérés.

## Recette
- 7/7 tests unitaires de mémoire ; 10/10 tests du diagnostic.
- 8/8 tests du navigateur pour reprise et suppression ; 18/18 tests d'intégration de l'API Academy.
- TypeScript, ESLint, et build Next.js validés.
