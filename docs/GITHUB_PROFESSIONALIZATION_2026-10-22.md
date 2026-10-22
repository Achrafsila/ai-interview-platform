# Professionnalisation GitHub — Rapport de mise en place

**Date :** 22 octobre 2026  
**Référentiel :** `Achrafsila/ai-interview-platform` · branche `main`  
**Nature :** organisation et outillage du dépôt documentaire/POC. Ce travail n'est pas une implémentation de la plateforme.

## Modifications effectivement déployées dans GitHub

| Zone | Fichiers / changements | Objectif |
|---|---|---|
| Point d'entrée | `README.md`, `docs/README.md`, `docs/PROJECT_STATUS.md` | Navigation simple, état vérifiable, liens |
| Collaboration | `docs/REPO_GOVERNANCE.md`, `docs/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md` | Responsabilités, PR, tests et changement documenté |
| Tickets GitHub | `.github/ISSUE_TEMPLATE/{config,bug_report,engineering_task,question_review}.yml` | Défauts et travaux techniques liés à ClickUp |
| Configuration | `.editorconfig`, `.gitattributes`, `.gitignore` | Fichiers cohérents, secrets et artefacts exclus |
| Automatisation | `.github/workflows/question-bank-validation.yml`, `.github/dependabot.yml` | Déclenchement des contrôles du corpus et maintenance actions |
| Qualité | `tests/test_question_bank.py`, `scripts/validate_question_bank.py` | Test de structure, couvertures, statuts, localisations, grilles |
| Décisions et releases | `docs/DECISIONS.md`, `docs/ADR_TEMPLATE.md`, `CHANGELOG.md`, `docs/RELEASE_CHECKLIST.md` | Auditabilité et jalons |
| Copilotes IA | `CLAUDE.md` | Références, limites, interdictions de fausses clôtures |
| Sécurité | `docs/SECURITY.md` | Politique cohérente avec le dépôt public |

**Contrôle de présence effectué :** 20 fichiers clés sont bien accessibles sur `main` après publication.

## Ce qui reste à configurer ou vérifier dans l'interface GitHub

1. **Actions :** vérifier dans l'onglet Actions que le workflow `Question bank JSON validation` s'exécute avec succès. Sa présence dans le dépôt n'établit pas l'état d'exécution.
2. **Branche main :** les protections/rulesets n'ont pas été activés pour ne pas créer de blocages ; choisir avec l'équipe les vérifications éventuellement nécessaires.
3. **Sécurité :** vérifier l'activation éventuelle de secret scanning/alertes de vulnérabilités selon les possibilités du compte et du dépôt.
4. **Visibilité :** le dépôt est **public**. Choisir explicitement s'il doit le rester ; ne pas verser d'information interne sensible même si un changement en privé est décidé.
5. **Licence :** aucune licence open source ajoutée. En définir une uniquement après décision du propriétaire sur les droits de réutilisation.
6. **Owners / reviewers :** ne pas inventer de `CODEOWNERS` tant que les rôles et identifiants GitHub ne sont pas confirmés.
7. **Protection release :** définir les environnements et les secrets uniquement après validation de la stack applicative.

## Non inclus dans cette intervention

- Aucun code applicatif, migration Supabase, déploiement frontend ou moteur IA n'a été créé par ce chantier.
- Pas de modification directe de ClickUp ; le connecteur a atteint sa limite d'appels.
- Pas de confirmation d'une CI verte ou d'une politique branch protection active.
- Aucun changement de statut de publication du corpus : les 120 questions restent `draft`.

## Critère de réussite de la professionnalisation

Le dépôt doit permettre à un développeur ou à un agent IA de comprendre l'état du projet en lisant README / docs / CLAUDE, ouvrir un ticket lié au backlog, créer une PR avec preuves, exécuter les validations disponibles, éviter les secrets/données réelles, et garder séparés conception, revue et livraison technique. La configuration manuelle mentionnée ci-dessus reste à arbitrer.
