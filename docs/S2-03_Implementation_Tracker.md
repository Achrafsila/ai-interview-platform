# S2-03 — Pilotage d'implémentation et état réel

**Projet :** AI Interview Platform  
**Date de référence :** 22 octobre 2026  
**Tâche ClickUp :** [S2-03 — Créer banques de questions RH et techniques](https://app.clickup.com/t/123ru7uztgq)  
**Statut :** conception terminée ; corpus pilote préparé ; développement et publication non effectués.

## Décision d'organisation ClickUp

**Ne pas créer de nouvelle tâche principale ni multiplier les sous-tâches.** Garder sous S2-03 les trois sous-tâches existantes :

1. `Conception & spécifications` — achevée.
2. `Intégrer le Markdown dans GitHub` — achevée.
3. `Implémentation & validation` — ouverte : suivre les travaux ci-dessous sous forme de checklist.

### Checklist à copier dans « Implémentation & validation »

- [x] Préparer le corpus pilote de 20 questions et ses grilles.
- [x] Terminer la revue éditoriale des 10 questions RH (RH-001 à RH-010).
- [x] Pré-auditer et corriger par IA les 10 questions techniques (TECH-001 à TECH-010).
- [x] Versionner les JSON pilotes et les comptes rendus dans GitHub.
- [ ] Tester les grilles sur réponses simulées solides/moyennes/insuffisantes et cas N/E.
- [x] Rédiger et versionner en brouillon les 100 questions restantes pour atteindre 50 RH/transverses + 70 techniques (revue qualité en attente).
- [ ] Faire la validation métier finale des questions techniques et du corpus complet.
- [ ] Implémenter migrations, contraintes, statut, publication et historique des versions dans Supabase (selon stack effectivement retenue).
- [ ] Appliquer RLS/autorisations, séparation attendus internes / données candidats, et journalisation.
- [ ] Intégrer catalogue publié au moteur S2-04 par contrat API et tests d'intégration.
- [ ] Exécuter la recette AC-01 à AC-10 et documenter l'exploitation avant clôture de S2-03.

## Frontières avec les autres tâches

- **S2-02 :** données de profil professionnel et objectifs de préparation par défaut.
- **S2-04 :** sélection des questions par simulation, relances et déroulement dynamique ; S2-03 ne pilote pas l'entretien.
- **S3-01 :** grilles d'évaluation opérationnelles versionnées ; S2-03 ne définit ici que les références initiales nécessaires aux questions.
- **S3-02 :** scoring/justifications après entretien ; hors S2-03.
- **S3-03 :** correction et validation experte des scores après entretien ; distinct de la revue humaine des contenus de la banque.

## Traçabilité du corpus pilote

| Livrable | Statut | Référence |
|---|---|---|
| 10 questions RH | Éditorial approuvé, non publiées | `data/question-bank/rh_questions.json` |
| 10 questions techniques | Pré-audit IA effectué, expertise externe à réaliser | `data/question-bank/technical_questions.json` |
| Grilles génériques | Draft ; validation des ancrages/critères à poursuivre | `data/question-bank/evaluation_rubrics.json` |
| Spécification et backlog détaillé | Terminé | `docs/S2-03_Question_Bank_Specification.md` |

**Aucune migration, aucun service applicatif et aucune publication Supabase ne sont réalisés du seul fait de ce commit.**

## Définition de terminé

S2-03 pourra être clôturé quand les questions du périmètre V1 seront importées, revues et publiées de façon contrôlée, versionnées, protégées par autorisations, accessibles par le service S2-04, et que les tests de sécurité et d'intégration auront été validés. Les détails restent dans la spécification S2-03 et ses 15 éléments de backlog, sans ajout de 15 sous-tâches ClickUp.


## Mise à jour — corpus étendu à 120 (22/10/2026)

Les 100 questions complémentaires ont été rédigées et ajoutées au dépôt : 40 RH + 60 techniques ; voir [rapport de lot](S2-03_120_Questions_Status.md) et [validateur](../scripts/validate_question_bank.py). La rédaction est terminée, **pas la validation métier**, ni la publication Supabase. Les relances des nouvelles fiches doivent être spécifiées davantage, et les attendus internes sont pour le moment en français.
