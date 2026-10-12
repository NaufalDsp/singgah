"""
Unsplash Photo Selector & Scrim Calculator.
Menghitung luminans area teks foto L = 0.2126R + 0.7152G + 0.0722B
dan menentukan level scrim (ringan 0.50, sedang 0.65, kuat 0.78).
"""

from pathlib import Path


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


if __name__ == "__main__":
    print("Photo selection & scrim tool siap untuk Fase 1.")
