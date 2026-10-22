"""Static checks for S2-03 SQL migrations (not an execution test)."""
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "db" / "postgres" / "migrations"

class MigrationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema = (ROOT / "0001_question_bank_schema.sql").read_text(encoding="utf-8").lower()
        cls.guards = (ROOT / "0002_publication_guards.sql").read_text(encoding="utf-8").lower()

    def test_security_defaults(self):
        for table in ("categories", "competencies", "rubrics", "rubric_versions",
                      "questions", "question_versions", "localizations",
                      "question_competencies", "proposals", "audit_events"):
            self.assertIn(f"alter table question_bank.{table} enable row level security", self.schema)
        self.assertIn("revoke all on schema question_bank from public", self.schema)
        self.assertNotIn("grant select on all tables", self.schema)

    def test_version_immutability(self):
        self.assertIn("trg_protect_published_version", self.schema)
        self.assertIn("trg_protect_published_rubric", self.schema)
        self.assertIn("trg_protect_published_localization", self.schema)
        self.assertIn("trg_immutable_localization_insert", self.guards)
        self.assertIn("trg_immutable_competency_insert", self.guards)
        self.assertIn("trg_no_localization_reparent", self.guards)

    def test_publication_gates(self):
        for snippet in ("approved_for_publication", "reviewed_by", "reviewed_at",
                        "jsonb_array_length(rec.expected_elements)",
                        "count(distinct locale)", "is_primary", "status='published'",
                        "audit_events", "for update"):
            self.assertIn(snippet, self.guards)
        for signature in ("publish_question(uuid,uuid)", "publish_rubric(uuid,uuid)"):
            self.assertIn(f"revoke all on function question_bank.{signature} from public", self.guards)

    def test_sql_transaction_boundaries(self):
        for content in (self.schema, self.guards):
            self.assertTrue(content.strip().startswith("--"))
            self.assertIn("begin;", content)
            self.assertTrue(content.strip().endswith("commit;"))

if __name__ == "__main__":
    unittest.main()
