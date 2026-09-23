"""Alert service for PandemicWatch-AI.
Generates and manages multi-level outbreak alerts across regions.
"""

from __future__ import annotations

import datetime as dt
from typing import Any, Dict, List


class AlertService:
    """Manages threshold evaluations and alert notification dispatch."""

    @classmethod
    def get_active_alerts(cls) -> List[Dict[str, Any]]:
        """Return alerts matching the exact user specification."""
        return [
            {
                "id": "ALT-001",
                "level": "HIGH RISK",
                "icon": "🔴",
                "badge_class": "status-high",
                "region": "Tamil Nadu",
                "message": "Respiratory disease signals increased.",
                "disease": "Respiratory Infection",
                "score": 72,
                "timestamp": dt.date.today().strftime("%d %b %Y"),
                "action": "Dispatch rapid response investigation team to Chennai tertiary centers.",
            },
            {
                "id": "ALT-002",
                "level": "MEDIUM RISK",
                "icon": "🟡",
                "badge_class": "status-med",
                "region": "Kerala",
                "message": "Increasing disease-related reports.",
                "disease": "Nipah Virus / Encephalitis",
                "score": 58,
                "timestamp": dt.date.today().strftime("%d %b %Y"),
                "action": "Enforce strict contact tracing and bat roosting avoidance protocols.",
            },
            {
                "id": "ALT-003",
                "level": "NORMAL",
                "icon": "🟢",
                "badge_class": "status-low",
                "region": "Karnataka",
                "message": "No significant abnormal signal detected.",
                "disease": "Seasonal baseline",
                "score": 24,
                "timestamp": dt.date.today().strftime("%d %b %Y"),
                "action": "Continue routine sentinel weekly surveillance.",
            },
        ]
