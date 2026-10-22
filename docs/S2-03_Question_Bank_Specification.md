# S2-03 — Question Bank : spécification fonctionnelle & technique V1

**Projet :** AI Interview Platform  
**Statut :** conception finalisée pour revue technique ; non implémenté  
**Date :** 22 octobre 2026  
**Décisions confirmées :** socle universel + spécialisations ; modèle C (banque contrôlée + enrichissement IA).

## 1. Objectif et limites

Créer un référentiel de questions RH, transverses et techniques, versionné, bilingue FR/EN, capable d'alimenter le moteur d'entretien S2-04.

S2-03 gère la classification, les questions, leurs formulations localisées, les compétences, les attendus et les rubriques de notation. S2-04 gère le choix des questions pour une simulation donnée, le séquencement, les relances générées en temps réel et la notation des réponses.

**Invariant produit :** une proposition de l'IA ne devient jamais automatiquement une question officielle publiée. Elle passe par revue humaine. Les relances dynamiques d'une simulation ne sont pas publiées automatiquement dans la banque.

### In scope V1
- Taxonomie de questions RH/transverses et spécialisées, extensible.
- 50 questions RH/transverses et 70 techniques comme cible initiale, sous contrôle qualité.
- Langues `fr` et `en` ; niveau L1–L4 ; variantes de formulation lorsque nécessaire.
- Grilles pondérées, versionnées, avec cas non évaluable et justification par preuves.
- Pipeline de proposition IA puis revue humaine et publication.
- Catalogue consommable en lecture par S2-04, avec filtres et provenance/version.
- Seed, tests, migrations et guide de contribution.

### Hors périmètre V1
- Interface d'administration avancée et workflow multi-approbateurs.
- Import CV et offre d'emploi durant l'onboarding (déjà écartés en S2-01).
- Évaluation automatique de candidats : appartenance à S2-04, et seulement comme coaching de simulation.
- Publication automatique de questions proposées par l'IA.
- Questions techniques arbitraires de tous les secteurs dès la V1.

## 2. Taxonomie

**Familles** : `rh`, `transversal`, `technical`.  
**RH** : parcours/préparation, motivation/projet, communication, collaboration, résolution de problèmes, adaptabilité/apprentissage, organisation, leadership/conflits, situations comportementales.  
**Transversal** : raisonnement analytique, priorisation, communication professionnelle, résolution structurée, apprentissage.  
**Techniques (premier lot)** : Software Engineering, Data & AI, Cloud & DevOps, Cybersecurity, Testing & QA, Business/Functional Analysis.  
**Niveaux de difficulté** : L1 fondamentaux, L2 application, L3 analyse, L4 conception/arbitrage expert. Difficulté et séniorité sont des dimensions distinctes.  
**Types de questions** : introductory, motivational, behavioral, situational, conceptual, practical, case_study.  
**Compétences** : dictionnaire unique avec codes durables, potentiellement plusieurs compétences par question (une principale, plusieurs secondaires).

## 3. Modèle relationnel proposé

> Les noms exacts doivent être alignés à la convention déjà appliquée dans le dépôt avant migration. Les contraintes ci-dessous sont le contrat logique.

### Tables de référence

**`question_categories`**
- `id uuid PK`, `code text UNIQUE NOT NULL`, `name text NOT NULL`, `family text NOT NULL CHECK IN ('rh','transversal','technical')`, `parent_id uuid NULL FK self`, `active boolean NOT NULL DEFAULT true`, `created_at timestamptz`.
- La hiérarchie parent/enfant supporte des spécialités sans migration de table.

**`competencies`**
- `id uuid PK`, `code text UNIQUE NOT NULL`, `name text NOT NULL`, `description text`, `active boolean DEFAULT true`.

**`questions`** — identité stable, indépendamment des révisions
- `id uuid PK`, `code text UNIQUE NOT NULL`, `category_id uuid NOT NULL FK`, `question_type text NOT NULL`, `difficulty smallint NOT NULL CHECK BETWEEN 1 AND 4`, `status text NOT NULL CHECK IN ('draft','in_review','published','archived')`, `current_published_version_id uuid NULL`, `origin text NOT NULL CHECK IN ('human','ai_proposal')`, `created_by uuid NULL`, `created_at`, `updated_at`.
- L'attribut `origin` décrit la provenance du contenu, pas une permission de publication.
- La colonne `current_published_version_id` référence `question_versions.id` avec contrainte différée ou validation applicative transactionnelle pour éviter une dépendance circulaire à l'insertion.

**`question_versions`** — versions immuables du contenu publié
- `id uuid PK`, `question_id uuid NOT NULL FK`, `version_no integer NOT NULL`, `status text NOT NULL CHECK IN ('draft','in_review','published','archived')`, `rubric_version_id uuid NOT NULL FK`, `expected_elements jsonb NOT NULL`, `level_guidance jsonb NULL`, `source_notes text NULL`, `reviewed_by uuid NULL`, `reviewed_at timestamptz NULL`, `published_at timestamptz NULL`, `created_at timestamptz`, UNIQUE(`question_id`,`version_no`).
- La publication exige localisation FR + EN, au moins une compétence principale et une grille valide.
- Une version publiée est **immuable**. Une correction crée une nouvelle version.

**`question_localizations`**
- `id uuid PK`, `question_version_id uuid NOT NULL FK`, `locale text NOT NULL CHECK IN ('fr','en')`, `prompt text NOT NULL`, `followup_seeds jsonb NOT NULL DEFAULT '[]'`, `acceptable_variations jsonb NOT NULL DEFAULT '[]'`, UNIQUE(`question_version_id`,`locale`).
- Les attendus factuels de base sont non localisés si exprimés en codes structurés ; leurs formulations rédigées peuvent être placées dans les localisations.

**`question_competencies`**
- `question_version_id uuid NOT NULL FK`, `competency_id uuid NOT NULL FK`, `is_primary boolean DEFAULT false`, PRIMARY KEY (`question_version_id`,`competency_id`).
- Index unique partiel garantissant au plus une compétence principale par version ; la validation de publication en exige une.

### Évaluation

**`evaluation_rubrics`** — identité des rubriques (ex. `RH_GENERAL`, `TECH_GENERAL`).
- `id uuid PK`, `code text UNIQUE NOT NULL`, `name text`, `domain text CHECK IN ('rh','transversal','technical')`.

**`rubric_versions`** — version figée de la grille
- `id uuid PK`, `rubric_id uuid NOT NULL FK`, `version_no integer NOT NULL`, `status text NOT NULL CHECK IN ('draft','published','archived')`, `criteria jsonb NOT NULL`, `scale jsonb NOT NULL`, `published_at timestamptz`, UNIQUE(`rubric_id`,`version_no`).
- `criteria`: tableau de `{code,label,weight,description,anchors}` ; poids de critères applicables = 100 ; score 1–5 ; `not_evaluable` exclut le critère du dénominateur et produit un avertissement de couverture.
- Exemple RH : pertinence 25 %, structure 25 %, éléments probants 20 %, recul 20 %, communication 10 %.
- Exemple TECH : exactitude 35 %, raisonnement 30 %, application 20 %, justification 10 %, clarté 5 %.
- Il faut définir une couverture minimale pour publier un score global (proposition : >= 60 % des poids évaluables), à confirmer avec S2-04.

### Enrichissement IA

**`question_proposals`**
- `id uuid PK`, `proposal_payload jsonb NOT NULL`, `target_category_id uuid FK`, `origin text NOT NULL DEFAULT 'ai'`, `model_metadata jsonb NULL`, `status text NOT NULL CHECK IN ('proposed','in_review','approved','rejected','promoted')`, `reviewer_id uuid NULL`, `review_notes text NULL`, `promoted_question_id uuid NULL`, `created_at`, `reviewed_at`.
- La génération n'écrit que dans `question_proposals`. La promotion en question publiable exige revue, contrôles qualité et création explicite d'une question / version. `approved` n'équivaut pas à `published`.
- Ajouter protection anti-doublons sur code et contrôle de similarité sémantique lors de la revue (non bloquant techniquement en V1).

### Traçabilité d'usage S2-04 (contrat d'intégration, implémentation côté moteur)

Une simulation retient `question_id`, `question_version_id`, `rubric_version_id`, `locale` et un snapshot minimum du prompt réellement posé. La suppression physique d'une version référencée est interdite ; on archive. Les relances dynamiques sont conservées au niveau de la simulation, non dans le référentiel.

## 4. États et transitions

- `draft -> in_review -> published -> archived`.
- Rejet de revue : retour en `draft` avec commentaire.
- Révision d'une version publiée : créer une nouvelle version `draft` ; l'ancienne publiée reste accessible pour l'historique.
- Questions IA : `proposed -> in_review -> approved/rejected -> promoted`. Passage `promoted` uniquement après création contrôlée de question, qui suit elle-même son cycle de publication.
- Seules des versions de questions et rubriques publiées sont distribuées au moteur, sauf environnement de test autorisé.

## 5. Règles de sélection et évaluation (contrat avec S2-04)

Le catalogue expose par question : IDs/version, famille/catégorie, compétences, type, difficulté, FR/EN, attendus, relances de référence, rubrique/version, origine. Filtres sur famille, catégorie, spécialité, compétence, type, difficulté, langue et état publié. Prévoir pagination stable et ordre déterministe.

Les objectifs professionnels et objectifs de préparation par défaut proviennent de S2-01. Les changements propres à la simulation ne modifient pas le profil candidat. S2-04 choisit le mix RH/technique et les relances à partir de ces paramètres et de la configuration de simulation ; S2-03 ne prend pas les décisions d'entretien.

Score de grille : `sum(score_i / 5 * weight_i) / sum(weight_i des critères évaluables) * 100` (les poids sont exprimés en % et le score est d'abord normalisé en une moyenne pondérée) ; pas de score si couverture trop faible. Une note est accompagnée d'éléments observables, pas d'une simple valeur brute. Les réponses alternatives techniquement valables restent acceptables.

> Clarification mathématique : avec tous critères évaluables et un total de poids de 100, le score sur 100 est `sum((score_i / 5) * weight_i)`. Si des critères sont non évaluables, renormaliser par la somme des poids évaluables, par exemple `100 * sum((score_i / 5) * weight_i) / sum(weight_i évaluables)`.

## 6. Sécurité et gouvernance

- Lecture publique uniquement des **versions publiées** destinées à la simulation, via API serveur authentifiée et autorisée ; ne pas exposer les réponses attendues / ancres au navigateur candidat.
- Création, revue, publication et archivage : rôles administrateur/éditeur désignés, jamais rôle candidat.
- RLS et service-role server-side configurés selon l'architecture Supabase retenue ; aucune clé service-role dans le client.
- Stocker seulement le minimum de métadonnées de génération IA ; pas de CV ni de données personnelles de candidat dans les propositions.
- Audit des changements de statut/publication (qui, quand, quelle version).
- Éviter de présenter une note de coaching comme décision automatisée de recrutement.

## 7. Backlog d'implémentation

| ID | Livrable / tâche | Dépendances | Done / test |
|---|---|---|---|
| S2-03.01 | Valider dictionnaires familles, catégories, spécialisations, types et compétences | — | Codes stables, aucune collision, L1–L4 documentés |
| S2-03.02 | Définir contrat API S2-03 vers S2-04 | .01 | OpenAPI/types et exemples FR/EN, filtres/pagination |
| S2-03.03 | Migration tables référentielles + FK/index | .01 | Migration locale réexécutable, contraintes testées |
| S2-03.04 | Migration rubriques/grilles/versioning | .03 | 2 rubriques exemplaires, poids validés, immutabilité |
| S2-03.05 | Migration pipeline de propositions IA + audit | .03 | États et transitions autorisés testés |
| S2-03.06 | RLS / autorisations lecture et écriture | .03–.05 | Candidat n'accède ni drafts ni attendus ni propositions |
| S2-03.07 | Seed catégories, compétences et grilles | .03–.04 | Réexécutable sans doublons |
| S2-03.08 | Rédiger et réviser 50 questions RH/transverses | .01, .07 | FR/EN, attendus et relances, QC échantillonné |
| S2-03.09 | Rédiger et réviser 70 questions techniques (6 familles) | .01, .07 | FR/EN, réponses alternatives, exactitude métier vérifiée |
| S2-03.10 | Script de validation du corpus | .08–.09 | Aucun champ obligatoire vide, poids 100, pas de code dupliqué |
| S2-03.11 | API interne lecture catalogue publié | .02–.06 | Filtres, pagination, version stable, tests accès |
| S2-03.12 | Générateur de propositions IA (non publication) | .05–.06 | Sortie strictement `question_proposals`, logs minimaux |
| S2-03.13 | Workflow revue/promotion/archivage (service ou UI simple) | .05, .12 | Publication impossible sans validation humaine |
| S2-03.14 | Contrat de snapshot utilisé par S2-04 | .02, .11 | Identifiants de version persistés dans simulation test |
| S2-03.15 | Tests intégration, sécurité et documentation d'exploitation | toutes | Recette AC-01 à AC-10 documentée |

**Ordre recommandé :** .01/.02 → .03/.04/.05/.06 → .07 → .08/.09/.10 → .11 → .12/.13 → .14/.15.

## 8. Critères de recette transversaux

1. Toutes les questions publiées ont un code unique, une localisation FR/EN, une difficulté L1–L4, un type, au moins une compétence principale et des attendus.
2. Les questions techniques admettent des variantes de réponses correctes ; les questions RH ne survalorisent pas le parcours professionnel ou des résultats chiffrés.
3. Les grilles ont des poids totalisant 100 %, des ancres de score, une version publiée et une prise en charge N/E.
4. Une question proposée par l'IA n'est ni publiée ni exposée à S2-04 avant approbation humaine et publication explicite.
5. Une modification d'une question publiée crée une version nouvelle ; une simulation passée garde son référentiel d'origine.
6. L'API n'expose pas les réponses attendues au client candidat et protège les brouillons/propositions.
7. Un test permet de récupérer un corpus publié en FR et EN, filtré par catégorie, difficulté et compétence.
8. Le corpus passe les validations automatisées (unicité, complétude, version, poids, structure des JSON).
9. Les essais de notation conservent des éléments observables et distinguent N/E d'une réponse incorrecte.
10. Les changements de statut et la publication sont journalisés.

## 9. Arbitrages techniques à confirmer avant migration

- Conventions exactes de tables, schéma, migrations, migrations existantes et organisation Supabase du dépôt.
- Identité et droits de l'éditeur/relecteur (outil interne V1).
- Seuil minimal de poids évaluables pour produire un score global (proposition 60 %).
- Répartition fine des 70 questions techniques entre les six familles selon la priorité produit.
- Modalité d'accès moteur : appel serveur/RPC ou endpoint interne, et contrat d'authentification.

**Statut réel :** conception et backlog formalisés. Aucun déploiement, migration, issue GitHub ou tâche ClickUp n'est prétendu effectué par ce document.

---

## 10. Registre de décisions — clôture de la conception produit

| Référence | Décision | Statut |
|---|---|---|
| D-01 | Socle universel + spécialisations métiers | VALIDÉ |
| D-02 | Modèle C : banque contrôlée, enrichissement IA soumis à revue humaine | VALIDÉ |
| D-03 | S2-03 fournit le référentiel, S2-04 conduit et adapte l'entretien | VALIDÉ |
| D-04 | FR et EN ; difficultés L1–L4 séparées de la séniorité | VALIDÉ dans la conception V1 |
| D-05 | Grilles pondérées avec justification et option N/E | VALIDÉ dans la conception V1 |
| D-06 | Historisation des versions publiées, pas de suppression physique si utilisées | VALIDÉ dans la conception V1 |
| D-07 | 120 questions (50 RH/transverses, 70 techniques) | CIBLE DE LIVRAISON PROPOSÉE, non corpus déjà rédigé |
| D-08 | Seuil de couverture évaluée de 60 % | PROPOSITION TECHNIQUE à tester avec S2-04 |
| D-09 | S2-03 documenté ici sans créer de sous-tâches ClickUp | VALIDÉ |

**Fin de conception fonctionnelle :** la direction produit et les limites du module sont arrêtées. Les choix liés aux conventions SQL, aux politiques d'accès effectives et au seuil de couverture sont à figer lors de la revue technique sur dépôt, avant migrations.

## 11. Répartition du corpus de référence (cible, pas contenu déjà disponible)

### 11.1 Banque RH et transversale (50)

| Domaine | Nombre cible |
|---|---:|
| Présentation, parcours et synthèse | 6 |
| Motivation, projet et objectifs professionnels | 6 |
| Communication et collaboration | 7 |
| Résolution de problèmes, décisions | 7 |
| Adaptabilité et apprentissage | 6 |
| Organisation, autonomie et priorités | 6 |
| Leadership, influence et conflits | 6 |
| Mises en situation et raisonnement transversal | 6 |
| **Total** | **50** |

### 11.2 Banque technique (70)

| Domaine | Nombre cible | Couverture minimale |
|---|---:|---|
| Software Engineering | 16 | APIs, backend/frontend, conception, diagnostic |
| Data & AI | 16 | SQL, qualité des données, pipeline, ML de base |
| Cloud & DevOps | 12 | systèmes, cloud, CI/CD, incident |
| Cybersécurité | 10 | fondamentaux, IAM, incidents, sécurité applicative |
| Testing & QA | 8 | niveaux de test, conception de cas, priorisation |
| Business & Functional Analysis | 8 | cadrage besoins, processus, critères d'acceptation |
| **Total** | **70** | |

**Exigence éditoriale :** dans chaque famille technique, rechercher plusieurs difficultés et types de questions ; ne pas forcer la présence d'un L4 si la spécialité n'a pas encore d'ancres d'évaluation fiables. Pour chaque question : FR, EN, attendus, variantes de bonnes réponses, critères et relances. Les questions RH doivent permettre des exemples universitaires, associatifs ou personnels pour les débutants.

## 12. Exemples de questions de départ à enrichir

Les questions suivantes sont des **prototypes éditoriaux**, non des entrées déjà enregistrées dans Supabase. Leur traduction, leurs attendus et leurs grilles doivent être complétés avant publication.

| Code provisoire | Famille | Question FR | Compétence | Difficulté |
|---|---|---|---|---|
| RH-001 | RH | Pouvez-vous vous présenter et résumer votre parcours ? | Synthèse | L1 |
| RH-002 | RH | Pourquoi ce poste vous intéresse-t-il ? | Motivation | L1 |
| RH-003 | RH | Quel accomplissement vous rend particulièrement fier ? | Réflexivité | L2 |
| RH-004 | RH | Racontez une situation où vous avez dû résoudre un problème difficile. | Résolution de problèmes | L2 |
| RH-005 | RH | Décrivez un désaccord avec une personne de votre équipe. Comment l'avez-vous géré ? | Collaboration | L2 |
| RH-006 | RH | Comment réagissez-vous face à des priorités qui changent soudainement ? | Adaptabilité | L2 |
| RH-007 | RH | Parlez-moi d'une erreur que vous avez commise et de ce que vous en avez appris. | Apprentissage | L2 |
| RH-008 | RH | Comment organisez-vous votre travail lorsque plusieurs échéances se chevauchent ? | Priorisation | L2 |
| RH-009 | RH | Décrivez une situation où vous avez dû convaincre quelqu'un. | Influence | L3 |
| RH-010 | RH | Qu'aimeriez-vous avoir développé professionnellement dans trois ans ? | Projection | L1 |
| TECH-001 | Software | Quelle différence entre authentification et autorisation ? | Sécurité applicative | L1 |
| TECH-002 | Software | Comment investigueriez-vous une API présentant des temps de réponse élevés ? | Diagnostic | L3 |
| TECH-003 | Data | Quelle différence entre INNER JOIN et LEFT JOIN en SQL ? | SQL | L1 |
| TECH-004 | Data | Comment vérifieriez-vous la qualité des données d'un pipeline ETL ? | Qualité des données | L2 |
| TECH-005 | Data & AI | Comment identifier un risque de surapprentissage d'un modèle de machine learning ? | Modélisation | L2 |
| TECH-006 | Cloud | Expliquez les avantages et limites de la conteneurisation. | Conteneurs | L2 |
| TECH-007 | DevOps | Comment géreriez-vous un déploiement ayant provoqué une régression en production ? | Gestion d'incident | L3 |
| TECH-008 | Cyber | Quelle différence entre chiffrement, hachage et encodage ? | Fondamentaux sécurité | L1 |
| TECH-009 | Cyber | Comment traiteriez-vous une alerte de connexion suspecte ? | Réponse à incident | L3 |
| TECH-010 | QA | Quelle différence entre tests unitaires, d'intégration et end-to-end ? | Stratégie de test | L1 |
| TECH-011 | QA | Comment prioriseriez-vous les tests lorsque le temps de recette est limité ? | Risque QA | L2 |
| TECH-012 | Business Analysis | Comment transformer un besoin métier ambigu en exigences testables ? | Analyse fonctionnelle | L2 |

### Exemple de contrat éditorial sur RH-004

- **Question FR :** « Racontez une situation où vous avez dû résoudre un problème difficile. Comment l'avez-vous résolu ? »
- **Question EN :** “Tell me about a difficult problem you faced. How did you solve it?”
- **Attendus :** contexte précis ; rôle du candidat ; options envisagées ; action ; résultat ou apprentissage.
- **Relances FR :** « Quel a été votre rôle personnel ? », « Quelle alternative avez-vous écartée ? », « Que feriez-vous différemment ? »
- **Acceptation :** un exemple académique est recevable ; une conclusion sans indicateur chiffré n'est pas automatiquement pénalisée.
- **Grille :** RH_GENERAL ; le système doit éviter de confondre aisance orale avec compétence de résolution.

## 13. Contrat API logique (à adapter à la stack existante)

### 13.1 Lecture moteur (serveur vers serveur)

`GET /internal/question-bank/questions?locale=fr&family=technical&category=software&difficulty=2&limit=20&cursor=...`

Exemple minimal de réponse conceptuelle :

```json
{
  "items": [
    {
      "question_id": "uuid",
      "question_version_id": "uuid",
      "code": "TECH-001",
      "family": "technical",
      "category_code": "software",
      "difficulty": 1,
      "question_type": "conceptual",
      "locale": "fr",
      "prompt": "Quelle différence entre authentification et autorisation ?",
      "competency_codes": ["application_security"],
      "rubric_version_id": "uuid"
    }
  ],
  "next_cursor": null
}
```

L'API **interne de notation**, distincte de la réponse affichable au candidat, peut inclure les attendus et ancres nécessaires au moteur évaluateur. Ne jamais inclure ces éléments dans la charge renvoyée à l'interface candidat.

### 13.2 Proposition IA (édition uniquement)

`POST /internal/question-bank/proposals` reçoit famille, spécialité, compétences, difficulté cible et besoin pédagogique. Réponse : identifiant de proposition et état `proposed` ; **aucune création directe de version publiée**.

### 13.3 Promotion/publication

Une action autorisée de validation transforme une proposition en brouillon de question, après détection des doublons ; la publication reste une opération explicite avec vérification transactionnelle des préconditions. Journaliser auteur, relecteur, horodatage et version.

### 13.4 Contrat avec les objectifs S2-01

S2-01 conserve les objectifs professionnels principaux et les objectifs de préparation par défaut. S2-04 reçoit les éventuelles adaptations de session sans modifier le profil permanent. La banque offre des tags de compétences ; elle ne modifie jamais ces préférences.

## 14. Backlog détaillé, à conserver dans ce document (sans synchronisation ClickUp)

### Lot A — Fondations

**S2-03.01 — Taxonomie** (P0)
- Définir les trois familles, les catégories, leurs codes, les compétences et la profondeur hiérarchique.
- Livrable : dictionnaires contrôlés + jeu d'exemples.
- Terminé si : codes uniques, hiérarchies cohérentes, L1–L4 et types documentés.

**S2-03.02 — Contrat S2-03 ↔ S2-04** (P0 ; dépend .01)
- Spécifier filtres, pagination, données exposées au moteur, données cachées au client, snapshot et erreurs API.
- Livrable : types validés + exemples de payloads FR/EN.
- Terminé si : S2-04 peut sélectionner par compétence/type/difficulté/langue sans connaître le schéma SQL.

**S2-03.03 — Migrations du référentiel** (P0 ; dépend .01)
- Créer catégories, compétences, questions, versions, localisations, liens de compétences, index, clés étrangères.
- Livrable : migrations réversibles selon conventions du dépôt et tests de contraintes.
- Terminé si : unicité, intégrité référentielle et hiérarchie sont vérifiées.

### Lot B — Données, sécurité et versioning

**S2-03.04 — Rubriques et versioning** (P0 ; dépend .03)
- Créer rubriques, versions, critères et ancres de notation ; verrouiller les versions publiées.
- Livrable : RH_GENERAL et TECH_GENERAL en versions testées.
- Terminé si : poids = 100 et modification de version publiée rejetée.

**S2-03.05 — Propositions IA et audit** (P0 ; dépend .03)
- Stocker propositions, provenance, états de revue et événements d'audit.
- Livrable : tables/états/transition log.
- Terminé si : impossible d'obtenir un `published` depuis un contenu simplement `proposed`.

**S2-03.06 — Autorisations et RLS** (P0 ; dépend .03–.05)
- Définir rôles techniques (candidate, service, editor, reviewer, admin) selon auth existante.
- Livrable : politiques serveur et tests positifs/négatifs.
- Terminé si : aucun brouillon, proposition ou attendu interne n'est accessible au candidat.

**S2-03.07 — Seeds** (P0 ; dépend .03–.04)
- Initialiser catégories, compétences, grilles publiables et référentiels de difficulté.
- Livrable : script idempotent et données de base.
- Terminé si : double exécution sans duplication.

### Lot C — Production des contenus

**S2-03.08 — 50 questions RH/transverses** (P0 ; dépend .01/.07)
- Rédiger, traduire et contrôler les 50 entrées ; inclure variantes juniors.
- Livrable : corpus versionné FR/EN et attendus/relances.
- Terminé si : 50 fiches complètes approuvées et importables.

**S2-03.09 — 70 questions techniques** (P0 ; dépend .01/.07)
- Rédiger par six familles, avec relecture d'exactitude métier et réponses alternatives valables.
- Livrable : 70 fiches FR/EN, rubriques et exemples de correction.
- Terminé si : 70 fiches complètes approuvées et importables.

**S2-03.10 — Validation automatique du corpus** (P0 ; dépend .08/.09)
- Tester schémas JSON, champs requis, doublons de codes, localisations, ancres et poids.
- Livrable : validation en CI ou script de test.
- Terminé si : aucun échec sur corpus candidat à publication.

### Lot D — Services métier et enrichissement IA

**S2-03.11 — API lecture catalogue** (P0 ; dépend .02/.06)
- Implémenter lecture filtrée et paginée, uniquement versions publiées.
- Livrable : endpoints internes et tests d'autorisation.
- Terminé si : recherches stables en FR/EN, sans divulgation d'attendus au candidat.

**S2-03.12 — Générateur de propositions IA** (P0 ; dépend .05/.06)
- Produire une proposition structurée ; valider syntaxe et champs ; enregistrer métadonnées minimales.
- Livrable : service de génération sans droits de publication.
- Terminé si : sortie stockée uniquement dans la file de propositions.

**S2-03.13 — Revue/promotion/archivage** (P0 ; dépend .05/.12)
- Prévoir un point d'administration simple (UI minimale ou commandes protégées), validation/rejet, promotion et audit.
- Livrable : workflow sécurisé et documentation opératoire.
- Terminé si : reviewer autorisé obligatoire et publication transactionnelle contrôlée.

### Lot E — Intégration et assurance qualité

**S2-03.14 — Snapshot vers S2-04** (P0 ; dépend .02/.11)
- Persister question_id, version_id, rubric_version_id, locale et texte effectivement posé dans une simulation test.
- Livrable : interface d'intégration vérifiée.
- Terminé si : un changement ultérieur de question ne modifie pas la simulation passée.

**S2-03.15 — Recette, sécurité, exploitation** (P0 ; dépend des autres)
- Tester sécurité, publication, qualité et régression ; rédiger procédure d'ajout de questions et incidents.
- Livrable : résultats de recette AC-01 à AC-10 et documentation opérationnelle.
- Terminé si : tests passés, limites résiduelles identifiées et arbitrages techniques documentés.

## 15. Matrice de tests de recette (exemples concrets)

| Test | Scénario | Résultat attendu |
|---|---|---|
| T-01 | Publier sans version EN | Publication refusée |
| T-02 | Publier sans compétence principale | Publication refusée |
| T-03 | Publier une grille avec poids à 95 | Publication refusée |
| T-04 | Candidat tente d'accéder aux attendus | Accès refusé, absence de données sensibles |
| T-05 | Un générateur IA propose une question | Statut `proposed` et aucune question publiée |
| T-06 | Un relecteur rejette une proposition | Rejet documenté, jamais distribuée au moteur |
| T-07 | Modifier version déjà publiée | Refus ; création d'une nouvelle version requise |
| T-08 | Relancer deux fois les seeds | Aucun doublon |
| T-09 | Requête FR/EN avec filtres | Questions publiées correspondantes uniquement |
| T-10 | Noter une alternative technique valable | Pas de pénalité due à l'absence de mot-clé attendu |
| T-11 | Critère non évaluable | Couverture explicitée ; pas d'assimilation automatique à 1/5 |
| T-12 | Question archivée utilisée dans ancien entretien | Simulation historique conservée à l'identique |
| T-13 | Question junior avec exemple scolaire | Évaluation recevable et non discriminante |
| T-14 | Publication simultanée concurrente | Une version courante cohérente ; audit de transaction |

## 16. Guide d'utilisation et maintenance

- Toute nouvelle spécialisation commence par un code de catégorie et les compétences correspondantes ; ne pas créer de tables spécifiques à chaque métier.
- Toute nouvelle question entre en `draft` ou `proposed` (si générée par IA), puis reçoit revue technique/éditoriale.
- Les textes et grilles sont versionnés ; toute correction publiée déclenche une nouvelle version.
- Les doublons sémantiques sont signalés à la revue, mais ne remplacent pas une évaluation humaine.
- Les questions et réponses modèles doivent être relues par un expert du domaine ; les explications de l'IA ne sont pas une source d'autorité.
- Les limites d'utilisation des scores de coaching, de la confidentialité et des biais doivent être documentées au niveau S2-04.

## 17. État de clôture et reprise de chantier

**Livré ici :** cadrage complet, décisions produit, schéma logique, contrat API illustratif, cible de corpus, exemples de questions, rubriques, gouvernance, backlog détaillé et tests de recette.

**Non livré à ce stade :** 120 fiches complètes et validées, migrations SQL effectives, services API, tests automatisés exécutés, configuration RLS réelle, intégration au dépôt, enregistrement dans ClickUp. Ces éléments sont volontairement documentés comme travaux d'implémentation, pas comme réalisations déjà effectuées.

**Action suivante dans ce projet :** passer à la revue technique du dépôt puis mettre en œuvre le lot A. La liste des 15 sous-tâches est conservée intégralement **dans ce document uniquement** à la demande de l'utilisateur.