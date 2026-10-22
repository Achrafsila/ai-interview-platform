# AI Interview Platform — guide des agents IA

Ce dépôt est la source des documents produits et du corpus pilote. **ClickUp est la source de vérité des statuts des tâches**, quand accessible. Ne pas annoncer une mise à jour ClickUp sans confirmation de l'API.

## Avant toute modification
1. Lire `README.md`, `docs/DECISIONS.md`, `docs/SECURITY.md` et `docs/CONTRIBUTING.md`.
2. Pour S2-03, lire `docs/S2-03_Question_Bank_Specification.md`, `docs/S2-03_Implementation_Tracker.md` et `docs/S2-03_120_Questions_Status.md`.
3. Identifier le ticket ClickUp, inspecter le code/document existant, puis vérifier l'état réel avant toute affirmation.
4. Ne pas supposer que Next.js, Supabase, fournisseurs IA ou migrations sont déjà retenus et déployés ; le dépôt décrit actuellement un POC documentaire.

## Invariants produit
- Simulation d'entretien et coaching, **pas** recrutement automatisé ni décision d'embauche.
- Onboarding S2-01 : pas d'import CV ni offre au stade de l'onboarding ; l'offre peut être fournie à la configuration de simulation. Objectif professionnel principal + objectifs de préparation multiples par défaut, modifiables par session sans écraser le profil.
- S2-03 : référentiel éditorial RH/technique, difficulté L1–L4 et contenu FR/EN ; l'IA propose, une personne valide et publie.
- S2-04 : sélection dynamique et relances liées à la simulation.
- Sprint 3 : scores, grilles opérationnelles, feedback et validation des évaluations.
- Ne jamais exposer au candidat les réponses attendues, ancrages de notes ou informations internes.
- Respecter les exemples académiques/associatifs pour les candidats débutants et ne pas confondre aisance orale et compétence.

## Réalité du corpus au 22/10/2026
- 50 questions RH + 70 techniques dans cinq fichiers JSON ; 120/120 en `draft`.
- 10 RH ont une revue éditoriale approuvée, 10 techniques un pré-audit IA, 100 expansions IA sans validation humaine.
- Les relances des expansions sont génériques. Les attendus sont surtout en français, et l'exactitude métier doit être relue.
- Aucun import Supabase, aucune publication ni intégration effective du moteur.
- Script de structure : `python scripts/validate_question_bank.py`; CI GitHub dédiée au corpus.

## Qualité & livraison
- Privilégier des fichiers ciblés et des commits traçables ; ne pas modifier des données déjà validées sans noter le changement.
- Une simulation de notation manuelle n'est pas un test du modèle d'évaluation.
- Distinguer `proposed`, `draft`, `reviewed`, `published` ; éviter « terminé » tant que tests métier + intégration ne sont pas prouvés.
- Mettre à jour README, statuts documentaires et liens pertinents après modification.
- Vérifier les retours des outils ; si un connecteur est limité, conserver les mises à jour proposées dans un document **sans prétendre qu'elles sont synchronisées**.
