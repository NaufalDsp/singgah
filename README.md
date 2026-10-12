# Singgah

Panduan destinasi Nusantara dengan kalender musim berbasis data cuaca 30 tahun dan penyusun rencana perjalanan.

## Struktur Proyek

```
singgah/
├── apps/
│   ├── web/        # Astro (Static output) + progressive enhancement
│   └── api/        # Cloudflare Workers (Hono) + D1 SQLite
├── packages/
│   ├── schema/     # Shared Zod schemas
│   └── scoring/    # Pure TS climate scoring & deterministic planner
├── tools/          # Python tools (climate archive, photo picker, anti-slop linter)
└── data/climate/   # 30-year aggregated climate data per destination
```

## Memulai Pengembangan

```bash
# 1. Install dependencies
pnpm install

# 2. Menjalankan web lokal (Astro)
pnpm dev:web

# 3. Menjalankan worker API lokal (Wrangler)
pnpm dev:api

# 4. Menjalankan pengujian scoring
pnpm test
```

## Kebijakan Desain & Konten

- Bebas AI slop: tidak menggunakan foto sintetis, kartu template seragam, atau frasa klise (_hidden gem_, _surga tersembunyi_).
- Transparan: kalender iklim berbasis data Open-Meteo 1994–2023.
