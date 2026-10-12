"""
Open-Meteo Historical Climate Fetcher (1994-2023).
Mengambil data iklim historis 30 tahun dan menghitung rata-rata bulanan.
"""

import json
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = ROOT_DIR / "data" / "climate"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def fetch_destination_climate(slug: str, lat: float, lon: float):
    print(
        f"Mengambil data iklim historis untuk {slug} (lat: {lat}, lon: {lon})...")
    # Endpoint Open-Meteo Archive API
    # archive-api.open-meteo.com/v1/archive?latitude=...&longitude=...&start_date=1994-01-01&end_date=2023-12-31
    # Implementasi penuh dijalankan pada Fase 1.
    pass


if __name__ == "__main__":
    print("Climate pipeline tool siap untuk Fase 1.")
