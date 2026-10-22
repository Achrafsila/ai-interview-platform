# S2-03 — Catalogue lecture seule (prototype fonctionnel)

## Livré dans cette tranche
- Module Python standard library `scripts/question_bank_catalog.py` chargé à partir du corpus de 120 fiches.
- Filtres `locale`, `family`, `category`, `competency`, `difficulty`.
- Pagination déterministe par `code` et `next_cursor` ; maximum de 100 entrées par page.
- **Triple condition de publication** : question `published`, `review.approved_for_publication=true`, rubrique associée `published`.
- Vue **candidate** limitée au libellé et aux métadonnées sûres ; vue **evaluator** distincte avec attendus/grille et déclaration de rôle de confiance.
- Tests de régression incluant le scénario réel : **les 120 brouillons ne sont accessibles ni comme questions publiées ni comme attendu de correction**.

## Usage local
```bash
python scripts/validate_question_bank.py
python -m unittest discover -s tests -v
```

Exemple d'usage serveur (aucune question retournée actuellement puisque toutes sont en `draft`) :
```python
from scripts.question_bank_catalog import QuestionBankCatalog
catalog = QuestionBankCatalog.from_repository()
page = catalog.list_published(locale="fr", family="rh", limit=20)
assert page["items"] == []
```

## Limites connues et garde-fous
- Ce module est une **preuve de fonctionnement du contrat**, **pas une API HTTP ni une implémentation Supabase**. Deux migrations PostgreSQL proposées existent désormais dans `db/postgres/migrations/` ; **elles n'ont pas été exécutées**.
- Aucune authentification réelle n'est implémentée. Le paramètre `trusted_role` dans `evaluator_view` est une assertion de défense supplémentaire : **seul un service serveur authentifié et autorisé pourra l'utiliser**. Ne jamais connecter cette méthode directement au navigateur.
- Le référentiel JSON actuel représente une version par code ; les versions publiées multiples, l'immutabilité en base, les snapshots d'entretien, les opérations d'administration et l'audit des changements restent à implémenter.
- Les objectifs de préparation ne sont pas modifiés par le catalogue ; S2-04 prendra les décisions de séquencement et de relances.
- Les 120 questions restent `draft`. Aucun contenu n'est promu, aucune réponse attendue n'est exposée.

## Critères de recette couverts dans cette tranche
- Lecture filtrée, pagination et contenus localisés FR/EN.
- Refus des brouillons et des questions non approuvées / sans grille publiée.
- Séparation des données visibles candidat et des critères internes.
- Rejet des paramètres mal formés et des codes dupliqués.

## Étapes suivantes
1. Faire valider la stack d'implémentation (backend/auth/base de données) et la politique de sécurité.
2. Définir les migrations SQL / RLS et les transitions de publication transactionnelles, en cohérence avec `S2-03_Question_Bank_Specification.md`.
3. Développer l'API serveur interne et les snapshots de questions consommés par S2-04.
4. Finaliser la revue qualité métier des 120 questions.
5. Tester avec le moteur réel et confirmer la CI de la Pull Request avant fusion.

**Statut :** branche de développement, revue/CI à réaliser avant fusion ; S2-03 n'est pas clôturée.


## Extension de la PR : proposition de persistance et publication

Deux migrations PostgreSQL (`0001_question_bank_schema.sql`, `0002_publication_guards.sql`) et les tests statiques SQL sont inclus. Elles matérialisent les versions de questions, les rubriques, les propositions, les événements d'audit, l'immutabilité des contenus publiés et les conditions de publication. [Voir le design et ses restrictions](S2-03_Postgres_Persistence_Design.md) ; [guide d'exécution isolée](../db/postgres/README.md).

**Attention :** pas de test SQL réel, de gestion des identités ni de serveur API ; les fonctions de publication doivent rester owner-only et ne sont pas une autorisation utilisateur. La PR demeure en revue pour ne pas présenter le modèle comme une fonctionnalité déployée.
