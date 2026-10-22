#!/usr/bin/env python3
"""Generate an idempotent PostgreSQL seed for the S2-03 JSON corpus.

Requires migrations 0001 and 0002. No database connection or third-party packages.
Usage: python scripts/generate_question_bank_seed_sql.py > /tmp/question_bank_seed.sql
Never apply seed against a database containing real candidate data without review.
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "data" / "question-bank"
FILES = (
    "rh_questions.json", "rh_questions_expansion.json",
    "technical_questions.json", "technical_questions_expansion_part1.json",
    "technical_questions_expansion_part2.json",
)


def sql_json(data):
    return "'" + json.dumps(data, ensure_ascii=False).replace("'", "''") + "'::jsonb"


def load():
    questions = []
    for name in FILES:
        questions.extend(json.loads((ROOT / name).read_text(encoding="utf-8"))["questions"])
    rubrics = json.loads((ROOT / "evaluation_rubrics.json").read_text(encoding="utf-8"))["rubrics"]
    assert len(questions) == 120 and len({q["code"] for q in questions}) == 120
    assert all(q["status"] == "draft" and q["review"]["approved_for_publication"] is False for q in questions)
    assert all(r["status"] == "draft" for r in rubrics)
    return questions, rubrics


def generate():
    questions, rubrics = load()
    categories = sorted(
        {(q["category_code"], q["family"]) for q in questions}
    )
    competencies = sorted(
        {code for q in questions for code in [q["primary_competency"], *q.get("secondary_competencies", [])]}
    )
    yield "-- Generated from version-controlled JSON. All entries remain draft.\nBEGIN;\n"
    for code, family in categories:
        yield (
            "INSERT INTO question_bank.categories(code,family,label) "
            f"VALUES({sql_json(code)} #>> '{{}}',{sql_json(family)} #>> '{{}}',{sql_json(code)} #>> '{{}}') "
            "ON CONFLICT(code) DO NOTHING;\n"
        )
    for code in competencies:
        yield (
            "INSERT INTO question_bank.competencies(code,label) "
            f"VALUES({sql_json(code)} #>> '{{}}',{sql_json(code)} #>> '{{}}') "
            "ON CONFLICT(code) DO NOTHING;\n"
        )
    for r in rubrics:
        code, family = r["code"], "rh" if r["code"].startswith("RH_") else "technical"
        yield (
            "INSERT INTO question_bank.rubrics(code,family) "
            f"VALUES({sql_json(code)} #>> '{{}}',{sql_json(family)} #>> '{{}}') "
            "ON CONFLICT(code) DO NOTHING;\n"
        )
        yield (
            "INSERT INTO question_bank.rubric_versions(rubric_id,version_no,status,weights,scale)\n"
            f"SELECT id,{int(r['version'])},'draft',{sql_json(r['weights'])},{sql_json(r['scale'])} "
            f"FROM question_bank.rubrics WHERE code={sql_json(code)} #>> '{{}}'\n"
            "ON CONFLICT(rubric_id,version_no) DO NOTHING;\n"
        )
    yield "COMMIT;\n"
    block = """DO $qb_seed$
DECLARE q jsonb; qid uuid; vid uuid; cid uuid; rid uuid; loc text; vcode text; vcategory text;
BEGIN
 FOR q IN SELECT value FROM jsonb_array_elements(PAYLOAD) LOOP
  vcode := q->>'code';
  vcategory := q->>'category_code';
  SELECT cat.id INTO cid FROM question_bank.categories cat
   WHERE cat.code=vcategory AND cat.family=q->>'family';
  IF cid IS NULL THEN RAISE EXCEPTION 'Unknown category: %',vcode; END IF;
  SELECT rv.id INTO rid FROM question_bank.rubric_versions rv
  JOIN question_bank.rubrics r ON r.id=rv.rubric_id
  WHERE r.code=q->>'rubric_code' AND rv.version_no=1;
  IF rid IS NULL THEN RAISE EXCEPTION 'Unknown rubric: %',vcode; END IF;
  INSERT INTO question_bank.questions(code,category_id,origin)
  VALUES(vcode,cid,CASE WHEN q->>'origin'='human_curated_pilot' THEN 'human' ELSE 'ai_proposal' END)
  ON CONFLICT(code) DO NOTHING;
  SELECT qu.id INTO qid FROM question_bank.questions qu WHERE qu.code=vcode;
  vid:=NULL;
  INSERT INTO question_bank.question_versions(
    question_id,version_no,status,question_type,difficulty,rubric_version_id,
    expected_elements,acceptable_variations,red_flags,evaluation_notes,approved_for_publication)
  VALUES(qid,(q->>'version')::integer,'draft',q->>'question_type',(q->>'difficulty')::smallint,
    rid,q->'expected_elements_fr',q->>'acceptable_variations_fr',
    coalesce(q->'red_flags_fr','[]'::jsonb),q->>'evaluation_notes_fr',false)
  ON CONFLICT(question_id,version_no) DO NOTHING RETURNING id INTO vid;
  IF vid IS NOT NULL THEN
   FOREACH loc IN ARRAY ARRAY['fr','en'] LOOP
    INSERT INTO question_bank.localizations(question_version_id,locale,prompt,followup_seeds)
    VALUES(vid,loc,q->'localizations'->loc->>'prompt',q->'localizations'->loc->'followup_seeds');
   END LOOP;
   INSERT INTO question_bank.question_competencies(question_version_id,competency_id,is_primary)
   SELECT vid,c.id,true FROM question_bank.competencies c
    WHERE c.code=q->>'primary_competency';
   INSERT INTO question_bank.question_competencies(question_version_id,competency_id,is_primary)
   SELECT vid,c.id,false
   FROM jsonb_array_elements_text(coalesce(q->'secondary_competencies','[]'::jsonb)) sc
   JOIN question_bank.competencies c ON c.code=sc.value
   WHERE c.code<>q->>'primary_competency' ON CONFLICT DO NOTHING;
   INSERT INTO question_bank.audit_events(entity_kind,entity_id,action,metadata)
   VALUES('question_version',vid,'seeded_draft',jsonb_build_object(
     'original_origin',q->>'origin','review',coalesce(q->'review','{}'::jsonb),
     'source','github:data/question-bank'));
  END IF;
 END LOOP;
END $qb_seed$;
"""
    for start in range(0, len(questions), 20):
        yield block.replace("PAYLOAD", sql_json(questions[start:start+20]))
    yield """
DO $qb_verify$
BEGIN
 IF (SELECT count(*) FROM question_bank.questions)<>120
    OR (SELECT count(*) FROM question_bank.question_versions)<>120
    OR (SELECT count(*) FROM question_bank.localizations)<>240
    OR (SELECT count(*) FROM question_bank.question_competencies WHERE is_primary)<>120
    OR (SELECT count(*) FROM question_bank.question_versions WHERE status<>'draft' OR approved_for_publication)>0
 THEN RAISE EXCEPTION 'S2-03 seed verification failed'; END IF;
END $qb_verify$;
"""


if __name__ == "__main__":
    print("".join(generate()))
