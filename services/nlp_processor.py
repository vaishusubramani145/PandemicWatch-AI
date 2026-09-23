"""NLP processor service for PandemicWatch-AI.
Performs:
- Triage classification (outbreak vs noise)
- Symptom and clinical keyword extraction
- Regional attribution
- AI explanation generation
"""

from __future__ import annotations

import re
from typing import Any, Dict, List


class NLPProcessor:
    """Natural Language Processing and Triage for epidemiological mentions."""

    SYMPTOM_LEXICON = {
        "respiratory": ["cough", "fever", "dyspnea", "shortness of breath", "sore throat", "pneumonia", "sari", "ili"],
        "arboviral": ["breakbone fever", "retro-orbital pain", "joint pain", "rash", "thrombocytopenia", "dengue"],
        "zoonotic": ["encephalitis", "altered sensorium", "seizures", "bat contact", "myoclonus", "nipah"],
        "avian": ["avian flu", "poultry mortality", "culling", "bird deaths", "h5n1", "h7n9"],
        "enteric": ["diarrhea", "rice-water stool", "vomiting", "dehydration", "cholera", "gastroenteritis"],
    }

    @classmethod
    def triage_mention(cls, text: str) -> Dict[str, Any]:
        """Classify raw text into triage categories."""
        t = text.lower()
        if re.search(r"\b(vaccin|immunis|immuniz|covaxin|covishield)\b", t):
            return {"category": "vaccine", "confidence": 0.85, "keep": False}
        if re.search(r"\b(anniversary|history|years ago|retrospective)\b", t):
            return {"category": "historical", "confidence": 0.80, "keep": False}
        if re.search(r"\b(outbreak|cases|deaths|fatal|admitted|cluster|fever|infection|hospitalized)\b", t):
            return {"category": "outbreak", "confidence": 0.90, "keep": True}
        return {"category": "noise", "confidence": 0.70, "keep": False}

    @classmethod
    def extract_symptoms(cls, text: str) -> List[str]:
        """Extract matched symptom keywords from text."""
        t = text.lower()
        found = []
        for cat, words in cls.SYMPTOM_LEXICON.items():
            for w in words:
                if re.search(rf"\b{re.escape(w)}\b", t):
                    found.append(w)
        return list(set(found))

    @classmethod
    def generate_ai_explanation(cls, region: str, disease: str, risk_score: float) -> Dict[str, Any]:
        """Generate structured human-readable AI explanation matching system wireframe."""
        reasons = [
            "Increase in disease-related reports",
            "Multiple reports from the same region",
            "Increasing symptom mentions",
            "Environmental changes",
        ]
        
        narrative = (
            f"The system detected an anomalous surge in {disease.lower()} signals across {region}. "
            "Syndromic mentions in local media and clinical sentinel posts have increased significantly over the past 7 days. "
            "Ambient temperature and humidity indices are currently optimal for pathogen incubation and transmission."
        )

        return {
            "title": "🤖 AI Risk Explanation",
            "intro": "The system detected:",
            "detected_factors": reasons,
            "conclusion": "These signals contributed to the current model-generated risk level.",
            "narrative": narrative,
        }
