"""Database manager for PandemicWatch-AI.
Manages SQLite database creation, migrations, and seeding.
"""

from __future__ import annotations

import os
import sqlite3
from typing import Any, Dict, List, Optional
from werkzeug.security import check_password_hash, generate_password_hash

import config


def get_db_connection() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(os.path.abspath(config.DATABASE_PATH)), exist_ok=True)
    conn = sqlite3.connect(config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create all required tables and seed demo accounts and initial alerts."""
    with get_db_connection() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL COLLATE NOCASE,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Public Health Analyst',
                organization TEXT DEFAULT 'Health Surveillance Bureau',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS alerts (
                id TEXT PRIMARY KEY,
                level TEXT NOT NULL,
                region TEXT NOT NULL,
                message TEXT NOT NULL,
                disease TEXT NOT NULL,
                score INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                action TEXT
            );

            CREATE TABLE IF NOT EXISTS disease_signals (
                id TEXT PRIMARY KEY,
                disease TEXT NOT NULL,
                location TEXT NOT NULL,
                signal TEXT NOT NULL,
                source TEXT NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL,
                score INTEGER NOT NULL
            );
        """)
        conn.commit()

    seed_users()
    seed_alerts()
    seed_signals()


def seed_users():
    demo_users = [
        {
            "email": "officer@pandemicwatch.in",
            "name": "Dr. A. Varma",
            "password": "officer123",
            "role": "District Health Officer",
            "organization": "Kerala State Health Mission",
        },
        {
            "email": "analyst@pandemicwatch.in",
            "name": "Priya Sharma",
            "password": "analyst123",
            "role": "Surveillance Analyst",
            "organization": "Integrated Disease Surveillance Programme (IDSP)",
        },
        {
            "email": "researcher@pandemicwatch.in",
            "name": "Dr. Rajesh Kumar",
            "password": "research123",
            "role": "Senior Epidemiologist",
            "organization": "ICMR National Institute of Virology",
        },
    ]

    with get_db_connection() as conn:
        for u in demo_users:
            cur = conn.cursor()
            cur.execute("SELECT id FROM users WHERE email = ?", (u["email"],))
            if not cur.fetchone():
                pw_hash = generate_password_hash(u["password"])
                cur.execute(
                    "INSERT INTO users (email, name, password_hash, role, organization) VALUES (?, ?, ?, ?, ?)",
                    (u["email"], u["name"], pw_hash, u["role"], u["organization"]),
                )
        conn.commit()


def seed_alerts():
    initial_alerts = [
        ("ALT-001", "HIGH RISK", "Tamil Nadu", "Respiratory disease signals increased.", "Respiratory Infection", 72, "23 Sep 2026", "Dispatch rapid clinical response team."),
        ("ALT-002", "MEDIUM RISK", "Kerala", "Increasing disease-related reports.", "Nipah Virus / Encephalitis", 58, "23 Sep 2026", "Enforce contact tracing protocols."),
        ("ALT-003", "NORMAL", "Karnataka", "No significant abnormal signal detected.", "Seasonal baseline", 24, "23 Sep 2026", "Routine sentinel surveillance."),
    ]
    with get_db_connection() as conn:
        for a in initial_alerts:
            conn.execute(
                "INSERT OR REPLACE INTO alerts (id, level, region, message, disease, score, timestamp, action) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                a
            )
        conn.commit()


def seed_signals():
    initial_signals = [
        ("SIG-101", "Respiratory Infection", "Tamil Nadu", "Increased reports", "Public News", "23 Sep 2026", "⚠ Potential Signal", 72),
        ("SIG-102", "Nipah Virus", "Kerala", "Encephalitis cluster with bat contact", "ProMED RSS", "22 Sep 2026", "🚨 Outbreak Flag", 84),
        ("SIG-103", "Avian Influenza (H5N1)", "Maharashtra", "Poultry mortality die-offs", "Veterinary Directorate", "21 Sep 2026", "⚠ Moderate Cluster", 67),
        ("SIG-104", "Dengue", "Karnataka", "Vector breeding index baseline", "IDSP Weekly Bulletin", "20 Sep 2026", "✓ Baseline Normal", 24),
        ("SIG-105", "Cholera / Waterborne", "West Bengal", "Localized acute diarrhea cases", "Municipal Health Dept", "19 Sep 2026", "⚠ Monitoring", 48),
    ]
    with get_db_connection() as conn:
        for s in initial_signals:
            conn.execute(
                "INSERT OR REPLACE INTO disease_signals (id, disease, location, signal, source, date, status, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                s
            )
        conn.commit()


def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, email, name, password_hash, role, organization, created_at FROM users WHERE email = ?", (email.strip().lower(),))
        row = cur.fetchone()
        if row and check_password_hash(row["password_hash"], password):
            return {
                "id": row["id"],
                "email": row["email"],
                "name": row["name"],
                "role": row["role"],
                "organization": row["organization"],
                "created_at": row["created_at"],
            }
    return None


def create_user(email: str, name: str, password: str, role: str = "Public Health Analyst", organization: str = "Health Dept") -> Dict[str, Any]:
    email = email.strip().lower()
    pw_hash = generate_password_hash(password)
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (email, name, password_hash, role, organization) VALUES (?, ?, ?, ?, ?)",
            (email, name.strip(), pw_hash, role.strip(), organization.strip())
        )
        user_id = cur.lastrowid
        conn.commit()
    return get_user_by_id(user_id)


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, email, name, role, organization, created_at FROM users WHERE id = ?", (user_id,))
        row = cur.fetchone()
        if row:
            return dict(row)
    return None
