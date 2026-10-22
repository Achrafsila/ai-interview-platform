# AI Interview Platform

Plateforme d'entraînement aux entretiens d'embauche assistée par l'IA. **Statut : POC en cours, Sprint 1 sur 4.** Aucun choix de stack applicative ni de fournisseur IA n'est encore validé, et aucun code applicatif n'est présent dans ce dépôt.

## Vision produit

Le candidat crée son compte et renseigne son profil (expérience, poste visé, langue, objectifs). Il reçoit ensuite un parcours de préparation adapté. Il passe un entretien IA interactif, idéalement avec avatar vidéo, voix et transcription. Après l'entretien, il obtient une évaluation structurée et explicable, fondée sur une grille versionnée, puis un plan de coaching IA, avec la possibilité de demander un coach humain. Un tableau de bord suit sa progression d'une session à l'autre. Un espace d'administration permet de configurer les parcours, les questions, les grilles d'évaluation et les contenus. Le produit cible le français et l'anglais.

**Hors périmètre.** La plateforme fournit un retour d'entraînement : elle n'est pas un outil de décision d'embauche automatisée. Aucune intégration ATS, facturation, marketplace de coachs ou app mobile native n'est prévue par défaut. Le POC n'autorise pas la collecte de données réelles de candidats sans cadrage de conformité.

## Feuille de route du POC

| Sprint | Thème | Contenu principal |
| --- | --- | --- |
| 1 | Fondations et faisabilité | Conventions Git, architecture logique, modèle de données, POC fournisseurs avatar / voix / transcription |
| 2 | Parcours candidat | Authentification et rôles, onboarding, sessions d'entretien, première intégration multimodale |
| 3 | Scoring et coaching | Évaluation asynchrone sur grille versionnée, feedback avec preuves, plan de coaching, progression |
| 4 | Admin, qualité, démo | Console d'administration, métriques, durcissement sécurité, tests de bout en bout, Go/No-Go |

## État actuel

| Élément | État |
| --- | --- |
| S1-01 Fondation Git / DevOps | Livré (PR #1) |
| S1-02 Architecture et modèle de données conceptuel | Livré (PR #2), proposition v0.1 à affiner |
| Stack frontend / backend / base de données | Non décidée |
| Fournisseur avatar / voix / transcription | Non validé, POC prioritaire |
| Implémentation applicative | Non démarrée |

La fusion de la PR #2 intègre une proposition d'architecture ; elle ne valide pas les choix de stack, de fournisseurs, d'hébergement ou de conformité.

## Documentation

- [`docs/architecture/POC_ARCHITECTURE.md`](docs/architecture/POC_ARCHITECTURE.md) : composants, parcours, frontières de confiance, résilience, décisions ouvertes.
- [`docs/architecture/DATA_MODEL.md`](docs/architecture/DATA_MODEL.md) : entités, cardinalités, invariants, questions ouvertes.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) : registre des décisions techniques (ADR).
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) : branches, commits, PR, Definition of Done.
- [`docs/SECURITY.md`](docs/SECURITY.md) : règles de sécurité et de confidentialité.

## Organisation du dépôt

```
docs/           Décisions, conventions, sécurité, architecture
.github/        Modèles d'issue et de PR, workflow de vérification
src/, tests/    À créer après validation de l'architecture et de la stack
```

## Contribuer

1. Lire `docs/CONTRIBUTING.md` et `docs/DECISIONS.md`, puis vérifier `main`, les branches et PR ouvertes et le ticket ClickUp concerné.
2. Créer une branche depuis `main` : `feat/`, `fix/`, `chore/` ou `docs/` suivi de l'ID du ticket et du sujet (ex. `docs/S1-03-provider-poc`).
3. Utiliser les Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `ci:`).
4. Ouvrir une Pull Request avec la référence ClickUp, la portée et le plan de test. Les revues et la CI sont recommandées mais ne bloquent pas la fusion.
5. Après intégration, mettre à jour la tâche ClickUp (avec l'accord du Product Owner) et consigner toute nouvelle décision dans `docs/DECISIONS.md`.

Le backlog et le suivi des sprints sont tenus dans ClickUp ; GitHub et ClickUp sont les sources de vérité du projet.

## Sécurité et confidentialité

**Ce dépôt est public.** Ne jamais y versionner de secrets, tokens, identifiants de service, CV, enregistrements, transcriptions ou données de candidats, y compris dans les issues et PR. Les tests et démonstrations utilisent uniquement des données synthétiques. Toute clé divulguée doit être révoquée immédiatement.

## Équipe

| Personne | Rôle indicatif |
| --- | --- |
| Achraf | Sponsor, Product Owner, arbitrages métier |
| Othmane | Référent technique : architecture, implémentation, DevOps |
| Mehdi | Contributeur et reviewer technique / produit |

Des copilotes IA (ChatGPT, Claude) assistent l'équipe pour la conception, la documentation et la revue. Les rôles restent à confirmer en équipe.
