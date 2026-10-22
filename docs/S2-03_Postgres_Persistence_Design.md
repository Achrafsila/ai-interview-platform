# S2-03 — Design de persistance PostgreSQL et publication

**État : code SQL proposé en branche de développement, aucune base réelle modifiée.**

## Domaine de données

| Entité | Utilité | Règle clé |
|---|---|---|
| categories / competencies | Taxonomie et codes stables | FK, code unique |
| rubrics / rubric_versions | Critères et poids versionnés | Référence figée à une version publiée |
| questions / question_versions | Identité stable et contenu historisé | Numéro de version unique, version publiée immuable |
| localizations | Prompts FR/EN et relances | Un texte par langue et version |
| question_competencies | Indicateurs métier, compétence principale | Unicité de la compétence primaire |
| proposals | Contenu IA soumis à revue | Aucun accès au circuit de publication direct |
| audit_events | Traçabilité des validations et changements | Journal minimal sans données candidates |

## Flux de publication attendu

```text
AI-generated proposal (proposed)
       → human review (approved / rejected)
       → draft question / draft version
       → editorial/domain review (reviewed_by + reviewed_at + approval)
       → published rubric version (review + criteria total 100)
       → publisher authorized on server
       → transaction: check FR + EN, expected elements, primary competency,
          approved human review, published rubric and version
       → published question version + current_published_version_id + audit
       → read-only candidate-safe / internal evaluator projections
```

Les fonctions SQL `publish_question` et `publish_rubric` matérialisent les contrôles de données du flux. **Elles ne remplacent pas l'authentification et la vérification des habilitations.** Aucune route HTTP, policy RLS d'application, ni permission cliente ne sont créées ici.

## Invariants sécurité

- Les questions **draft** ou proposées ne sont jamais exposées au candidat.
- Les **attendus, variantes, red flags, ancrages et barèmes** sont privés du moteur/évaluateur serveur.
- Ne jamais rendre le schéma directement consultable depuis le navigateur.
- RLS activée et droits refusés par défaut (aucune policy ni GRANT runtime tant que le fournisseur Auth n'est pas décidé).
- Une version publiée ne doit plus être modifiée ; toute correction passe par une nouvelle version.
- Une session S2-04 doit conserver `question_version_id`, `rubric_version_id`, `locale`, et une copie du prompt réellement posé, indépendamment du catalogue courant.

## Contrat API serveur (proposition, non implémenté)

`GET /internal/question-bank/questions?locale=fr&family=technical&category=software&difficulty=2&limit=20&cursor=...`

Retour prévu `{items, next_cursor}` avec IDs stables, `code`, `version`, `prompt`, langue, catégorie, compétence et difficulté. Les réponses internes doivent être obtenues par un autre endpoint pour un **service évaluateur autorisé** ; le candidat n'obtient jamais le contenu privé. `POST /internal/question-bank/proposals` ne produit qu'une proposition `proposed`.

La version Python locale `scripts/question_bank_catalog.py` utilise un curseur par `code`; la version DB future peut utiliser `code,version` si plusieurs versions publiées sont listées. **La compatibilité du contrat doit être figée avec S2-04.**

## Vérifications avant adoption

1. Exécution des migrations sur PostgreSQL 14+ vide, avec compte de migration isolé.
2. Tests SQL avec comptes distincts (candidat, service lecture, évaluateur, éditeur, approbateur).
3. Tests transactionnels : refus sans reviewer, langue FR/EN manquante, compétence primaire absente, grille non publiée, modification de version publiée.
4. Audit des accès et contrôle du reviewer authentifié et différent de l'auteur, selon décision produit.
5. Paramétrage RLS / GRANT dans le backend réellement retenu, puis déploiement réversible.
6. Intégration au moteur S2-04 et enregistrement du snapshot de session.

**Remarque :** le contrôle statique CI ne démontre pas le bon fonctionnement SQL. Ne pas fusionner comme « migration prête prod » sans environnement de test PostgreSQL.
