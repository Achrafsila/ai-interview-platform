# S2-03 — Corpus pilote de questions

Ce répertoire contient **20 questions de référence** dans deux fichiers JSON, et les deux grilles de notation génériques.

- `rh_questions.json` : 10 questions RH **approuvées éditorialement**, non approuvées pour publication.
- `technical_questions.json` : 10 questions techniques **pré-auditées et corrigées par IA**, en attente de revue experte.
- `evaluation_rubrics.json` : deux grilles **draft**, avec poids normalisés à 100 ; seuil N/E de 60 % **proposé**, à valider avec S2-04/S3-01.

**Tous les contenus restent en `draft`. Aucun contenu n'est importé dans Supabase ni distribué au candidat.**

## Traçabilité

- [Spécification S2-03](../../docs/S2-03_Question_Bank_Specification.md)
- [Pilotage et checklist ClickUp](../../docs/S2-03_Implementation_Tracker.md)
- [Clôture de revue RH](../../docs/S2-03_Revue_RH_Cloture.md)
- [Pré-audit technique IA](../../docs/S2-03_Audit_Technique.md)

## Suite

Valider les grilles sur des exemples de réponses, compléter les 100 questions restantes (cible de 50 RH/transverses et 70 techniques), faire relire les contenus par des experts, puis mettre en place tables, sécurité, publications versionnées et interface S2-04. Ne pas confondre la grille de référence S2-03 avec la production des scores et feedbacks (Sprint 3).

## Expansion du corpus : 120 questions en brouillon

- `rh_questions_expansion.json` : 40 nouvelles questions RH générées par IA, revue en attente.
- `technical_questions_expansion_part1.json` : 38 nouvelles questions Software, Data et Cloud, revue en attente.
- `technical_questions_expansion_part2.json` : 22 nouvelles questions Cybersecurity, QA et Business Analysis, revue en attente.
- `scripts/validate_question_bank.py` : vérification structurelle de l'ensemble des 120 questions.

Voir [le rapport de couverture et réserves](../../docs/S2-03_120_Questions_Status.md). **Ne pas importer automatiquement les brouillons dans un catalogue publié.**
