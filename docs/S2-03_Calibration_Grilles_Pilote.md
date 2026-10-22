# S2-03 — Calibration des grilles sur réponses simulées

**Date :** 22 octobre 2026  
**Nature :** calibration manuelle illustrée par IA, **pas** test d'un moteur IA implémenté.  
**Sources :** `data/question-bank/rh_questions.json`, `technical_questions.json` et `evaluation_rubrics.json` dans ce dépôt.

## Périmètre

Quatre questions effectivement référencées : **RH-004** (résolution de problèmes), **RH-008** (priorisation), **TECH-002** (diagnostic API lente), **TECH-003** (jointures SQL). Pour chacune, trois réponses fictives ont été analysées : excellente, moyenne, insuffisante.

| Question | Excellente /100 | Moyenne /100 | Insuffisante /100 | Couverture des critères |
|---|---:|---:|---:|---|
| RH-004 | 98,0 | 54,0 | 38,0 | 100 % / 100 % / 100 % |
| RH-008 | 94,0 | 54,0 | 36,0 | 100 % / 100 % / 100 % |
| TECH-002 | 99,0 | 59,0 | 23,0 | 100 % / 100 % / 100 % |
| TECH-003 | 97,0 | 68,9 | 30,0 | 100 % / 90 % / 90 % |

**Formule :** `score = 100 × Σ[(note_i / 5) × poids_i] / Σ(poids évaluables)`. Pour TECH-003, `tradeoffs` est N/E (non évaluable) pour les réponses moyenne et insuffisante, car la question L1 n'exige pas d'arbitrage technique avancé.

**Notation par critère** (ordre RH : pertinence, structure, exemples, recul, communication ; ordre TECH : exactitude, raisonnement, pratique, arbitrages, clarté) :

| Cas | Notes /5 par critère |
|---|---|
| RH-004 excellente / moyenne / insuffisante | 5,5,5,5,4 / 3,3,2,2,4 / 1,3,1,1,5 |
| RH-008 excellente / moyenne / insuffisante | 5,5,5,4,4 / 3,3,2,2,4 / 1,3,1,1,4 |
| TECH-002 excellente / moyenne / insuffisante | 5,5,5,5,4 / 3,3,3,2,4 / 1,1,1,1,4 |
| TECH-003 excellente / moyenne / insuffisante | 5,5,5,4,4 / 4,3,3,N/E,4 / 1,2,1,N/E,4 |

## Résultats et écarts

- **12/12** notes appartiennent aux bandes de référence fictives : excellente 80–100, moyenne 45–79,9, insuffisante 0–44,9. **4/4** questions respectent l'ordre excellent > moyen > insuffisant. Ces seuils sont **des hypothèses de test, non des seuils de recrutement**.
- RH-004 : une réponse confiante mais dénuée de méthode obtient encore 38/100. Renforcer les indicateurs de compétence (causes, options, actions et recul).
- RH-008 : « je ferai tout en travaillant tard » n'est pas une priorisation ; valoriser les arbitrages sous contrainte et la communication des risques.
- TECH-002 : les actions irréversibles ou risquées sans diagnostic doivent être pénalisées même exprimées avec assurance.
- TECH-003 : la grille technique générique sous-évalue la pertinence de réponses courtes mais justes ; envisager une grille conceptuelle dédiée L1, sans exiger de connaissance avancée de SQL.

## Recommandations (non encore appliquées aux rubriques de référence)

1. Conserver provisoirement les grilles RH_GENERAL et TECH_GENERAL en version `draft`.
2. Ajouter des ancrages évaluant la compétence ciblée indépendamment de l'aisance verbale.
3. Concevoir et tester une variante `TECH_CONCEPTUAL_L1` sans critère arbitraire d'architecture.
4. Confirmer le seuil de couverture minimum proposé de 60 % et la logique N/E avec S2-04 / S3-01.
5. Ajouter des tests « fluide mais faux », « court mais exact », « résultat partiel mais bon raisonnement » ; valider à l'aveugle avec au moins deux relecteurs.
6. Rejouer les 12 cas sur le véritable moteur de notation **après** implémentation S3-02.

## Statut opérationnel

**Calibration sur papier réalisée**, calculs vérifiés ; **validation finale des grilles et test réel du moteur non effectués**. Ne pas interpréter les 12 résultats comme une mesure de précision du futur moteur IA. Le corpus demeure en `draft` et non publié dans Supabase.
