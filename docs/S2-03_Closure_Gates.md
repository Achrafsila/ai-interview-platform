# S2-03 — Plan de clôture vérifiable

**État :** implémentation partielle démontrée dans une PR. Ne pas fermer le parent ClickUp sans les jalons restants.

## Livré et testé
- Corpus : 120 questions `draft`, JSON FR/EN, identifiants uniques.
- Catalogue Python en lecture : filtres, pagination, séparation candidat/évaluateur.
- Modèle PostgreSQL : tables catégories/compétences, questions/versions, grilles, localisations, propositions, audit.
- Fonctions de publication avec garde-fous, immutabilité des versions.
- CI Python et PostgreSQL 16 éphémère : test positif/négatif de publication, migrations exécutées dans une DB de test.
- Contrat d'API proposé : `docs/api/question-bank.openapi.yaml`, **non servi par un endpoint réel**.

## Restant et conditions de validation

| Chantier ClickUp existant | Condition pour cocher « terminé » | Aujourd'hui |
|---|---|---|
| Valider la qualité métier du corpus | 100 nouvelles fiches éditoriales relues, 70 techniques revues par experts ; catégories/relances harmonisées | Ouvert |
| Implémenter les banques dans Supabase | Projet AI Interview dédié approuvé, migrations réellement appliquées, seed/versioning testé | Ouvert |
| Versioning, droits et sécurité | Modèle de rôles, authentification, isolation service, tests multi-rôles RLS et audits | Partiel : modèle testé seulement |
| Connexion banques à S2-04 | API opérationnelle authentifiée, snapshots des versions et tests de contrat consommateur | Ouvert |
| Tests d'intégration complets | CI verte + tests auth/data/S2-04 + recette métier | Partiel : CI Python et DB éphémère |

## Checklist minimum avant la clôture S2-03

1. Désigner un backend et une base propres à AI Interview Platform, sans réutiliser d'autres projets.
2. Valider les aspects réglementaires de traitement et de conservation des réponses de candidats.
3. Revoir et approuver humainement toutes les questions destinées à la publication.
4. Compléter l'API serveur (l'OpenAPI seul ne suffit pas), Auth et règles d'accès selon les rôles.
5. Exécuter migrations/seed sur une base de développement, rejouer tests sécurité et intégration S2-04.
6. Formaliser le Go/No-Go et mettre à jour ClickUp sur preuves.

**Aucune opération Supabase sur Campus Connect ou Mambo CRM n'est autorisée pour ce projet.**


## Avancement vérifié — 22 octobre 2026 (PR #41 fusionnée)

| Tâche ClickUp | Travaux réalisés et preuves | Statut de clôture recommandé |
|---|---|---|
| Configurer versioning, droits d'accès et sécurité | Versions publiées immuables, triggers SQL, RLS sur 10 tables, `anon/authenticated` sans accès direct, service Supabase `question-bank` actif avec `verify_jwt=true`, `auth.getUser` et rôles serveur `app_metadata.ai_interview_role`; CI 4/4 jobs réussis sur PR #41 | **Implémentation achevée pour POC**, validation d'autorisations avec de vrais utilisateurs de test encore ouverte |
| Exécuter tests d'intégration et valider fonctionnalité | Test de migration/seed sur PostgreSQL éphémère, vérification des projections privées, tests adaptateur Node, typecheck Deno, 120 drafts non publiés ; nouveau test SQL positif sur projection publiée synthétique ajouté sur `main` | **Partiel** : absence de test réel HTTP Auth/JWT/S2-04 et du parcours complet, nouveau test SQL à confirmer CI |
| Connecter les banques au moteur S2-04 | Endpoint serveur déployé : liste des versions publiées, snapshot par question versionnée, référence évaluateur ; adaptateur `src/integrations/s2-04/question-bank-client.mjs` versionné, tests unitaires réussis | **Contrat et connecteur livrés**, moteur de simulation S2-04 absent : tâche à garder ouverte pour intégration réelle |

L'Edge Function active est [question-bank](https://supabase.com/dashboard/project/aqybktqgoartjiqoqcfg/functions) et son contrat est documenté dans [S2-03_S2-04_Integration.md](S2-03_S2-04_Integration.md). Les données réelles restent **120 drafts, 0 publication**, ce qui empêche une recette fonctionnelle positive sur les questions du corpus sans validation humaine.

### Critères de clôture restants mesurables

- Définir des identités de test validées (candidat, interview_engine, evaluator), tester vrais JWT avec succès/refus attendus, et révoquer ces droits ensuite.
- Réaliser une simulation complète S2-04 avec version et snapshot persistant (question_version_id, rubric_version_id, locale, prompt) et rejouer une session.
- Obtenir validation métier humaine des questions effectivement publiées ; ne pas promouvoir artificiellement des questions du corpus pour faciliter les tests.
- Refaire les tests de non-divulgation côté navigateur et le Go/No-Go de la recette complète.

**Ce fichier indique les preuves techniques, pas une mise à jour effective dans ClickUp.**
