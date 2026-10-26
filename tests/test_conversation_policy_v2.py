"""Contract tests for the V2 policy, independent of Groq and Supabase."""
import importlib.util
import unittest
from pathlib import Path

FILE = Path(__file__).resolve().parents[1] / "src/interview-engine/conversation_policy.py"
spec = importlib.util.spec_from_file_location("conversation_policy", FILE)
module = importlib.util.module_from_spec(spec)
import sys
sys.modules[spec.name] = module
spec.loader.exec_module(module)
JobBrief, ConversationState, Move = module.JobBrief, module.ConversationState, module.Move


class ConversationPolicyTests(unittest.TestCase):
    def make_state(self):
        return ConversationState(
            JobBrief("HRBP", "Employee relations; help operational managers"),
            ("stakeholder_management", "people_analytics"),
        )

    def test_target_job_required(self):
        with self.assertRaises(ValueError):
            JobBrief(" ")

    def test_job_description_is_explicit_untrusted_context(self):
        job = JobBrief("Data Scientist", "Analyze churn")
        self.assertTrue(job.context()["description_is_explicit"])
        self.assertEqual(job.context()["job_description_untrusted"], "Analyze churn")

    def test_followups_have_a_bounded_budget(self):
        s = self.make_state()
        for _ in range(3):
            self.assertEqual(s.decide(), Move.FOLLOW_UP)
            s.record_turn(question="Why?", answer="Because", move=Move.FOLLOW_UP,
                          competence="stakeholder_management")
        self.assertEqual(s.decide(), Move.TRANSITION)

    def test_candidates_questions_do_not_advance_interview(self):
        s = self.make_state()
        self.assertEqual(s.decide(candidate_asked_question=True), Move.ANSWER_CANDIDATE)
        self.assertEqual(s.next_competency(), "stakeholder_management")

    def test_no_evidence_no_claimed_coverage(self):
        s = self.make_state()
        s.record_turn(question="Example?", answer="I do not know", move=Move.TRANSITION,
                      competence="stakeholder_management")
        self.assertEqual(s.next_competency(), "stakeholder_management")

    def test_evidence_marks_competency(self):
        s = self.make_state()
        s.record_turn(question="Example?", answer="I coached three managers",
                      move=Move.FOLLOW_UP, competence="stakeholder_management",
                      evidence="Coached three managers")
        self.assertEqual(s.next_competency(), "people_analytics")

    def test_clarification_before_followup_and_close(self):
        s = self.make_state()
        self.assertEqual(s.decide(answer_needs_clarification=True), Move.CLARIFY)
        self.assertEqual(s.decide(time_remaining_seconds=10), Move.CLOSE)
        self.assertEqual(s.decide(candidate_asked_question=True,
                                  time_remaining_seconds=10), Move.ANSWER_CANDIDATE)

    def test_reject_unknown_competency(self):
        s = self.make_state()
        with self.assertRaises(ValueError):
            s.record_turn(question="Q", answer="A", move=Move.FOLLOW_UP, competence="unknown")


if __name__ == "__main__":
    unittest.main()
