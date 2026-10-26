"""End-to-end V2 lab contracts with a deterministic fake model (no network)."""
import importlib.util
from pathlib import Path
import sys
import unittest

BASE = Path(__file__).resolve().parents[1]
def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

job = load("job_intelligence", BASE / "src/interview-engine/job_intelligence.py")
v2 = load("v2_interview", BASE / "dev/local-preview/v2_interview.py")

class Provider:
    def __init__(self):
        self.calls = []
        self.fail = False

    def _complete(self, instructions, context, max_tokens=260):
        self.calls.append(context)
        if self.fail:
            raise RuntimeError("provider unavailable")
        if context["history_untrusted"]:
            return "Vous avez évoqué un exemple. Qu'avez-vous mesuré concrètement ?"
        return "Parlez-moi d'un défi important dans ce poste."

    def feedback(self, **kwargs):
        return "Vous avez fourni des exemples à approfondir."

class V2InterviewLabTests(unittest.TestCase):
    def setUp(self):
        self.provider = Provider()
        self.lab = v2.V2InterviewLab(self.provider, job.interpret_job)

    def test_job_anchoring_and_candidate_answer_in_history(self):
        result = self.lab.start({"job_title": "Data Scientist", "job_description": "Analyze churn with SQL",
                                 "family": "technical", "locale": "fr", "count": 2})
        self.assertTrue(result["session_id"].startswith("v2_"))
        self.assertEqual(self.provider.calls[0]["job_title"], "Data Scientist")
        self.assertEqual(self.provider.calls[0]["competencies"][0]["provenance"], "jd_explicit")
        followup = self.lab.answer({"session_id": result["session_id"], "answer": "J'utilise SQL."})
        self.assertFalse(followup["completed"])
        self.assertIn("SQL", self.provider.calls[-1]["history_untrusted"][-1]["answer"])
        finished = self.lab.answer({"session_id": result["session_id"], "answer": "J'utilise le taux de churn."})
        self.assertTrue(finished["completed"])
        self.assertEqual(len(finished["transcript"]), 2)

    def test_provider_failure_does_not_consume_answer(self):
        result = self.lab.start({"job_title": "HRBP", "family": "rh", "count": 2})
        self.provider.fail = True
        with self.assertRaises(RuntimeError):
            self.lab.answer({"session_id": result["session_id"], "answer": "Mon exemple"})
        self.assertEqual(self.lab.sessions[result["session_id"]]["position"], 0)

    def test_invalid_title_refused(self):
        with self.assertRaises(ValueError):
            self.lab.start({"job_title": "", "family": "rh", "count": 2})

if __name__ == "__main__":
    unittest.main()
