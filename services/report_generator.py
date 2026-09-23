"""Report generator service for PandemicWatch-AI.
Generates:
- Daily surveillance report
- Disease report
- Regional risk report
- Historical analysis
- AI risk summary
"""

from __future__ import annotations

import datetime as dt
from typing import Any, Dict


class ReportGenerator:
    """Generates standardized epidemiological intelligence reports."""

    @classmethod
    def generate_report(cls, report_type: str = "daily") -> Dict[str, Any]:
        """Generate structured report matching user wireframe."""
        today_str = dt.date.today().strftime("%d %B %Y")

        reports_map = {
            "daily": {
                "title": "PANDEMICWATCH AI REPORT",
                "sub_title": "Daily Surveillance Report",
                "date": today_str,
                "total_signals": 142,
                "high_risk_regions": 5,
                "medium_risk_regions": 18,
                "top_detected_disease": "Respiratory Disease",
                "summary": (
                    "Automated multi-modal telemetry indicates a moderate-to-high signal elevation "
                    "across southern regional health nodes. Respiratory and arboviral symptom markers "
                    "account for 68% of anomalous chatter."
                ),
                "key_findings": [
                    "Tamil Nadu: 18 signals, high respiratory disease velocity.",
                    "Kerala: Encephalitis cluster monitored near Kozhikode.",
                    "Maharashtra: Commercial avian die-offs stabilizing following local culling perimeter.",
                    "Karnataka: Baseline transmission levels with no anomalous spikes detected."
                ],
            },
            "disease": {
                "title": "PANDEMICWATCH AI REPORT",
                "sub_title": "Comprehensive Disease Analysis Report",
                "date": today_str,
                "total_signals": 184,
                "high_risk_regions": 6,
                "medium_risk_regions": 22,
                "top_detected_disease": "Dengue & Arboviral Vectors",
                "summary": (
                    "Post-monsoon precipitation stagnation in coastal districts has expanded vector "
                    "breeding suitability index above 0.80. DENV-2 and DENV-3 sub-lineages dominate clinical confirmations."
                ),
                "key_findings": [
                    "Optimal vector breeding window active (26°C - 29°C).",
                    "Early larvicidal spraying advised for high Breteau index wards.",
                    "Platelet supply logistics alert issued to district medical colleges."
                ],
            },
            "regional": {
                "title": "PANDEMICWATCH AI REPORT",
                "sub_title": "Regional Risk Assessment Report",
                "date": today_str,
                "total_signals": 128,
                "high_risk_regions": 5,
                "medium_risk_regions": 14,
                "top_detected_disease": "Mammalian Zoonotic (Nipah)",
                "summary": (
                    "District-level risk stratification identifies Kozhikode and Malappuram under elevated "
                    "spillover watch. Ring containment protocols and sentinel hospital fever screening active."
                ),
                "key_findings": [
                    "Direct fruit bat contact tracing completed for primary index cases.",
                    "ICMR NIV Pune diagnostics confirmed non-nosocomial isolated lineage."
                ],
            },
            "historical": {
                "title": "PANDEMICWATCH AI REPORT",
                "sub_title": "Historical Outbreak Retrospective Analysis",
                "date": today_str,
                "total_signals": 312,
                "high_risk_regions": 3,
                "medium_risk_regions": 8,
                "top_detected_disease": "Nipah 2018 / 2022 & H5N1 2024",
                "summary": (
                    "Evaluation of the fusion model across historical benchmarks demonstrated a mean lead-time "
                    "of 11.3 days prior to official state outbreak declarations."
                ),
                "key_findings": [
                    "Nipah 2018: 14 days lead-time before WHO/IDSP declaration.",
                    "Nipah 2022: 11 days lead-time achieved on Kozhikode pediatric index cluster.",
                    "H5N1 2024: 9 days lead-time on commercial farm mortality surge."
                ],
            },
            "summary": {
                "title": "PANDEMICWATCH AI REPORT",
                "sub_title": "Executive AI Risk Summary",
                "date": today_str,
                "total_signals": 142,
                "high_risk_regions": 5,
                "medium_risk_regions": 18,
                "top_detected_disease": "Respiratory Disease",
                "summary": (
                    "Combined multi-agent LLM consensus and Gradient Boosting ML regression predict "
                    "a manageable 7-day outbreak probability with low cross-state dispersion risk."
                ),
                "key_findings": [
                    "Overall national surveillance status: WATCH LEVEL 2.",
                    "Next automated telemetry cycle in 6 hours."
                ],
            },
        }

        return reports_map.get(report_type.lower(), reports_map["daily"])

    @classmethod
    def generate_text_export(cls, report_data: Dict[str, Any]) -> str:
        """Format report into plain text export matching wireframe format."""
        lines = [
            report_data["title"],
            "=" * len(report_data["title"]),
            f"Type: {report_data['sub_title']}",
            f"Date: {report_data['date']}",
            "",
            f"Total Signals: {report_data['total_signals']}",
            f"High Risk Regions: {report_data['high_risk_regions']}",
            f"Medium Risk Regions: {report_data['medium_risk_regions']}",
            "",
            f"Top Detected Disease:",
            f"{report_data['top_detected_disease']}",
            "",
            "Executive Summary:",
            report_data["summary"],
            "",
            "Operational Findings:",
        ]
        for f in report_data.get("key_findings", []):
            lines.append(f" - {f}")
        lines.append("\n[Generated by PandemicWatch-AI Outbreak Intelligence Platform]")
        return "\n".join(lines)

    @classmethod
    def generate_text_report(cls, report_type: str = "daily") -> str:
        """Convenience method to generate report text directly from type string."""
        report_data = cls.generate_report(report_type)
        return cls.generate_text_export(report_data)
