# S2-03 — Déploiement réel sur Supabase (22 octobre 2026)

## Environnement ciblé

- Projet Supabase : **ai-interview-platform**
- Organisation : **Achrafsila's Org** (compte spécifié par le Product Owner)
- Référence : `aqybktqgoartjiqoqcfg`
- Région : `eu-west-3` (Paris)
- Statut observé : `ACTIVE_HEALTHY`
- Aucune modification des autres projets Supabase.

[Ouvrir le projet](https://supabase.com/dashboard/project/aqybktqgoartjiqoqcfg)

## Migrations appliquées avec succès

| Migration versionnée GitHub | Enregistrement Supabase | État |
|---|---|---|
| `db/postgres/migrations/0001_question_bank_schema.sql` | `s2_03_question_bank_schema` | Appliquée |
| `db/postgres/migrations/0002_publication_guards.sql` | `s2_03_publication_guards` | Appliquée |
| `db/postgres/migrations/0003_question_bank_indexes.sql` | `s2_03_question_bank_indexes` | Appliquée |

## Import et vérification en base

Le corpus GitHub a été inséré en 6 lots transactionnels de 20 entrées. Les 120 questions restent en `draft`, avec `approved_for_publication=false`. Les métadonnées de revue éditoriale d'origine ont été enregistrées dans `audit_events.metadata.review`.

| Contrôle SQL | Résultat constaté |
|---|---:|
| Questions | 120 |
| Questions RH | 50 |
| Questions techniques | 70 |
| Versions de questions | 120 |
| Formulations FR/EN | 240 |
| Compétences principales liées | 120 |
| Catégories | 18 |
| Références de compétences | 120 |
| Grilles et versions de grille (draft) | 2 |
| Événements d'import `seeded_draft` | 120 |
| Questions approuvées ou publiées | **0** |
| Pointeurs de publication actifs | **0** |

### Sécurité vérifiée

- RLS activée sur 10/10 tables du schéma `question_bank`.
- Aucun privilège de lecture attribué à `anon` ou `authenticated` sur ces tables.
- Les rôles `anon` et `authenticated` ne disposent pas de `USAGE` sur le schéma.
- Les fonctions de publication ne sont pas exécutables par `anon` ou `authenticated`.
- Audit Supabase : 10 avertissements **INFO** « RLS enabled no policy » — **volontaires à ce stade**, car aucun client ni service applicatif ne doit accéder aux tables avant la conception des permissions.
- Audit performance : les 7 avertissements « unindexed foreign keys » ont été résolus par la migration `0003`. Des « unused index » subsistent, attendus sur un projet nouvellement créé.

[Référence Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Reproductibilité

- Référentiel source : `data/question-bank/*.json`.
- Générateur documenté : `python scripts/generate_question_bank_seed_sql.py > /tmp/question_bank_seed.sql`.
- Le SQL généré inclut des insertions `ON CONFLICT DO NOTHING` et des assertions de taille/statut.
- Le job GitHub Actions `postgres-integration` est étendu pour appliquer les trois migrations et exécuter deux fois l'import, de manière à vérifier son idempotence sur une base de test.

**Important :** l'import de production de ce jour a été effectué par des instructions SQL transactionnelles équivalentes générées depuis les données GitHub ; le générateur ajouté ensuite doit être validé par sa nouvelle exécution CI avant d'être considéré comme testé.

## Ce qui reste ouvert avant clôture S2-03

1. Relecture humaine complète des 100 nouvelles questions et validation technique experte (70 techniques).
2. Harmonisation et approbation des catégories, relances et grilles éditoriales.
3. Authentification, rôles de service fiables, permissions et RLS spécifiques, et tests d'accès multi-rôles.
4. Service HTTP interne S2-03 et snapshots de version utilisables par S2-04.
5. Recette de bout en bout et validation Product Owner.

**Décision de sécurité :** ne pas créer de politique RLS permissive ni attribuer de droits `anon` / `authenticated` sans conception détaillée et tests. La présence des données dans Supabase ne signifie pas leur publication ou leur disponibilité dans une application.
