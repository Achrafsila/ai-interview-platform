-- S2-03: FK indexes identified after Supabase advisory inspection.
-- Non-destructive, rerunnable with IF NOT EXISTS.
BEGIN;
CREATE INDEX IF NOT EXISTS idx_qb_categories_parent ON question_bank.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_qb_proposals_category ON question_bank.proposals(category_id);
CREATE INDEX IF NOT EXISTS idx_qb_proposals_promoted_question ON question_bank.proposals(promoted_question_id);
CREATE INDEX IF NOT EXISTS idx_qb_qcomp_competency ON question_bank.question_competencies(competency_id);
CREATE INDEX IF NOT EXISTS idx_qb_qversions_rubric_version ON question_bank.question_versions(rubric_version_id);
CREATE INDEX IF NOT EXISTS idx_qb_questions_published_pointer ON question_bank.questions(current_published_version_id,id);
CREATE INDEX IF NOT EXISTS idx_qb_questions_category ON question_bank.questions(category_id);
COMMIT;
