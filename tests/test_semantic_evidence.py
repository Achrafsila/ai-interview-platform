import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'dev/local-preview'))
from semantic_evidence import validate_observations
C=[{'name':'data_analysis','provenance':'jd_explicit'}]
T=[{'answer':'I validated churn cohorts in SQL.'}]
class SemanticTests(unittest.TestCase):
 def test_exact_quote(self):
  result=validate_observations('{"observations":[{"competency":"data_analysis","turn_index":0,"quote":"validated churn cohorts"}]}',T,C)
  self.assertEqual(len(result),1);self.assertTrue(result[0]['review_required'])
 def test_hallucinated_quote_is_rejected(self):
  self.assertEqual(validate_observations('{"observations":[{"competency":"data_analysis","turn_index":0,"quote":"invented amazing capability"}]}',T,C),[])
 def test_invalid_json_is_safe(self):
  self.assertEqual(validate_observations('not json',T,C),[])
 def test_out_of_range_turn_is_rejected(self):
  self.assertEqual(validate_observations('{"observations":[{"competency":"data_analysis","turn_index":3,"quote":"validated churn cohorts"}]}',T,C),[])
 def test_unknown_competency_rejected(self):
  self.assertEqual(validate_observations('{"observations":[{"competency":"leadership","turn_index":0,"quote":"validated churn cohorts"}]}',T,C),[])
