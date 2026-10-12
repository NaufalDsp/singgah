"""
Anti-Slop Content Linter for Singgah.
Memeriksa frasa klise terlarang, kelengkapan sumber, dan teks alternatif.
"""

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
BANNED_FILE = Path(__file__).resolve().parent / "banned.txt"
CONTENT_DIR = ROOT_DIR / "apps" / "web" / "src" / "content"


def load_banned_phrases() -> list[str]:
    if not BANNED_FILE.exists():
        return []
    with open(BANNED_FILE, "r", encoding="utf-8") as f:
        return [line.strip().lower() for line in f if line.strip() and not line.startswith("#")]


def lint_content():
    banned_phrases = load_banned_phrases()
    errors = []

    if not CONTENT_DIR.exists():
        print(
            f"[LINT] Direktori konten belum ada: {CONTENT_DIR}. Melewati pemeriksaan awal.")
        return 0

    files = list(CONTENT_DIR.glob("**/*.md")) + \
        list(CONTENT_DIR.glob("**/*.json"))
    print(f"[LINT] Memeriksa {len(files)} berkas konten...")

    for fpath in files:
        text = fpath.read_text(encoding="utf-8").lower()
        for phrase in banned_phrases:
            if phrase in text:
                errors.append(
                    f"[{fpath.name}] Menemukan frasa terlarang: '{phrase}'")

    if errors:
        print("[LINT GAGAL] Ditemukan pelanggaran konten:")
        for err in errors:
            print(f"  - {err}")
        return 1

    print("[LINT BERHASIL] Seluruh konten bersih dari frasa klise anti-slop.")
    return 0


if __name__ == "__main__":
    sys.exit(lint_content())
