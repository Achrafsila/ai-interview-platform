"""Regression tests for the synthetic S2-03 reference corpus (stdlib only)."""
import json
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "data" / "question-bank"
QUESTION_FILES = [
    "rh_questions.json",
    "rh_questions_expansion.json",
    "technical_questions.json",
    "technical_questions_expansion_part1.json",
    "technical_questions_expansion_part2.json",
]

class QuestionBankContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.questions = []
        for name in QUESTION_FILES:
            with (ROOT / name).open(encoding="utf-8") as stream:
                cls.questions.extend(json.load(stream)["questions"])
        with (ROOT / "evaluation_rubrics.json").open(encoding="utf-8") as stream:
            cls.rubrics = json.load(stream)["rubrics"]

    def test_complete_unique_identifiers(self):
        self.assertEqual(len(self.questions), 120)
        self.assertEqual(len({q["code"] for q in self.questions}), 120)
        self.assertEqual({q["code"] for q in self.questions if q["family"] == "rh"},
                         {f"RH-{i:03}" for i in range(1, 51)})
        self.assertEqual({q["code"] for q in self.questions if q["family"] == "technical"},
                         {f"TECH-{i:03}" for i in range(1, 71)})

    def test_family_targets(self):
        self.assertEqual(Counter(q["family"] for q in self.questions), {"rh": 50, "technical": 70})

    def test_technical_categories(self):
        expected = {"software": 16, "data_ai": 16, "cloud_devops": 12,
                    "cybersecurity": 10, "testing_qa": 8, "business_analysis": 8}
        self.assertEqual(Counter(q["category_code"] for q in self.questions
                                 if q["family"] == "technical"), expected)

    def test_localization_and_content(self):
        prompts = []
        for q in self.questions:
            self.assertIn(q["difficulty"], (1, 2, 3, 4), q["code"])
            self.assertTrue(q["primary_competency"], q["code"])
            self.assertGreaterEqual(len(q["expected_elements_fr"]), 3, q["code"])
            for locale in ("fr", "en"):
                loc = q["localizations"][locale]
                self.assertTrue(loc["prompt"].strip(), q["code"])
                self.assertGreaterEqual(len(loc["followup_seeds"]), 2, q["code"])
            prompts.append(q["localizations"]["fr"]["prompt"].lower().strip())
        self.assertEqual(len(prompts), len(set(prompts)), "Duplicate French prompts")

    def test_no_accidental_publication(self):
        for q in self.questions:
            self.assertEqual(q["status"], "draft", q["code"])
            self.assertIs(q["review"]["approved_for_publication"], False, q["code"])
        for rubric in self.rubrics:
            self.assertEqual(rubric["status"], "draft")

    def test_rubric_weights(self):
        rubrics = {r["code"] for r in self.rubrics}
        self.assertEqual(rubrics, {"RH_GENERAL", "TECH_GENERAL"})
        for rubric in self.rubrics:
            self.assertEqual(sum(rubric["weights"].values()), 100)
        self.assertTrue({q["rubric_code"] for q in self.questions} <= rubrics)

if __name__ == "__main__":
    unittest.main()
