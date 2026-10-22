"""Backend-agnostic, read-only S2-03 question catalogue prototype.

Only published, human-approved questions with published rubrics can be served.
This module does NOT authenticate callers, publish content, or persist to a DB.
The application server must authorize callers before using evaluator_view().
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1] / "data" / "question-bank"
QUESTION_FILES = (
    "rh_questions.json",
    "rh_questions_expansion.json",
    "technical_questions.json",
    "technical_questions_expansion_part1.json",
    "technical_questions_expansion_part2.json",
)


class CatalogError(ValueError):
    """Input or catalogue contract violation."""


class QuestionNotFound(LookupError):
    """Question is not published or does not exist."""


class QuestionBankCatalog:
    """Immutable snapshot of JSON catalog data; not a production persistence layer."""

    def __init__(self, questions: list[dict[str, Any]], rubrics: list[dict[str, Any]]):
        codes = [q.get("code") for q in questions]
        if len(codes) != len(set(codes)):
            raise CatalogError("Question codes must be unique.")
        self._questions = tuple(json.loads(json.dumps(q)) for q in questions)
        self._rubrics = {r["code"]: json.loads(json.dumps(r)) for r in rubrics}
        self._by_code = {q["code"]: q for q in self._questions}

    @classmethod
    def from_repository(cls, root: Path = ROOT) -> "QuestionBankCatalog":
        questions = []
        for filename in QUESTION_FILES:
            with (root / filename).open(encoding="utf-8") as stream:
                questions.extend(json.load(stream)["questions"])
        with (root / "evaluation_rubrics.json").open(encoding="utf-8") as stream:
            rubrics = json.load(stream)["rubrics"]
        return cls(questions, rubrics)

    def _eligible(self, q: dict[str, Any], locale: str) -> bool:
        rubric = self._rubrics.get(q.get("rubric_code"))
        return (
            q.get("status") == "published"
            and q.get("review", {}).get("approved_for_publication") is True
            and rubric is not None
            and rubric.get("status") == "published"
            and bool(q.get("localizations", {}).get(locale, {}).get("prompt"))
        )

    @staticmethod
    def _public(q: dict[str, Any], locale: str) -> dict[str, Any]:
        return {
            "code": q["code"],
            "version": q["version"],
            "family": q["family"],
            "category_code": q["category_code"],
            "question_type": q["question_type"],
            "difficulty": q["difficulty"],
            "primary_competency": q["primary_competency"],
            "locale": locale,
            "prompt": q["localizations"][locale]["prompt"],
        }

    def list_published(
        self, *, locale: str = "fr", family: str | None = None,
        category: str | None = None, competency: str | None = None,
        difficulty: int | None = None, limit: int = 20,
        after: str | None = None,
    ) -> dict[str, Any]:
        """List candidate-safe published questions in deterministic code order.

        Cursor is the previous page's last question code (exclusive).
        """
        if locale not in ("fr", "en"):
            raise CatalogError("Unsupported locale.")
        if type(limit) is not int or not 1 <= limit <= 100:
            raise CatalogError("limit must be an integer between 1 and 100.")
        if difficulty is not None and (type(difficulty) is not int or difficulty not in (1, 2, 3, 4)):
            raise CatalogError("difficulty must be an integer L1-L4.")
        if after is not None and (not isinstance(after, str) or not after.strip()):
            raise CatalogError("after must be a nonblank code.")
        eligible = sorted(
            (q for q in self._questions if
             self._eligible(q, locale)
             and (family is None or q["family"] == family)
             and (category is None or q["category_code"] == category)
             and (competency is None or
                  competency == q["primary_competency"] or
                  competency in q.get("secondary_competencies", []))
             and (difficulty is None or q["difficulty"] == difficulty)
             and (after is None or q["code"] > after)),
            key=lambda q: q["code"],
        )
        page = eligible[:limit]
        return {
            "items": [self._public(q, locale) for q in page],
            "next_cursor": page[-1]["code"] if len(eligible) > limit else None,
        }

    def candidate_view(self, code: str, *, locale: str = "fr") -> dict[str, Any]:
        if locale not in ("fr", "en"):
            raise CatalogError("Unsupported locale.")
        q = self._by_code.get(code)
        if q is None or not self._eligible(q, locale):
            raise QuestionNotFound("No published question matches this code.")
        return self._public(q, locale)

    def evaluator_view(self, code: str, *, locale: str = "fr", trusted_role: str = "") -> dict[str, Any]:
        """Sensitive view. The calling service MUST authenticate and authorize.

        trusted_role is a defense-in-depth assertion, not an authentication mechanism.
        Never proxy this response to a candidate client.
        """
        if trusted_role not in ("evaluator", "admin"):
            raise PermissionError("Trusted evaluator/admin server role required.")
        base = self.candidate_view(code, locale=locale)
        q = self._by_code[code]
        rubric = self._rubrics[q["rubric_code"]]
        return {
            **base,
            "expected_elements_fr": list(q["expected_elements_fr"]),
            "acceptable_variations_fr": q.get("acceptable_variations_fr", ""),
            "red_flags_fr": list(q.get("red_flags_fr", [])),
            "evaluation_notes_fr": q.get("evaluation_notes_fr", ""),
            "rubric": {
                "code": rubric["code"],
                "version": rubric["version"],
                "weights": dict(rubric["weights"]),
                "scale": dict(rubric["scale"]),
            },
        }
