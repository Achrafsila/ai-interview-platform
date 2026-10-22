"""Contract tests for read-only, published-only S2-03 catalogue."""
import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from question_bank_catalog import CatalogError, QuestionBankCatalog, QuestionNotFound


class CatalogTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.draft_catalog = QuestionBankCatalog.from_repository()
        question = copy.deepcopy(cls.draft_catalog._by_code["RH-004"])
        question["status"] = "published"
        question["review"]["approved_for_publication"] = True
        question["version"] = 2
        cls.published = question
        rubric = copy.deepcopy(cls.draft_catalog._rubrics["RH_GENERAL"])
        rubric["status"] = "published"
        cls.published_rubric = rubric

    def catalog(self, *questions):
        return QuestionBankCatalog(list(questions), [self.published_rubric])

    def test_real_120_question_corpus_is_not_published(self):
        self.assertEqual(self.draft_catalog.list_published()["items"], [])
        self.assertIsNone(self.draft_catalog.list_published()["next_cursor"])
        with self.assertRaises(QuestionNotFound):
            self.draft_catalog.candidate_view("RH-004")
        with self.assertRaises(QuestionNotFound):
            self.draft_catalog.evaluator_view("RH-004", trusted_role="evaluator")

    def test_candidate_payload_does_not_leak_private_expected_elements(self):
        result = self.catalog(self.published).candidate_view("RH-004")
        self.assertEqual(result["version"], 2)
        for forbidden in ("expected_elements_fr", "red_flags_fr", "evaluation_notes_fr",
                          "rubric", "acceptable_variations_fr", "followup_seeds"):
            self.assertNotIn(forbidden, result)
        self.assertIn("prompt", result)

    def test_evaluator_payload_requires_server_role(self):
        c = self.catalog(self.published)
        for role in ("", "candidate", "editor"):
            with self.assertRaises(PermissionError):
                c.evaluator_view("RH-004", trusted_role=role)
        internal = c.evaluator_view("RH-004", trusted_role="evaluator")
        self.assertGreater(len(internal["expected_elements_fr"]), 0)
        self.assertEqual(sum(internal["rubric"]["weights"].values()), 100)

    def test_requires_publication_and_approval_and_rubric_publication(self):
        q = copy.deepcopy(self.published)
        q["review"]["approved_for_publication"] = False
        self.assertEqual(self.catalog(q).list_published()["items"], [])
        q["review"]["approved_for_publication"] = True
        q["status"] = "draft"
        self.assertEqual(self.catalog(q).list_published()["items"], [])
        q["status"] = "published"
        rubric = copy.deepcopy(self.published_rubric)
        rubric["status"] = "draft"
        self.assertEqual(QuestionBankCatalog([q], [rubric]).list_published()["items"], [])

    def test_filters_and_stable_pagination(self):
        first = copy.deepcopy(self.published)
        second = copy.deepcopy(self.published)
        second["code"] = "RH-007"
        second["primary_competency"] = "learning"
        third = copy.deepcopy(self.published)
        third["code"] = "RH-008"
        third["category_code"] = "priorisation"
        c = self.catalog(third, first, second)
        a = c.list_published(limit=2, family="rh", locale="en")
        self.assertEqual([x["code"] for x in a["items"]], ["RH-004", "RH-007"])
        self.assertEqual(a["next_cursor"], "RH-007")
        b = c.list_published(limit=2, after=a["next_cursor"])
        self.assertEqual([x["code"] for x in b["items"]], ["RH-008"])
        self.assertIsNone(b["next_cursor"])
        self.assertEqual(len(c.list_published(competency="learning")["items"]), 1)
        self.assertEqual(len(c.list_published(category="priorisation")["items"]), 1)
        self.assertEqual(len(c.list_published(difficulty=1)["items"]), 0)

    def test_defensive_copy_of_input(self):
        q = copy.deepcopy(self.published)
        c = self.catalog(q)
        q["localizations"]["fr"]["prompt"] = "tampered"
        self.assertNotEqual(c.candidate_view("RH-004")["prompt"], "tampered")

    def test_bad_filters_rejected(self):
        c = self.catalog(self.published)
        for kwargs in ({"locale": "es"}, {"limit": 0}, {"limit": True},
                       {"limit": 101}, {"difficulty": 0}, {"difficulty": True},
                       {"after": ""}):
            with self.assertRaises(CatalogError):
                c.list_published(**kwargs)

    def test_duplicate_codes_rejected(self):
        with self.assertRaises(CatalogError):
            self.catalog(self.published, self.published)


if __name__ == "__main__":
    unittest.main()
