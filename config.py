"""Configuration settings for PandemicWatch-AI application.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

SECRET_KEY = os.getenv("SECRET_KEY", "pandemicwatch-ai-secret-key-2026")
if os.getenv("VERCEL"):
    DATABASE_PATH = "/tmp/pandemicwatch.db"
else:
    DATABASE_PATH = os.path.join(BASE_DIR, "database", "pandemicwatch.db")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

MODELS_DIR = os.path.join(BASE_DIR, "models")
RISK_MODEL_PATH = os.path.join(MODELS_DIR, "risk_model.pkl")
DISEASE_MODEL_PATH = os.path.join(MODELS_DIR, "disease_model.pkl")
PREPROCESSING_PATH = os.path.join(MODELS_DIR, "preprocessing.pkl")

DATA_DIR = os.path.join(BASE_DIR, "data")
RAW_DATA_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, "processed")
HISTORICAL_DATA_DIR = os.path.join(DATA_DIR, "historical")

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads", "datasets")
ALLOWED_EXTENSIONS = {"csv", "json", "txt", "xlsx"}

DEFAULT_PORT = int(os.getenv("PORT", 5000))
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
