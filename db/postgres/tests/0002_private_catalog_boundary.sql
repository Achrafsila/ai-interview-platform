-- Private read model and denied-client-roles regression checks.
-- Run on a disposable PostgreSQL 16+ DB AFTER migrations 0001–0004.
DO $tests$
DECLARE role_name text;
BEGIN
 IF (SELECT count(*) FROM question_bank.published_questions_safe)<>0 THEN
    RAISE EXCEPTION 'Published-only view exposed drafts';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_class c WHERE c.oid='question_bank.published_questions_safe'::regclass
    AND 'security_invoker=true'=ANY(c.reloptions)) THEN
    RAISE EXCEPTION 'Safe view must be security_invoker';
 END IF;
 FOR role_name IN SELECT unnest(ARRAY['anon','authenticated']) LOOP
    IF has_schema_privilege(role_name,'question_bank','USAGE')
       OR has_table_privilege(role_name,'question_bank.published_questions_safe','SELECT')
       OR has_table_privilege(role_name,'question_bank.question_versions','SELECT')
       OR has_table_privilege(role_name,'question_bank.localizations','SELECT')
       OR has_function_privilege(role_name,'question_bank.publish_question(uuid,uuid)','EXECUTE') THEN
       RAISE EXCEPTION 'Unintended private question access for role %',role_name;
    END IF;
 END LOOP;
END $tests$;
