-- Run ONLY in an empty, disposable PostgreSQL CI database.
-- Validate publication gates, referential integrity and immutable revisions.
BEGIN;
DO $$
DECLARE
  v_category uuid;
  v_competency uuid;
  v_question uuid;
  v_version uuid;
  v_rubric uuid;
  v_rubric_version uuid;
  v_reviewer uuid := gen_random_uuid();
  v_rejected boolean;
BEGIN
  INSERT INTO question_bank.categories(code,family,label)
  VALUES ('test_software','technical','Test Software') RETURNING id INTO v_category;
  INSERT INTO question_bank.competencies(code,label)
  VALUES ('test_diagnostics','Diagnostics') RETURNING id INTO v_competency;
  INSERT INTO question_bank.rubrics(code,family)
  VALUES ('TEST_TECH','technical') RETURNING id INTO v_rubric;
  INSERT INTO question_bank.rubric_versions(rubric_id,version_no,weights,scale)
  VALUES(v_rubric,1,'{"technical_accuracy": 70, "reasoning": 30}'::jsonb,'{"1":"weak","5":"strong"}'::jsonb)
  RETURNING id INTO v_rubric_version;
  INSERT INTO question_bank.questions(code,category_id,origin)
  VALUES('TEST-001',v_category,'human') RETURNING id INTO v_question;
  INSERT INTO question_bank.question_versions(
     question_id,version_no,question_type,difficulty,rubric_version_id,expected_elements)
  VALUES(v_question,1,'conceptual',1,v_rubric_version,'["identity","permissions"]'::jsonb)
  RETURNING id INTO v_version;

  -- Neither a rubric nor a question may be published without an explicit reviewer.
  v_rejected := false;
  BEGIN
    PERFORM question_bank.publish_rubric(v_rubric_version,NULL);
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Missing reviewer accepted by publish_rubric'; END IF;

  PERFORM question_bank.publish_rubric(v_rubric_version,v_reviewer);
  IF NOT EXISTS(SELECT 1 FROM question_bank.rubric_versions
                WHERE id=v_rubric_version AND status='published')
  THEN RAISE EXCEPTION 'Rubric did not publish'; END IF;

  -- Rubric versions become immutable once published.
  v_rejected := false;
  BEGIN
    UPDATE question_bank.rubric_versions SET weights='{"technical_accuracy":100}'::jsonb WHERE id=v_rubric_version;
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Published rubric was mutable'; END IF;

  v_rejected := false;
  BEGIN PERFORM question_bank.publish_question(v_version,v_reviewer);
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Unreviewed question was published'; END IF;

  UPDATE question_bank.question_versions
  SET approved_for_publication=true, reviewed_by=v_reviewer, reviewed_at=now()
  WHERE id=v_version;
  v_rejected := false;
  BEGIN PERFORM question_bank.publish_question(v_version,v_reviewer);
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Question without localizations was published'; END IF;

  INSERT INTO question_bank.localizations(question_version_id,locale,prompt)
  VALUES(v_version,'fr','Que signifie authentification ?');
  v_rejected := false;
  BEGIN PERFORM question_bank.publish_question(v_version,v_reviewer);
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Question without English was published'; END IF;

  INSERT INTO question_bank.localizations(question_version_id,locale,prompt)
  VALUES(v_version,'en','What is authentication?');
  v_rejected := false;
  BEGIN PERFORM question_bank.publish_question(v_version,v_reviewer);
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Question without primary competency was published'; END IF;

  INSERT INTO question_bank.question_competencies(question_version_id,competency_id,is_primary)
  VALUES(v_version,v_competency,true);
  v_rejected := false;
  BEGIN PERFORM question_bank.publish_question(v_version,gen_random_uuid());
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Mismatched reviewer accepted'; END IF;

  PERFORM question_bank.publish_question(v_version,v_reviewer);
  IF NOT EXISTS(SELECT 1 FROM question_bank.questions
                WHERE id=v_question AND current_published_version_id=v_version)
  THEN RAISE EXCEPTION 'Published pointer not updated'; END IF;
  IF (SELECT count(*) FROM question_bank.audit_events WHERE entity_id=v_version AND action='published')<>1
  THEN RAISE EXCEPTION 'Missing question publication audit'; END IF;

  -- All content of a published version is immutable.
  v_rejected := false;
  BEGIN UPDATE question_bank.question_versions SET difficulty=3 WHERE id=v_version;
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Published version mutable'; END IF;
  v_rejected := false;
  BEGIN UPDATE question_bank.localizations SET prompt='Changed' WHERE question_version_id=v_version;
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Published prompt mutable'; END IF;
  v_rejected := false;
  BEGIN INSERT INTO question_bank.localizations(question_version_id,locale,prompt)
        VALUES(v_version,'fr','New duplicate prompt');
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Published localization insertion accepted'; END IF;
  v_rejected := false;
  BEGIN DELETE FROM question_bank.question_competencies WHERE question_version_id=v_version;
  EXCEPTION WHEN raise_exception THEN v_rejected := true;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'Published competency deletion accepted'; END IF;

  -- No client grants are installed.
  IF EXISTS (
    SELECT 1 FROM pg_namespace n
    CROSS JOIN LATERAL aclexplode(coalesce(n.nspacl,acldefault('n', n.nspowner))) acl
    WHERE n.nspname='question_bank' AND acl.grantee=0 AND acl.privilege_type='USAGE'
  ) THEN
    RAISE EXCEPTION 'PUBLIC has USAGE on question_bank';
  END IF;
END $$;
ROLLBACK;
