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
