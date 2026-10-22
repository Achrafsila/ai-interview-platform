-- S2-03 hardening: deny browser roles access to private question bank.
-- No security definer functions, no client GRANT, no production API created.
BEGIN;
REVOKE ALL ON SCHEMA question_bank FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA question_bank FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA question_bank FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA question_bank FROM PUBLIC, anon, authenticated;

-- Non-public, deliberately grantless safe projection for a future authorized server.
-- security_invoker prevents views from silently bypassing caller RLS privileges.
CREATE OR REPLACE VIEW question_bank.published_questions_safe
WITH (security_invoker = true, security_barrier = true) AS
SELECT q.id AS question_id,
       v.id AS question_version_id,
       v.rubric_version_id,
       q.code,
       v.version_no AS version,
       cat.family,
       cat.code AS category_code,
       v.question_type,
       v.difficulty,
       l.locale,
       l.prompt,
       pc.code AS primary_competency
FROM question_bank.questions q
JOIN question_bank.question_versions v
  ON v.id = q.current_published_version_id AND v.question_id = q.id
JOIN question_bank.categories cat ON cat.id = q.category_id
JOIN question_bank.localizations l ON l.question_version_id = v.id
JOIN question_bank.question_competencies qc
  ON qc.question_version_id = v.id AND qc.is_primary = true
JOIN question_bank.competencies pc ON pc.id = qc.competency_id
JOIN question_bank.rubric_versions rv ON rv.id = v.rubric_version_id
WHERE v.status = 'published'
  AND v.approved_for_publication = true
  AND rv.status = 'published';
REVOKE ALL ON question_bank.published_questions_safe FROM PUBLIC, anon, authenticated;
COMMENT ON VIEW question_bank.published_questions_safe IS
  'Private candidate-safe projection. No access granted until server role and RLS policies are approved.';
COMMIT;
