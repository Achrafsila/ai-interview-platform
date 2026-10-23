"""Behavioral contract of the local AI coach. All provider replies here are mocked."""
import importlib.util
import io
import json
from pathlib import Path
import sys
import unittest

DIR = Path(__file__).resolve().parents[1] / "dev" / "local-preview"
sys.path.insert(0, str(DIR))
from ai_interview import InterviewLab, OpenAIRehearsalProvider, LabValidationError, AIUnavailableError
from server import load_questions


class FakeCoach:
    def __init__(self):
        self.followup_calls = []
        self.feedback_calls = []

    def followup(self, **kwargs):
        self.followup_calls.append(kwargs)
        return "Relance contextualisée sur : " + kwargs["answer"][:60]

    def feedback(self, **kwargs):
        self.feedback_calls.append(kwargs)
        return "Bon effort. Structurez votre prochaine réponse autour d'un exemple concret."


class InterviewLabTests(unittest.TestCase):
    def setUp(self):
        self.provider = FakeCoach()
        self.engine = InterviewLab(load_questions(), self.provider)

    def test_hr_one_question_and_ai_followup(self):
        started = self.engine.start({
            "family": "rh", "locale": "fr", "count": 1,
            "goals": ["rh_motivation", "communication"],
        })
        self.assertTrue(started["ai"])
        self.assertTrue(started["draft_preview"])
        self.assertFalse(started["persisted"])
        self.assertEqual(started["question"]["family"], "rh")
        self.assertNotIn("expected_elements", started["question"])
        self.assertNotIn("rubric_code", started["question"])
        sid = started["session_id"]
        followup = self.engine.answer({
            "session_id": sid,
            "answer": "Je suis motivé par la collaboration et la résolution de problèmes.",
        })
        self.assertEqual(followup["phase"], "followup")
        self.assertIn("collaboration", followup["question"]["prompt"])
        self.assertTrue(followup["question"]["followup_generated_by_ai"])
        self.assertEqual(self.provider.followup_calls[0]["family"], "rh")
        self.assertEqual(self.provider.followup_calls[0]["goals"], ["rh_motivation", "communication"])
        done = self.engine.answer({
            "session_id": sid, "answer": "J'ai mené un projet associatif en équipe."
        })
        self.assertTrue(done["completed"])
        self.assertEqual(len(done["transcript"]), 2)
        self.assertFalse(done["evaluated"])
        self.assertFalse(done["persisted"])
        self.assertIn("Bon effort", done["feedback"])
        with self.assertRaises(LabValidationError):
            self.engine.answer({"session_id": sid, "answer": "Réponse répétée"})

    def test_specialized_technical_domain(self):
        started = self.engine.start({
            "family": "technical", "domain": "data_ai", "locale": "en",
            "count": 3, "difficulty": 1,
            "goals": ["tech_sql", "tech_problem_solving"],
        })
        self.assertEqual(started["question"]["category"], "data_ai")
        for q in self.engine.sessions[started["session_id"]]["selected"]:
            self.assertEqual(q["category"], "data_ai")
            self.assertEqual(q["difficulty"], 1)
        answer = self.engine.answer({
            "session_id": started["session_id"], "answer": "I would validate the query plan."
        })
        self.assertEqual(answer["question"]["category"], "data_ai")
        self.assertEqual(self.provider.followup_calls[0]["domain"], "data_ai")
        self.assertEqual(self.provider.followup_calls[0]["locale"], "en")

    def test_rejects_cross_family_and_bad_input(self):
        cases = [
            {"family": "rh", "goals": ["tech_sql"]},
            {"family": "technical", "goals": ["rh_motivation"]},
            {"family": "technical", "domain": "finance", "goals": ["tech_sql"]},
            {"family": "rh", "domain": "data_ai", "goals": ["rh_motivation"]},
            {"family": "rh", "goals": []},
            {"family": "rh", "goals": ["rh_motivation", "rh_motivation"]},
            {"family": "rh", "goals": ["rh_motivation"], "count": 90},
            {"family": "rh", "goals": ["rh_motivation"], "job_description": "x" * 3001},
        ]
        for case in cases:
            with self.subTest(case=case):
                with self.assertRaises(LabValidationError):
                    self.engine.start({"count": 2, "locale": "fr", **case})
        with self.assertRaises(LabValidationError):
            self.engine.answer({"session_id": "bad", "answer": ""})

    def test_failed_provider_does_not_mutate_session(self):
        class BrokenProvider:
            def followup(self, **kwargs):
                raise AIUnavailableError("fournisseur indisponible")
        engine = InterviewLab(load_questions(), BrokenProvider())
        s = engine.start({"family": "rh", "goals": ["rh_motivation"], "count": 1})
        with self.assertRaises(AIUnavailableError):
            engine.answer({"session_id": s["session_id"], "answer": "Réponse"})
        rec = engine.sessions[s["session_id"]]
        self.assertEqual(rec["phase"], "primary")
        self.assertEqual(rec["transcript"], [])

    def test_openai_provider_uses_server_key_and_no_remote_storage(self):
        captured = {}
        class Response(io.BytesIO):
            def __enter__(self): return self
            def __exit__(self, *args): self.close()
        def opener(request, timeout=None):
            captured["url"] = request.full_url
            captured["token"] = request.get_header("Authorization")
            captured["body"] = json.loads(request.data.decode("utf-8"))
            captured["timeout"] = timeout
            return Response(json.dumps({"output":[{"content":[{"type":"output_text","text":"Pourquoi cet arbitrage ?"}]}]}).encode())
        provider = OpenAIRehearsalProvider(api_key="test-key-local-only", opener=opener)
        result = provider.followup(
            question={"fr": "Présentez votre projet"}, answer="J'ai choisi Python",
            family="technical", domain="software", locale="fr",
            goals=["tech_problem_solving"]
        )
        self.assertEqual(result, "Pourquoi cet arbitrage ?")
        self.assertEqual(captured["url"], "https://api.openai.com/v1/responses")
        self.assertEqual(captured["token"], "Bearer test-key-local-only")
        self.assertFalse(captured["body"]["store"])
        self.assertNotIn("test-key-local-only", json.dumps(captured["body"]))
        self.assertIn("J'ai choisi Python", captured["body"]["input"])

if __name__ == "__main__":
    unittest.main()
