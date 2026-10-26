import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'dev/local-preview'))
from conversation_strategy import choose_move, choose_topic

class StrategyTests(unittest.TestCase):
    def test_question_from_candidate(self):
        self.assertEqual(choose_move({}, 'Pouvez-vous préciser ?'), 'ANSWER_CANDIDATE')
    def test_vague_answer_clarification(self):
        self.assertEqual(choose_move({}, 'Je ne sais pas'), 'CLARIFY')
    def test_detailed_answer_followup(self):
        self.assertEqual(choose_move({}, 'Je commencerais par analyser les données en construisant une hypothèse métier.'), 'FOLLOW_UP')
    def test_followup_budget_transition(self):
        self.assertEqual(choose_move({'followups': 2}, 'Je continue à détailler les différents indicateurs.'), 'TRANSITION')
    def test_topic_progression(self):
        state={'competencies':[{'name':'recruitment'}, {'name':'communication'}], 'topic_index':0}
        self.assertEqual(choose_topic(state,'TRANSITION'),'communication')

class ReferencePolicyTests(unittest.TestCase):
    def test_catalog_references_do_not_leak_literal_questions(self):
        import importlib.util
        path=Path(__file__).resolve().parents[1] / 'dev/local-preview/v2_interview.py'
        spec=importlib.util.spec_from_file_location('v2_interview_for_reference_test', path)
        module=importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        class P: pass
        class C:
            name='data_analysis'
        lab=module.V2InterviewLab(P(),lambda *_:[C()], [{'family':'technical','category':'data_analysis','difficulty':2,'fr':'SECRET QUESTION'}])
        refs=lab._references_for('technical',[C()])
        self.assertEqual(refs,[{'category':'data_analysis','difficulty':2}])
        self.assertNotIn('SECRET QUESTION',str(refs))

class BetterRoutingTests(unittest.TestCase):
    def test_english_candidate_clarification(self):
        self.assertEqual(choose_move({}, 'Could you clarify the scope of this case?'), 'ANSWER_CANDIDATE')
    def test_candidate_question_does_not_get_lost_after_budget(self):
        self.assertEqual(choose_move({'followups': 2}, 'Can you repeat the question?'), 'ANSWER_CANDIDATE')
    def test_custom_followup_budget(self):
        self.assertEqual(choose_move({'followups': 1, 'max_followups': 1}, 'I reviewed the data and aligned stakeholders on next steps.'), 'TRANSITION')
    def test_unicode_short_response(self):
        self.assertEqual(choose_move({}, 'J’ai essayé.'), 'CLARIFY')
