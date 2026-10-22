# S2-03 — Matrice de contrôle métier du corpus complet

**Date :** 22 octobre 2026 · **Statut :** pré-audit automatisé, NON validation métier.

## Diagnostic

- **120 questions** (50 RH, 70 techniques) présentes en GitHub et en Supabase sous statut `draft`.
- **60 questions** utilisent des relances FR génériques à personnaliser selon la compétence testée.
- **120 questions** ne contiennent pas d'attendus explicites `expected_elements_en`. Les prompts EN existent, mais le moteur d'évaluation bilingue exige un choix de localisation.
- **120 questions** sans approbation d'expert métier ; les 10 RH pilotes ont seulement reçu leur revue éditoriale.
- **0 question** approuvée pour publication. La synchronisation ne doit pas modifier ce statut.

## Procédure de validation

Examiner chaque ligne : justesse de fond, adéquation L1–L4, absence de doublons sémantiques, équité, relances dédiées, traduction EN, critères attendus et références techniques si nécessaires. Approbation explicite d'un humain et traçabilité (reviewer, date) avant publication. La case automatique « champs présents » ne vaut jamais approbation métier.

| Code | Domaine | Niveau | Revue éditoriale | Expertise métier | Relances spécifiques FR | Attendus EN | Statut final |
|---|---|---:|---|---|---|---|---|
| RH-001 | parcours | L1 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-002 | motivation | L1 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-003 | realisation | L2 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-004 | resolution | L2 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-005 | collaboration | L2 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-006 | adaptabilite | L2 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-007 | apprentissage | L2 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-008 | priorisation | L2 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-009 | influence | L3 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-010 | projection | L1 | approved | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-011 | parcours | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-012 | parcours | L1 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-013 | parcours | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-014 | parcours | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-015 | parcours | L1 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-016 | motivation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-017 | motivation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-018 | motivation | L1 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-019 | motivation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-020 | motivation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-021 | communication | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-022 | communication | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-023 | communication | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-024 | collaboration | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-025 | collaboration | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-026 | collaboration | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-027 | resolution | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-028 | resolution | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-029 | resolution | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-030 | resolution | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-031 | adaptabilite | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-032 | adaptabilite | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-033 | adaptabilite | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-034 | apprentissage | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-035 | apprentissage | L1 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-036 | priorisation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-037 | priorisation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-038 | priorisation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-039 | influence | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-040 | influence | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-041 | influence | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-042 | influence | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-043 | influence | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-044 | mises_en_situation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-045 | mises_en_situation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-046 | mises_en_situation | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-047 | mises_en_situation | L3 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-048 | mises_en_situation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-049 | mises_en_situation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| RH-050 | mises_en_situation | L2 | pending | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-001 | software | L1 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-002 | software | L3 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-003 | data_ai | L1 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-004 | data_ai | L2 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-005 | cloud_devops | L2 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-006 | cloud_devops | L3 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-007 | cybersecurity | L1 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-008 | cybersecurity | L3 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-009 | testing_qa | L2 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-010 | business_analysis | L2 | ai_reviewed | pending | Présentes (à confirmer) | À décider | **Non approuvé** |
| TECH-011 | software | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-012 | software | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-013 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-014 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-015 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-016 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-017 | software | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-018 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-019 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-020 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-021 | software | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-022 | software | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-023 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-024 | software | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-025 | data_ai | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-026 | data_ai | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-027 | data_ai | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-028 | data_ai | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-029 | data_ai | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-030 | data_ai | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-031 | data_ai | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-032 | data_ai | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-033 | data_ai | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-034 | data_ai | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-035 | data_ai | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-036 | data_ai | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-037 | data_ai | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-038 | data_ai | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-039 | cloud_devops | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-040 | cloud_devops | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-041 | cloud_devops | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-042 | cloud_devops | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-043 | cloud_devops | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-044 | cloud_devops | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-045 | cloud_devops | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-046 | cloud_devops | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-047 | cloud_devops | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-048 | cloud_devops | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-049 | cybersecurity | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-050 | cybersecurity | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-051 | cybersecurity | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-052 | cybersecurity | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-053 | cybersecurity | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-054 | cybersecurity | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-055 | cybersecurity | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-056 | cybersecurity | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-057 | testing_qa | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-058 | testing_qa | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-059 | testing_qa | L1 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-060 | testing_qa | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-061 | testing_qa | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-062 | testing_qa | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-063 | testing_qa | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-064 | business_analysis | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-065 | business_analysis | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-066 | business_analysis | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-067 | business_analysis | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-068 | business_analysis | L3 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-069 | business_analysis | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |
| TECH-070 | business_analysis | L2 | pending | pending | À enrichir | À décider | **Non approuvé** |

## Critères de sortie

- Toutes les corrections métier sont approuvées et commitées dans les JSON.
- Toutes les relances jugées trop génériques sont remplacées par des relances pertinentes et testables.
- Les variantes valides sont indiquées pour éviter les évaluations par simple mot-clé.
- Les différences FR/EN sont revues ; le choix d'utiliser des attendus multilingues ou un référentiel interne unique est acté.
- Chaque question destinée à être publiée est approuvée par un reviewer humain identifiable avec une date de validation.
- Rejouer `python scripts/validate_question_bank.py` et la CI ; ne publier qu'après une décision métier explicite.

**Ce document est une matrice de revue, pas une certification des 120 questions.**