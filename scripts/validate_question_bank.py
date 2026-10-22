#!/usr/bin/env python3
"""Validate S2-03 local JSON corpus. Run: python scripts/validate_question_bank.py"""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "data" / "question-bank"
FILES = (
    "rh_questions.json",
    "rh_questions_expansion.json",
    "technical_questions.json",
    "technical_questions_expansion_part1.json",
    "technical_questions_expansion_part2.json",
)
EXPECTED = {"rh": 50, "technical": 70}
TECH_TARGETS = {"software": 16, "data_ai": 16, "cloud_devops": 12,
                "cybersecurity": 10, "testing_qa": 8, "business_analysis": 8}


def main():
    questions = []
    errors = []
    for filename in FILES:
        path = ROOT / filename
        data = json.loads(path.read_text(encoding="utf-8"))
        questions.extend(data["questions"])
    codes = [item["code"] for item in questions]
    duplicates = [code for code, count in Counter(codes).items() if count > 1]
    if duplicates:
        errors.append("Duplicate codes: " + ", ".join(duplicates))
    families = Counter(item["family"] for item in questions)
    for family, total in EXPECTED.items():
        if families[family] != total:
            errors.append(f"{family}: expected {total}, got {families[family]}")
    categories = Counter(item["category_code"] for item in questions if item["family"] == "technical")
    for category, target in TECH_TARGETS.items():
        if categories[category] != target:
            errors.append(f"{category}: expected {target}, got {categories[category]}")
    for q in questions:
        code = q["code"]
        if not (1 <= q.get("difficulty", 0) <= 4):
            errors.append(f"{code}: difficulty outside L1-L4")
        if q.get("status") != "draft" or q.get("review", {}).get("approved_for_publication") is not False:
            errors.append(f"{code}: must remain draft and not approved for publication")
        if not q.get("primary_competency") or not q.get("rubric_code"):
            errors.append(f"{code}: missing competency or rubric")
        for lang in ("fr", "en"):
            loc = q.get("localizations", {}).get(lang, {})
            if not loc.get("prompt", "").strip():
                errors.append(f"{code}: missing {lang} prompt")
            if len(loc.get("followup_seeds", [])) < 2:
                errors.append(f"{code}: fewer than two {lang} followups")
        if len(q.get("expected_elements_fr", [])) < 3:
            errors.append(f"{code}: fewer than three expected elements")
    rubric_data = json.loads((ROOT / "evaluation_rubrics.json").read_text(encoding="utf-8"))
    for rubric in rubric_data["rubrics"]:
        if sum(rubric["weights"].values()) != 100:
            errors.append(f"{rubric['code']}: weights don't total 100")
        if rubric.get("status") != "draft":
            errors.append(f"{rubric['code']}: pilot rubric not in draft")
    if errors:
        print("\n".join("ERROR " + e for e in errors))
        raise SystemExit(1)
    print(f"PASS S2-03: {len(questions)} unique questions; 50 RH, 70 technical; "
          "FR/EN prompts, 2 followups/language, >=3 expected elements; all draft; rubrics 100%")


if __name__ == "__main__":
    main()
