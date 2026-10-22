# S2-03 — Frontière d'accès privée (Supabase)

**Date :** 22 octobre 2026. **Projet :** `ai-interview-platform` (Paris, `aqybktqgoartjiqoqcfg`).

## Déploiement confirmé

La migration `db/postgres/migrations/0004_private_catalog_boundary.sql` est appliquée au projet dédié.

- Schéma `question_bank` non utilisable par les rôles `anon` et `authenticated`.
- Aucun droit SELECT direct sur les tables internes ni sur la projection candidate-safe.
- Aucun droit EXECUTE pour les fonctions de publication sur les rôles clients.
- Vue `question_bank.published_questions_safe`, `security_invoker=true` et `security_barrier=true`, ne présentant que le prompt FR/EN, identité/version, classification, difficulté et compétence primaire (jamais attendus, notes, réponses de référence).
- La projection exige question courante publiée, approbation métier et grille publiée.
- **Zéro ligne publiée** : les 120 questions sont toujours en `draft`.

## Vérifications SQL exécutées dans Supabase

| Mesure | Résultat |
|---|---|
| Questions `draft` | 120 |
| Questions publiées | 0 |
| Lignes visibles dans `published_questions_safe` | 0 |
| `anon` : accès au schéma / à la vue | Non / non |
| `authenticated` : accès au schéma / à la vue | Non / non |
| `authenticated` : lecture des versions internes | Non |
| `authenticated` : permission de publier | Non |
| Option `security_invoker` de la vue | Activée |

Les contrôles correspondants sont versionnés dans `db/postgres/tests/0002_private_catalog_boundary.sql` et ajoutés au workflow GitHub Actions PostgreSQL avec des rôles de test `anon` et `authenticated` créés dans la base éphémère.

## Ce que ces tests NE démontrent PAS

- Pas de connexion utilisateur Supabase Auth réelle.
- Pas d'API HTTP serveur déployée ni de gestion des identités d'éditeur, relecteur ou évaluateur.
- Pas de flux candidat de S2-04 connecté.
- Pas de possibilité de visualiser des questions dans l'application. Le catalogue reste entièrement inaccessible côté client.
- Pas de certification de la qualité métier du corpus, ni autorisation de publication.

## Prochaine barrière de sécurité

Définir le fournisseur d'authentification, vérifier une identité de service réelle côté serveur, créer une politique d'accès **limitée à la projection sûre** et uniquement après tests d'autorisation. Le contenu interne de notation ne doit être accessible qu'au service évaluateur autorisé, jamais au navigateur. Ne jamais placer une clé secrète ou `service_role` dans une variable frontend.

**La sous-tâche « Configurer le versioning, les droits d'accès et la sécurité » reste ouverte** : la confidentialité initiale est assurée, mais il faut un vrai circuit d'identité/habilitations et des tests de bout en bout.
