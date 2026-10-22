# S1-02 — Modèle de données conceptuel v0.1

**Statut : proposition à revoir.** Entités et relations logiques, sans choix de SQL/ORM ni migrations.

## Entités et champs essentiels
| Entité | Champs clés (indicatifs) | Relations / notes |
| --- | --- | --- |
| users | id, auth_subject, email, locale, created_at | identité; emails uniques selon politique |
| role_assignments | id, user_id, role, scope, created_at | candidate, coach, admin; moindre privilège |
| candidate_profiles | id, user_id, target_role, experience_level, goals, locale | profil personnel, propriétaire unique |
| consents | id, user_id, purpose, version, granted_at, revoked_at | historique horodaté; usage et fournisseurs explicités |
| interview_templates | id, title, language, status, version | modèle publiable, version immuable utilisée en session |
| questions | id, template_id, sequence, content, competency, difficulty | banque de questions; adaptativité contrôlée |
| rubric_versions | id, template_id, version, criteria_json, published_at | grille figée pour scoring reproductible |
| interview_sessions | id, candidate_id, template_id, template_version, rubric_version_id, status, started_at, ended_at | une session par tentative; machine à états |
| interview_turns | id, session_id, sequence, question_id, prompt_text, answer_text, started_at, ended_at | réponses/transcripts; accès restreint |
| media_assets | id, session_id, turn_id, kind, private_storage_key, retention_until, deleted_at | aucun média public; séparation du contenu |
| evaluation_runs | id, session_id, rubric_version_id, model_ref, prompt_version, status, created_at | un ou plusieurs runs traçables |
| evaluation_scores | id, run_id, criterion_key, score, rationale, evidence_turn_ids | justification liée à la session |
| coaching_plans | id, candidate_id, evaluation_run_id, status, created_at | recommandations et exercices |
| coaching_requests | id, candidate_id, coach_user_id, status, requested_at | coaching humain optionnel |
| learning_resources | id, title, language, competency, url, review_status | ressources approuvées |
| audit_events | id, actor_user_id, action, entity_type, entity_id, occurred_at, metadata_redacted | journal minimal sans PII brute |

## Cardinalités et invariants
- user 1 -> 0..1 candidate_profile; user 1 -> N role_assignments, consents.
- candidate_profile 1 -> N interview_sessions; template 1 -> N versions/questions.
- interview_session 1 -> N interview_turns; session 1 -> N evaluation_runs; evaluation_run 1 -> N evaluation_scores.
- rubric_version associée à une session et à chaque run; ne jamais réévaluer silencieusement avec une nouvelle version.
- coaching_plan lié à une évaluation spécifique; coaching_request optionnelle.
- Aucun score si session incomplète ou consentement requis absent; état explicite de non-évaluabilité.
- L'identifiant d'authentification externe ne sert pas d'autorisation; contrôles de propriété/role côté API.

## Contrôles à implémenter après validation
- Unicité des séquences de tours par session, des versions de rubric par template.
- Clés étrangères, horodatages UTC, index sur candidate_id/session_id/status et audit.
- Suppression/rétention en cascade **définie explicitement** pour sessions, médias, transcripts, scores et logs.
- Autorisations par rôle et ownership : candidat (ses données), coach (uniquement dossiers assignés/consentis), admin (accès limité et audité).
- Chiffrement, pseudonymisation analytique, exports et effacement; aucune donnée réelle en environnements de test.

## Questions ouvertes pour revue
1. Compte candidat seul ou multi-organisations / multi-tenants dès le POC ?
2. Conservation du média brut nécessaire, ou transcription seule par défaut ?
3. Quelles données le coach humain est-il autorisé à consulter et pendant combien de temps ?
4. Qui publie les rubrics et quel circuit de validation métier ?
5. Quels seuils et métriques définissent un entretien réussi ?
