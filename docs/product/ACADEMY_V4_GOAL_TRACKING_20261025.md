# Academy V4 — Suivi explicite des objectifs

## Développé
- `goal-tracker.ts` reconstruit depuis les propos du candidat une chronologie bornée de ses objectifs, avec source, numéro de tour et statut `active` ou `superseded`.
- Un changement d'objectif explicite désactive les objectifs précédents uniquement lorsqu'un nouveau domaine est identifiable.
- Les déclarations de contexte candidates sont conservées comme faits **déclarés**, jamais comme compétences évaluées. Le coach n'est pas une source de faits candidat.
- Les hypothèses ne sont pas persistées comme faits confirmés. Les objectifs actifs, et seulement eux, peuvent contextualiser les prochaines réponses Groq.
- L'API `/api/academy/conversation` recalcule l'état depuis les messages validés avant sauvegarde en base Supabase.

## Limites
- Première version heuristique, avec six familles d'objectifs : communication, structure, soft skills, projets, négociation salariale, gestion du stress. N'est pas une évaluation des compétences.
- Pas de validation humaine des faits ni de progression de maîtrise avant/après exercice.
- Informations sensibles : filtrage partiel ; l'historique lui-même reste soumis aux règles de confidentialité et de suppression de conversation.
- Mémoire bornée aux 20 derniers messages ; pas de synthèse durable hors de cette fenêtre.

## Recette
- 7/7 tests unitaires suivi des objectifs, 7/7 mémoire, 10/10 diagnostic, 8/8 navigateur, 18/18 API.
