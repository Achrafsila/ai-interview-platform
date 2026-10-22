-- S2-03 PostgreSQL reference schema v0.1 (NOT APPLIED).
-- Assumes PostgreSQL 14+, pgcrypto. No Supabase-specific auth integration.
-- SQL role grants intentionally omitted: authenticated server integration remains undecided.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS question_bank;
REVOKE ALL ON SCHEMA question_bank FROM PUBLIC;

CREATE TABLE question_bank.categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 code text NOT NULL UNIQUE,
 family text NOT NULL CHECK (family IN ('rh','transversal','technical')),
 label text NOT NULL,
 parent_id uuid REFERENCES question_bank.categories(id) ON DELETE RESTRICT,
 active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE question_bank.competencies (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 code text NOT NULL UNIQUE,
 label text NOT NULL,
 active boolean NOT NULL DEFAULT true
);
CREATE TABLE question_bank.rubrics (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 code text NOT NULL UNIQUE,
 family text NOT NULL CHECK(family IN ('rh','transversal','technical'))
);
CREATE TABLE question_bank.rubric_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 rubric_id uuid NOT NULL REFERENCES question_bank.rubrics(id) ON DELETE RESTRICT,
 version_no integer NOT NULL CHECK(version_no > 0),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','in_review','published','archived')),
 weights jsonb NOT NULL CHECK (jsonb_typeof(weights) = 'object'),
 scale jsonb NOT NULL CHECK (jsonb_typeof(scale) = 'object'),
 reviewed_by uuid,
 reviewed_at timestamptz,
 published_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(rubric_id, version_no),
 UNIQUE(id, rubric_id)
);
CREATE TABLE question_bank.questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 code text NOT NULL UNIQUE,
 category_id uuid NOT NULL REFERENCES question_bank.categories(id) ON DELETE RESTRICT,
 origin text NOT NULL CHECK(origin IN ('human','ai_proposal')),
 created_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(),
 current_published_version_id uuid
);
CREATE TABLE question_bank.question_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 question_id uuid NOT NULL REFERENCES question_bank.questions(id) ON DELETE RESTRICT,
 version_no integer NOT NULL CHECK(version_no > 0),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','in_review','published','archived')),
 question_type text NOT NULL CHECK(question_type IN ('introductory','motivational','behavioral','situational','conceptual','practical','case_study')),
 difficulty smallint NOT NULL CHECK(difficulty BETWEEN 1 AND 4),
 rubric_version_id uuid NOT NULL REFERENCES question_bank.rubric_versions(id) ON DELETE RESTRICT,
 expected_elements jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(expected_elements)='array'),
 acceptable_variations text,
 red_flags jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(red_flags)='array'),
 evaluation_notes text,
 approved_for_publication boolean NOT NULL DEFAULT false,
 reviewed_by uuid,
 reviewed_at timestamptz,
 published_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(question_id,version_no),
 UNIQUE(id,question_id),
 CHECK(status <> 'published' OR (approved_for_publication AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL AND published_at IS NOT NULL))
);
ALTER TABLE question_bank.questions ADD CONSTRAINT fk_current_published_version
  FOREIGN KEY (current_published_version_id,id)
  REFERENCES question_bank.question_versions(id,question_id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE question_bank.localizations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 question_version_id uuid NOT NULL REFERENCES question_bank.question_versions(id) ON DELETE RESTRICT,
 locale text NOT NULL CHECK(locale IN ('fr','en')),
 prompt text NOT NULL CHECK(length(btrim(prompt))>0),
 followup_seeds jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(followup_seeds)='array'),
 UNIQUE(question_version_id,locale)
);
CREATE TABLE question_bank.question_competencies (
 question_version_id uuid NOT NULL REFERENCES question_bank.question_versions(id) ON DELETE RESTRICT,
 competency_id uuid NOT NULL REFERENCES question_bank.competencies(id) ON DELETE RESTRICT,
 is_primary boolean NOT NULL DEFAULT false,
 PRIMARY KEY(question_version_id,competency_id)
);
CREATE UNIQUE INDEX uq_question_primary_competency ON question_bank.question_competencies(question_version_id) WHERE is_primary;

CREATE TABLE question_bank.proposals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 category_id uuid REFERENCES question_bank.categories(id),
 provenance text NOT NULL CHECK(provenance IN ('ai','human')),
 state text NOT NULL DEFAULT 'proposed' CHECK(state IN ('proposed','in_review','approved','rejected','promoted')),
 created_at timestamptz NOT NULL DEFAULT now(),
 reviewed_by uuid,
 reviewed_at timestamptz,
 review_notes text,
 promoted_question_id uuid REFERENCES question_bank.questions(id) ON DELETE RESTRICT,
 CHECK (state NOT IN ('approved','rejected','promoted') OR reviewed_by IS NOT NULL),
 CHECK(state <> 'promoted' OR promoted_question_id IS NOT NULL)
);
CREATE TABLE question_bank.audit_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 entity_kind text NOT NULL CHECK(entity_kind IN ('question_version','rubric_version','proposal','question')),
 entity_id uuid NOT NULL,
 action text NOT NULL,
 actor_id uuid,
 recorded_at timestamptz NOT NULL DEFAULT now(),
 metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(metadata)='object')
);
CREATE INDEX idx_question_versions_status ON question_bank.question_versions(status,question_id);
CREATE INDEX idx_localizations_version ON question_bank.localizations(question_version_id,locale);
CREATE INDEX idx_proposals_state ON question_bank.proposals(state,created_at);
CREATE INDEX idx_audit_entity ON question_bank.audit_events(entity_kind,entity_id,recorded_at);

-- Published versions are immutable. Archival is represented by retiring the
-- question pointer, NOT overwriting a published revision. Audit stays append-only.
CREATE FUNCTION question_bank.protect_published_version() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
 IF OLD.status = 'published' THEN
   RAISE EXCEPTION 'Published question version is immutable; create a new version';
 END IF;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $;
CREATE TRIGGER trg_protect_published_version BEFORE UPDATE OR DELETE ON question_bank.question_versions
 FOR EACH ROW EXECUTE FUNCTION question_bank.protect_published_version();

CREATE FUNCTION question_bank.protect_published_rubric() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
 IF OLD.status = 'published' THEN
   RAISE EXCEPTION 'Published rubric version is immutable; create a new version';
 END IF;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $;
CREATE TRIGGER trg_protect_published_rubric BEFORE UPDATE OR DELETE ON question_bank.rubric_versions
 FOR EACH ROW EXECUTE FUNCTION question_bank.protect_published_rubric();

CREATE FUNCTION question_bank.protect_published_localization() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
 IF EXISTS (SELECT 1 FROM question_bank.question_versions WHERE id = OLD.question_version_id AND status = 'published') THEN
   RAISE EXCEPTION 'Published localization is immutable';
 END IF;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $;
CREATE TRIGGER trg_protect_published_localization BEFORE UPDATE OR DELETE ON question_bank.localizations
 FOR EACH ROW EXECUTE FUNCTION question_bank.protect_published_localization();

CREATE FUNCTION question_bank.protect_published_competency() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
 IF EXISTS (SELECT 1 FROM question_bank.question_versions WHERE id = OLD.question_version_id AND status = 'published') THEN
   RAISE EXCEPTION 'Published competency links are immutable';
 END IF;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $;
CREATE TRIGGER trg_protect_published_competency BEFORE UPDATE OR DELETE ON question_bank.question_competencies
 FOR EACH ROW EXECUTE FUNCTION question_bank.protect_published_competency();

-- The publication operation must check complete FR/EN, rubric publication,
-- primary competency, approvals and weights IN THE SAME TRANSACTION.
-- Until a server-authenticated publisher is implemented, SQL writes stay owner-only.
ALTER TABLE question_bank.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.rubric_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.question_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.localizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.question_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank.audit_events ENABLE ROW LEVEL SECURITY;
-- FORCE RLS intentionally deferred until role model / migration owner established.
-- No public RLS policies or GRANT privileges: default deny for non-owner roles.
COMMIT;
