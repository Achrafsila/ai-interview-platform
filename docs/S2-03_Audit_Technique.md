# S2-03 — Audit IA et corrections du corpus technique pilote (TECH-001 à TECH-010)

**Date :** 22 octobre 2026  
**Périmètre :** 10 questions techniques, 6 familles professionnelles  
**Décision d’organisation :** l’assistant effectue la pré-revue complète sans demander validation question par question.  
**Statut réel :** **audit IA terminé ; validation par spécialiste métier et publication non effectuées.**

## Synthèse

Les 10 questions sont **retenues** après vérification conceptuelle et enrichissement ; aucune suppression proposée. Les formulations FR/EN principales ont été **conservées** pour éviter une dérive de périmètre. Les améliorations concernent les attendus, les alternatives acceptables, les erreurs à éviter et les indicateurs de compétence. La relance avancée de TECH-003 a été précisée en FR et EN.

| Code | Domaine | Niveau | Résultat de la pré-revue | Correction principale |
|---|---|---:|---|---|
| TECH-001 | Software / sécurité applicative | L1 | Retenue, enrichie | Identité vs droits, contrôle côté serveur |
| TECH-002 | Diagnostic de performance API | L3 | Retenue, enrichie | Mesure, hypothèses, mitigation et sécurité de production |
| TECH-003 | SQL / jointures | L1 | Retenue, relance corrigée | Multiplicité 1–N, nuances de WHERE et NULL |
| TECH-004 | Qualité des données ETL | L2 | Retenue, enrichie | Fraîcheur, traçabilité, reprise et règles métier |
| TECH-005 | Conteneurisation | L2 | Retenue, enrichie | Noyau partagé, isolation VM, portabilité conditionnelle |
| TECH-006 | Incident de déploiement | L3 | Retenue, enrichie | Premières 15 min, rollback non systématique |
| TECH-007 | Chiffrement / hachage / encodage | L1 | Retenue, enrichie | KDF de mots de passe ; Base64 et SHA simples |
| TECH-008 | Alerte sur compte privilégié | L3 | Retenue, enrichie | Triage factuel, faux positifs, confinement prudent |
| TECH-009 | Priorisation QA | L2 | Retenue, enrichie | Tests fondés sur le risque, possibilité de no-go |
| TECH-010 | Business Analysis | L2 | Retenue, enrichie | Critères d’acceptation vérifiables, métriques contextualisées |

## Contrôles spécifiques

1. **TECH-001 :** Une identité connue n’accorde pas automatiquement un accès à toutes les ressources. RBAC/ABAC acceptés mais non obligatoires.
2. **TECH-002 :** La réduction d’impact peut précéder l’analyse causale approfondie si la production l’exige. Le rollback peut être risqué avec des migrations incompatibles.
3. **TECH-003 :** Un LEFT JOIN peut multiplier les lignes de gauche quand plusieurs lignes à droite correspondent. Les effets de WHERE dépendent du prédicat ; `IS NULL` est un contre-exemple à la généralisation « WHERE transforme toujours LEFT en INNER ».
4. **TECH-004 :** La gestion des données invalides doit préserver traçabilité et reprise ; le traitement des NULL dépend du besoin métier.
5. **TECH-005 :** L’isolation d’un conteneur n’est pas équivalente, par défaut, à une VM. OS/architecture et noyau limitent certains déploiements.
6. **TECH-006 :** Une décision sûre dans les quinze premières minutes prime sur la réalisation d’un postmortem complet.
7. **TECH-007 :** Ne jamais considérer Base64 comme une protection par chiffrement. Ne pas recommander SHA-256 simple pour le stockage des mots de passe.
8. **TECH-008 :** Une alerte n’est pas une preuve de compromission ; conserver les traces, appliquer un confinement proportionné.
9. **TECH-009 :** Deux heures de test ne permettent pas une couverture exhaustive ; documenter le risque résiduel, signaler un éventuel no-go.
10. **TECH-010 :** « Intuitif » doit être traduit en scénarios observables, sans fixer arbitrairement des seuils universels.

## Grille et seuils

- La grille `TECH_GENERAL` est conservée : exactitude 35 %, raisonnement 30 %, application 20 %, justification 10 %, clarté 5 %.
- Les indicateurs propres à chaque question ont été ajoutés dans `competency_indicators_fr` ; exemples de niveaux de réponses dans `review_examples_fr`.
- Pour une question purement conceptuelle L1, ne pas exiger le même niveau d’application pratique ou d’architecture qu’une question L3. Un critère réellement inapplicable doit être **N/E** et la renormalisation/mesure de couverture doit être définie dans S2-04.
- Le seuil de couverture de 60 % reste une **hypothèse** de la spécification, non une décision de notation définitive.
- Un test ultérieur de correction de réponses simulées (faible, moyenne, bonne, atypique mais correcte) est requis avant publication.

## Limites explicites

- Les `expected_elements_fr` et indicateurs sont en français, conformément au schéma pilote existant. Les prompts et relances sont bilingues ; les métadonnées d’évaluation internes devront être localisées séparément si une exploitation bilingue des attendus est exigée.
- Ce document constitue un **audit de cohérence par IA**, pas une vérification par un ingénieur expérimenté de chacune des six familles.
- La suite `validate_corpus.py` vérifie la structure et l’intégrité du corpus, non la justesse métier des réponses.
- Le statut de publication de toutes les questions reste `draft` et `approved_for_publication=false` ; les questions RH déjà approuvées ne sont pas modifiées.
- Aucune écriture dans GitHub, ClickUp ou Supabase n’est faite dans cette étape.

## Étape suivante

Faire valider le référentiel technique par les spécialistes métier, puis tester la cohérence de notation sur des réponses types avant de publier ou d’étendre le corpus à 120 questions. Le même dossier fournit le JSON technique consolidé, le JSON RH validé et les grilles communes.