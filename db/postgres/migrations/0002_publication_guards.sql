-- S2-03: publication guarded by database-owner-only functions.
-- NOT DEPLOYED. Functions run as invoker, EXECUTE revoked from PUBLIC.
BEGIN;
-- Prevent adding new translations or competency links after a version is published.
CREATE FUNCTION question_bank.reject_changes_to_published_child() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE v_id uuid;
BEGIN
 v_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.question_version_id ELSE NEW.question_version_id END;
 IF EXISTS (SELECT 1 FROM question_bank.question_versions
            WHERE id = v_id AND status = 'published') THEN
   RAISE EXCEPTION 'Cannot modify content linked to a published question version';
 END IF;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER trg_immutable_localization_insert
 BEFORE INSERT ON question_bank.localizations
 FOR EACH ROW EXECUTE FUNCTION question_bank.reject_changes_to_published_child();
CREATE TRIGGER trg_immutable_competency_insert
 BEFORE INSERT ON question_bank.question_competencies
 FOR EACH ROW EXECUTE FUNCTION question_bank.reject_changes_to_published_child();

-- Do not allow moving rows between versions as a way around immutability.
CREATE FUNCTION question_bank.reject_reparent() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
 IF OLD.question_version_id <> NEW.question_version_id THEN
  RAISE EXCEPTION 'Cannot move a version-linked row';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER trg_no_localization_reparent BEFORE UPDATE ON question_bank.localizations
 FOR EACH ROW EXECUTE FUNCTION question_bank.reject_reparent();
CREATE TRIGGER trg_no_competency_reparent BEFORE UPDATE ON question_bank.question_competencies
 FOR EACH ROW EXECUTE FUNCTION question_bank.reject_reparent();

CREATE FUNCTION question_bank.publish_rubric(p_version uuid, p_reviewer uuid)
RETURNS void LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE rec question_bank.rubric_versions%ROWTYPE;
DECLARE total numeric;
BEGIN
 IF p_reviewer IS NULL THEN RAISE EXCEPTION 'Human reviewer id is required'; END IF;
 SELECT * INTO rec FROM question_bank.rubric_versions WHERE id = p_version FOR UPDATE;
 IF NOT FOUND OR rec.status NOT IN ('draft','in_review') THEN
   RAISE EXCEPTION 'Rubric must exist as a draft or review version';
 END IF;
 IF EXISTS (SELECT 1 FROM jsonb_each_text(rec.weights)
            WHERE value !~ '^[0-9]+([.][0-9]+)?
 UPDATE question_bank.rubric_versions
 SET status='published',reviewed_by=p_reviewer,reviewed_at=now(),published_at=now()
 WHERE id=p_version;
 INSERT INTO question_bank.audit_events(entity_kind,entity_id,action,actor_id)
 VALUES('rubric_version',p_version,'published',p_reviewer);
END $$;
REVOKE ALL ON FUNCTION question_bank.publish_rubric(uuid,uuid) FROM PUBLIC;

CREATE FUNCTION question_bank.publish_question(p_version uuid,p_reviewer uuid)
RETURNS void LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE rec question_bank.question_versions%ROWTYPE;
DECLARE qid uuid;
BEGIN
 IF p_reviewer IS NULL THEN RAISE EXCEPTION 'Human reviewer id is required'; END IF;
 SELECT * INTO rec FROM question_bank.question_versions WHERE id=p_version FOR UPDATE;
 IF NOT FOUND OR rec.status NOT IN ('draft','in_review') THEN
   RAISE EXCEPTION 'Question must exist as a draft or review version';
 END IF;
 IF NOT rec.approved_for_publication OR rec.reviewed_by IS NULL OR rec.reviewed_at IS NULL THEN
   RAISE EXCEPTION 'Explicit human review and prior approval required';
 END IF;
 IF rec.reviewed_by <> p_reviewer THEN
   RAISE EXCEPTION 'Reviewer identity must match recorded human review';
 END IF;
 IF jsonb_array_length(rec.expected_elements)<1 THEN
   RAISE EXCEPTION 'Missing expected elements';
 END IF;
 IF (SELECT count(DISTINCT locale) FROM question_bank.localizations
     WHERE question_version_id=p_version AND locale IN ('fr','en'))<>2 THEN
   RAISE EXCEPTION 'Both French and English prompts are required';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM question_bank.question_competencies
    WHERE question_version_id=p_version AND is_primary) THEN
   RAISE EXCEPTION 'A primary competency is required';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM question_bank.rubric_versions
    WHERE id=rec.rubric_version_id AND status='published') THEN
   RAISE EXCEPTION 'Rubric version must be published';
 END IF;
 qid := rec.question_id;
 PERFORM 1 FROM question_bank.questions WHERE id=qid FOR UPDATE;
 UPDATE question_bank.question_versions
 SET status='published', published_at=now()
 WHERE id=p_version;
 UPDATE question_bank.questions SET current_published_version_id=p_version WHERE id=qid;
 INSERT INTO question_bank.audit_events(entity_kind,entity_id,action,actor_id)
 VALUES('question_version',p_version,'published',p_reviewer);
END $$;
REVOKE ALL ON FUNCTION question_bank.publish_question(uuid,uuid) FROM PUBLIC;

-- Restrict direct access to tables/functions; application role mapping is TODO.
-- Owner can still execute functions: deployment roles must be separated from runtime users.
COMMIT;
) THEN
   RAISE EXCEPTION 'Rubric weights must be nonnegative numbers';
 END IF;
 SELECT coalesce(sum(value::numeric),0) INTO total
 FROM jsonb_each_text(rec.weights);
 IF total <> 100 OR (SELECT count(*) FROM jsonb_each(rec.weights)) = 0 THEN
   RAISE EXCEPTION 'Rubric weights must sum to 100';
 END IF;
 UPDATE question_bank.rubric_versions
 SET status='published',reviewed_by=p_reviewer,reviewed_at=now(),published_at=now()
 WHERE id=p_version;
 INSERT INTO question_bank.audit_events(entity_kind,entity_id,action,actor_id)
 VALUES('rubric_version',p_version,'published',p_reviewer);
END $$;
REVOKE ALL ON FUNCTION question_bank.publish_rubric(uuid,uuid) FROM PUBLIC;

CREATE FUNCTION question_bank.publish_question(p_version uuid,p_reviewer uuid)
RETURNS void LANGUAGE plpgsql SET search_path = pg_catalog AS $$
DECLARE rec question_bank.question_versions%ROWTYPE;
DECLARE qid uuid;
BEGIN
 IF p_reviewer IS NULL THEN RAISE EXCEPTION 'Human reviewer id is required'; END IF;
 SELECT * INTO rec FROM question_bank.question_versions WHERE id=p_version FOR UPDATE;
 IF NOT FOUND OR rec.status NOT IN ('draft','in_review') THEN
   RAISE EXCEPTION 'Question must exist as a draft or review version';
 END IF;
 IF NOT rec.approved_for_publication OR rec.reviewed_by IS NULL OR rec.reviewed_at IS NULL THEN
   RAISE EXCEPTION 'Explicit human review and prior approval required';
 END IF;
 IF rec.reviewed_by <> p_reviewer THEN
   RAISE EXCEPTION 'Reviewer identity must match recorded human review';
 END IF;
 IF jsonb_array_length(rec.expected_elements)<1 THEN
   RAISE EXCEPTION 'Missing expected elements';
 END IF;
 IF (SELECT count(DISTINCT locale) FROM question_bank.localizations
     WHERE question_version_id=p_version AND locale IN ('fr','en'))<>2 THEN
   RAISE EXCEPTION 'Both French and English prompts are required';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM question_bank.question_competencies
    WHERE question_version_id=p_version AND is_primary) THEN
   RAISE EXCEPTION 'A primary competency is required';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM question_bank.rubric_versions
    WHERE id=rec.rubric_version_id AND status='published') THEN
   RAISE EXCEPTION 'Rubric version must be published';
 END IF;
 qid := rec.question_id;
 PERFORM 1 FROM question_bank.questions WHERE id=qid FOR UPDATE;
 UPDATE question_bank.question_versions
 SET status='published', published_at=now()
 WHERE id=p_version;
 UPDATE question_bank.questions SET current_published_version_id=p_version WHERE id=qid;
 INSERT INTO question_bank.audit_events(entity_kind,entity_id,action,actor_id)
 VALUES('question_version',p_version,'published',p_reviewer);
END $$;
REVOKE ALL ON FUNCTION question_bank.publish_question(uuid,uuid) FROM PUBLIC;

-- Restrict direct access to tables/functions; application role mapping is TODO.
-- Owner can still execute functions: deployment roles must be separated from runtime users.
COMMIT;
