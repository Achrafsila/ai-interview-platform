# S2-03 — Extension du corpus à 120 questions

**Date :** 22 octobre 2026  
**Statut :** corpus de référence **rédigé et versionné dans GitHub, non publié et non validé intégralement**.

## Livrables

| Fichier | Questions | Statut |
|---|---:|---|
| `data/question-bank/rh_questions.json` | 10 RH | Approuvées éditorialement, encore draft |
| `data/question-bank/rh_questions_expansion.json` | 40 RH | Générées par IA, revue humaine en attente |
| `data/question-bank/technical_questions.json` | 10 techniques | Pré-auditées par IA, expertise métier en attente |
| `data/question-bank/technical_questions_expansion_part1.json` | 38 techniques | Générées par IA, expertise métier en attente |
| `data/question-bank/technical_questions_expansion_part2.json` | 22 techniques | Générées par IA, expertise métier en attente |
| **Total** | **120** | **Brouillon** |

### Couverture technique

| Famille | Nombre total |
|---|---:|
| Software Engineering | 16 |
| Data & AI | 16 |
| Cloud & DevOps | 12 |
| Cybersecurity | 10 |
| Testing & QA | 8 |
| Business/Functional Analysis | 8 |

## Contrôles appliqués

Contrôle structurel inter-fichiers : 120 codes uniques ; 50 questions RH et 70 techniques ; prompt FR et EN ; au moins deux relances dans chaque langue ; au moins trois éléments attendus en français ; compétence, difficulté L1–L4, grille ; statut draft sans approbation de publication ; pondérations des grilles totales à 100 %. Voir `scripts/validate_question_bank.py` pour reproduction locale.

### Limites importantes

- Les **100 nouvelles questions ont été rédigées par IA et n'ont PAS encore été approuvées par un réviseur humain**.
- Les **relances des 100 nouvelles questions sont des formulations réutilisables et génériques** : elles devront être personnalisées lors d'une revue éditoriale/technique.
- La version anglaise concerne les prompts et relances. Les attendus, risques et consignes d'évaluation sont encore principalement en **français** ; les localiser si le contrat d'exécution l'exige.
- Les codes de catégorie RH devront être alignés à une taxonomie de référence explicite avant les migrations. Les nouvelles entrées utilisent des codes rapprochés du pilote, mais la taxonomie globale reste à normaliser.
- Ni la **calibration des grilles définitives**, ni l'exécution d'un moteur de notation réel, ni la **publication Supabase** ne sont terminées. Les notes tests simulées ne prouvent pas la validité d'un moteur IA.

## Checklist ClickUp recommandée

Sous `S2-03 > Implémentation & validation`, la ligne **« Créer les 100 questions restantes (40 RH + 60 techniques) »** peut être cochée comme **rédaction du corpus en brouillon effectuée**, mais garder **« Valider la qualité métier du corpus complet »** ouverte. Ne pas clôturer S2-03 avant validation, migrations, autorisations, intégration et tests.

## Prochain lot

1. Relecture QA des 40 RH et 60 techniques ; élimination doublons sémantiques, correction de toute erreur factuelle, niveaux et relances spécifiques.
2. Faire valider les familles techniques par des spécialistes ; homologuer les attendus et variantes correctes.
3. Finaliser les grilles à la lumière de la calibration et du périmètre S3-01/S3-02.
4. Revoir l'architecture de dépôt et le contrat de données avant implémentation Supabase et exposition à S2-04.
