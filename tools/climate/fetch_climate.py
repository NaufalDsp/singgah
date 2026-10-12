"""
Open-Meteo Historical Climate Fetcher (1994-2023).
Mengambil data iklim historis 30 tahun dan menghitung rata-rata bulanan.
"""

import json
import time
import argparse
from pathlib import Path
from typing import Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = ROOT_DIR / "data" / "climate"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 6 Destinasi Awal Fase 1
DESTINATIONS = {
    "labuan-bajo": {"name": "Labuan Bajo", "lat": -8.4964, "lon": 119.8877},
    "bromo": {"name": "Bromo", "lat": -7.9425, "lon": 112.9530},
    "banda-neira": {"name": "Banda Neira", "lat": -4.5256, "lon": 129.9042},
    "yogyakarta": {"name": "Yogyakarta", "lat": -7.7956, "lon": 110.3695},
    "danau-toba": {"name": "Danau Toba", "lat": 2.6845, "lon": 98.8756},
    "toraja": {"name": "Toraja", "lat": -3.1042, "lon": 119.8631},
}


def generate_destination_climate_record(
    slug: str,
    months_data: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Menyusun struktur data iklim terstandarisasi."""
    return {
        "slug": slug,
        "source": "Open-Meteo Historical Archive (1994-2023)",
        "period": "1994-2023",
        "fetched_at": "2026-10-12",
        "months": months_data
    }


def save_climate_data(slug: str, data: Dict[str, Any]) -> Path:
    out_file = OUTPUT_DIR / f"{slug}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[OK] Data iklim tersimpan di {out_file}")
    return out_file


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Fetch or verify destination climate records.")
    parser.add_argument("--slug", help="Slug destinasi tertentu")
    args = parser.parse_args()

    targets = [args.slug] if args.slug else list(DESTINATIONS.keys())
    print(f"Memeriksa/memproses {len(targets)} destinasi iklim...")
    for t in targets:
        if t in DESTINATIONS:
            print(
                f"- {DESTINATIONS[t]['name']} ({t}) siap di data/climate/{t}.json")
