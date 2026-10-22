# PostgreSQL reference migrations — S2-03

**Status: proposed and NOT applied.** This is a PostgreSQL-specific implementation candidate, **not a declaration that Supabase or PostgreSQL has been approved**.

## Ordered migrations

1. `migrations/0001_question_bank_schema.sql` — normalized categories, competencies, rubric versions, immutable question revisions, bilingual localizations, proposals, audit trail and default-deny row-level security.
2. `migrations/0002_publication_guards.sql` — prevent changes to published localizations/competencies, require human review, a published rubric, bilingual prompts and a primary competency before publication.

### Local test procedure (isolated empty PostgreSQL 14+ database)

```bash
psql -X -v ON_ERROR_STOP=1 "$TEST_DATABASE_URL" -f db/postgres/migrations/0001_question_bank_schema.sql
psql -X -v ON_ERROR_STOP=1 "$TEST_DATABASE_URL" -f db/postgres/migrations/0002_publication_guards.sql
```

**Never point TEST_DATABASE_URL at production or an existing project database.** These migrations create `question_bank` in the selected database; they are not down/up replay-safe and require a migration ledger when adopted.

## Security design

- All application tables have RLS enabled. No policies nor grants for clients exist; non-owner roles have no access.
- Functions run with invoking privileges. `publish_question` and `publish_rubric` explicitly revoke EXECUTE from PUBLIC.
- The database owner is privileged and bypasses ordinary RLS. **Never use the owner/service role as an unguarded HTTP request role.**
- Publishing functions take a reviewer UUID but **do not authenticate its identity**. Do not expose them until a server-trusted actor binding, independent reviewer checks, per-operation authorization and audit strategy are implemented.
- Additional security hardening required before use: read-only safe projection for candidate API, role-specific GRANT and RLS policies, immutable audit trail against tampering, role separation for migrations/publication, migration integration tests and snapshot references S2-04.
- The `question_bank` schema is not exported to a client/browser. Expected answers, rubric anchors, audit trail and proposals are server-only.
- Migration 0001 only prevents updates to published questions; migration 0002 enforces publication preconditions for **functions**, not arbitrary direct owner INSERT/UPDATE. Future operational model MUST revoke application DML privileges and enforce publication via trusted service.

## API integration

Use `scripts/question_bank_catalog.py` for current prototype filtering. The future S2-04 service must use an authenticated server-to-server contract as outlined in [S2-03 DB/API design](../../docs/S2-03_Postgres_Persistence_Design.md).

## Open decisions

- Provider/stack decision, role identity mapping, permissions, tenant scoping, migration framework.
- Published revisions and immutable session snapshots must be aligned with interview_sessions/interview_turns before real candidate usage.
- FR/EN expected elements and criteria locality; rubrics versioning and coverage calibration at Sprint 3.

**Never mark these migrations “deployed” until a real PostgreSQL execution log and integration tests exist.**
