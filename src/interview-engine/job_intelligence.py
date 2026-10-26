"""Job-brief interpretation seed for the V2 interview engine.

Explicit JD terms are kept separate from title-based interview topics.
"""
from dataclasses import dataclass

@dataclass(frozen=True)
class Competency:
    name: str
    provenance: str
    evidence: str

SIGNALS = {
    "people_analytics": ("turnover", "attrition", "people analytics", "kpi rh"),
    "recruitment": ("recrutement", "recruitment", "sourcing", "hiring"),
    "stakeholder_management": ("stakeholders", "parties prenantes", "managers"),
    "data_analysis": ("sql", "data analysis", "analyse de données"),
    "machine_learning": ("machine learning", "modélisation", "predictive model"),
    "business_impact": ("churn", "retention", "impact métier", "roi"),
    "software_design": ("software architecture", "system design"),
}
TITLE_THEMES = {
    "hrbp": ("stakeholder_management", "people_analytics", "recruitment"),
    "data scientist": ("data_analysis", "machine_learning", "business_impact"),
    "responsable recrutement": ("recruitment", "stakeholder_management", "business_impact"),
    "recruitment manager": ("recruitment", "stakeholder_management", "business_impact"),
}

def interpret_job(title: str, description: str = "", max_competencies: int = 5) -> list[Competency]:
    if not isinstance(title, str) or not title.strip() or len(title) > 160:
        raise ValueError("Target job title is required")
    if not isinstance(description, str) or len(description) > 12000:
        raise ValueError("Invalid job description")
    if not 1 <= max_competencies <= 6:
        raise ValueError("Invalid competency limit")
    result = []
    lower = description.casefold()
    for code, terms in SIGNALS.items():
        term = next((t for t in terms if t in lower), None)
        if term:
            result.append(Competency(code, "jd_explicit", term))
    defaults = next((themes for key, themes in TITLE_THEMES.items() if key in title.casefold()), ("communication", "business_impact"))
    for code in defaults:
        if code not in {item.name for item in result}:
            result.append(Competency(code, "title_inferred", title))
    return result[:max_competencies]
