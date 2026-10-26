"""Job-intelligence smoke and provenance contracts."""
import importlib.util
from pathlib import Path
import unittest

PATH = Path(__file__).resolve().parents[1] / "src/interview-engine/job_intelligence.py"
spec = importlib.util.spec_from_file_location("job_intelligence", PATH)
module = importlib.util.module_from_spec(spec)
import sys
sys.modules[spec.name] = module
spec.loader.exec_module(module)


class JobIntelligenceTests(unittest.TestCase):
    def test_title_required(self):
        with self.assertRaises(ValueError):
            module.interpret_job(" ")

    def test_explicit_description_takes_priority(self):
        output = module.interpret_job("Data Scientist", "Analyze churn with SQL")
        self.assertEqual(output[0].name, "data_analysis")
        self.assertEqual(output[0].provenance, "jd_explicit")
        self.assertTrue(any(x.name == "business_impact" and x.provenance == "jd_explicit" for x in output))

    def test_without_description_themes_are_only_inferred(self):
        output = module.interpret_job("HRBP")
        self.assertTrue(output)
        self.assertTrue(all(x.provenance == "title_inferred" for x in output))

    def test_no_duplicate_competencies(self):
        output = module.interpret_job("HRBP", "Managers and people analytics")
        self.assertEqual(len({item.name for item in output}), len(output))

    def test_input_bounds(self):
        with self.assertRaises(ValueError):
            module.interpret_job("Data Scientist", "a" * 12001)


if __name__ == "__main__":
    unittest.main()
