# Academy V2 — Premier lot L&D Matching

Architecture cible : candidat → compréhension / clarification → référentiel L&D → parcours/exercice → progression.

## Premier lot implémenté
- Taxonomie de besoins : stress, structure, communication, technique, leadership, motivation dans `ld-matching.ts`.
- Association déterministe des besoins explicites avec des IDs de parcours existants (pas de génération de parcours fictifs).
- Pour une demande trop vague, retour d'une question et de quatre réponses guidées dans la rubrique Ask Academy.
- Si le besoin est clair, présentation du parcours et d'un exercice choisi dans son curriculum, avec justification liée au besoin exprimé.
- Le lien pointe vers le détail du parcours sélectionné ; les autres recommandations de la page Parcours sont toujours basées sur l'onboarding.
- L'API conserve ses contrôles d'authentification et d'accès candidat.

## Limitations et points d'attention
- Il s'agit d'un **moteur de règles V1**, sans conversation LLM multi-tours pour le moment. Ne pas faire croire à une détection IA statistique ou à une validation humaine individualisée.
- Les correspondances et règles doivent être revues par un véritable expert L&D avant le lancement grand public.
- Pas encore de sauvegarde du brief candidat et des échanges dans Supabase, ni synchronisation de la recommandation issue d'Ask avec les cartes initiales de Parcours.
- Pour une demande ambiguë, clarification en un tour par réponses guidées ; une version complète devra conserver le contexte et proposer une question réellement spécifique.
- Exemples à vérifier : « gérer mon stress » → `stress`, « structurer mes réponses » → `star`, question vague → clarification ; aucune proposition hors catalogue.
