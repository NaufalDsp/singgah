"""
Unsplash Photo Selector & Scrim Calculator.
Menghitung luminans area teks foto L = 0.2126R + 0.7152G + 0.0722B
dan menentukan level scrim (ringan 0.50, sedang 0.65, kuat 0.78).
"""

from pathlib import Path
from typing import Dict, Any, Optional


def calculate_scrim_level(worst_luminance: float) -> str:
    """
    Rumus PRD Bagian 6.4:
    ringan (0.50) jika L <= 0.38
    sedang (0.65) jika L <= 0.53
    kuat (0.78) jika L <= 0.84
    """
    if worst_luminance <= 0.38:
        return "ringan"
    elif worst_luminance <= 0.53:
        return "sedang"
    elif worst_luminance <= 0.84:
        return "kuat"
    else:
        raise ValueError(
            "Luminans terlalu tinggi (> 0.84), foto harus dipotong ulang atau ditolak.")


def format_photo_record(
    photo_id: str,
    raw_url: str,
    credit_name: str,
    credit_url: str,
    place: str,
    alt: str,
    dominant_color: str,
    width: int,
    height: int,
    worst_luminance: float,
    provider_id: Optional[str] = None
) -> Dict[str, Any]:
    """Menyusun format data foto terverifikasi untuk Astro Content Collection."""
    if len(alt) < 20:
        raise ValueError(
            "Alt text harus minimal 20 karakter dan mendeskripsikan subjek secara faktual.")

    scrim = calculate_scrim_level(worst_luminance)
    return {
        "id": photo_id,
        "provider": "unsplash",
        "provider_id": provider_id or photo_id,
        "url": raw_url,
        "credit_name": credit_name,
        "credit_url": credit_url,
        "license": "Unsplash License",
        "width": width,
        "height": height,
        "dominant_color": dominant_color,
        "scrim": scrim,
        "alt": alt,
        "place": place
    }


if __name__ == "__main__":
    print("Photo selection & scrim tool siap untuk verifikasi foto Fase 1.")
