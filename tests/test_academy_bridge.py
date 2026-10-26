import sys
from pathlib import Path
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'dev/local-preview'))
from evidence_memory import extract_candidate_claims,evidence_references

class AcademyBridgeTests(unittest.TestCase):
 def test_unverified_claims_are_never_scores(self):
  claims=extract_candidate_claims([{'question':'Pourquoi?', 'answer':"J'ai coordonné trois équipes pendant six mois."}])
  self.assertEqual(claims[0]['source'],'candidate')
  self.assertFalse(claims[0]['verified_competency'])
 def test_sensitive_history_not_propagated(self):
  self.assertEqual(extract_candidate_claims([{'answer':'Je souhaite parler de ma maladie en détail.'}]),[])
 def test_grounded_turn_indexes(self):
  evidence=evidence_references([{'answer':'Exemple A'}, {'answer':'Exemple B'}])
  self.assertEqual([x['turn'] for x in evidence],[0,1])
 def test_bounded_memory(self):
  turns=[{'answer':'Une description de mon expérience professionnelle '+str(i)} for i in range(40)]
  self.assertEqual(len(extract_candidate_claims(turns)),6)
