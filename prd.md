# PRD — Singgah

**Panduan destinasi Nusantara dengan kalender musim dan penyusun rencana perjalanan**

**Versi:** 1.0
**Penyusun:** Naufal
**Tanggal:** 12 Oktober 2026
**Status:** Siap dieksekusi
**Dokumen pasangan:** `design.md`

> **Tentang nama.** *Singgah* berarti berhenti sebentar di suatu tempat dalam perjalanan. Nama ini pendek, mudah dieja, dan menjelaskan tujuan situs: membantu orang memutuskan tempat mana yang layak disinggahi, dan kapan. Saya tidak bisa memeriksa ketersediaan nama, domain, atau merek ini. Sebelum dipakai serius, cek domain, hasil pencarian Google, dan pangkalan data merek DJKI. Alternatif cadangan ada di bagian 20 (D2).

---

## 1. Ringkasan

Singgah adalah situs panduan destinasi di Indonesia yang menjawab dua pertanyaan yang paling sering membuat orang menunda liburan: **"ke mana?"** dan **"kapan waktu yang tepat?"**

Tiga hal membedakannya dari blog wisata biasa:

1. **Kalender musim berbasis data.** Setiap destinasi punya strip 12 bulan yang dihitung dari rata-rata cuaca 30 tahun, bukan dari opini penulis. Rumus penilaiannya terbuka dan bisa diperiksa (bagian 13).
2. **Rencana Cepat.** Pengunjung memilih bulan, lama perjalanan, dan suasana. Singgah mengembalikan destinasi yang paling cocok, lengkap dengan alasannya dan kerangka rencana harian.
3. **Penyusun rencana yang bisa dibagikan.** Rencana disimpan di akun, dibagikan lewat tautan, dan bisa dicetak.

Situsnya sengaja **tidak menjual apa pun**: tidak ada tiket, hotel, atau tautan afiliasi. Alasannya praktis, bukan sekadar prinsip. Layanan cuaca gratis yang dipakai (Open-Meteo) melarang penggunaan komersial, dan API tiket serta hotel yang layak umumnya berbayar atau butuh kemitraan.

Seluruh sistem berjalan di tingkat gratis, dibangun bertahap, dan **setiap fase menghasilkan situs yang sudah bisa dibuka publik**.

---

## 2. Keputusan yang saya ambil

Kamu meminta saya memilih. Ini hasilnya beserta alasannya.

| Pertanyaan | Keputusan | Alasan singkat |
|---|---|---|
| Jenis situs | **Panduan destinasi editorial + penyusun rencana perjalanan** | Cocok dengan bahasa visual referensi (foto penuh layar, tipografi besar). Tidak butuh API berbayar. Punya banyak fitur dinamis yang bisa dibangun gratis |
| Nama | **Singgah** | Lihat catatan di atas |
| Frontend | **Astro** (HTML statis) + pulau interaktif | Halaman wisata harus cepat dan terindeks mesin pencari |
| Backend | **Cloudflare Workers** (Hono, TypeScript) | Tidak tertidur saat sepi, gratis, satu penyedia dengan hosting |
| Basis data | **Cloudflare D1** (SQLite) | Cukup untuk akun, rencana, dan tips; gratis |
| Data cuaca | **Open-Meteo** | Gratis, tanpa kunci API, cakupan global |
| Alat data | **Python** | Mengolah data iklim dan memeriksa konten, sesuai keahlianmu |
| Hosting | **Cloudflare Workers + static assets** | Satu proyek untuk halaman statis dan API |

### 2.1 Jenis situs yang dipertimbangkan

| Pilihan | Dinilai | Keputusan |
|---|---|---|
| Agregator tiket dan hotel (seperti panel "Search Flights" di referensi) | Butuh API berbayar atau kemitraan. Tautan afiliasi bersifat komersial dan melanggar syarat Open-Meteo gratis. Hasilnya cuma salinan situs yang sudah ada | **Ditolak** |
| Blog atau majalah wisata | Mudah, tetapi hampir tidak ada bagian dinamis yang bisa didemonstrasikan | Ditolak (dipakai sebagai bagian kecil, "Catatan lapangan") |
| **Panduan destinasi + penyusun rencana** | Editorial dan dinamis sekaligus. Data iklim, cuaca, akun, dan komunitas semuanya bisa gratis | **Dipilih** |

### 2.2 Tech stack: kenapa ini, bukan yang lain

| Alternatif | Kenapa tidak |
|---|---|
| React SPA + FastAPI di Render | Server gratis Render tidur setelah sekitar 15 menit tanpa permintaan dan butuh sekitar satu menit untuk bangun. Untuk situs wisata, kesan pertama adalah segalanya. SPA juga lemah untuk SEO |
| Next.js dengan render di server | Kuat, tetapi render di server memakan CPU. Workers gratis dibatasi **10 ms CPU per permintaan**. Astro mengirim HTML jadi dan hanya menghidrasi bagian yang interaktif |
| Backend Python di hosting gratis | Hampir semua layanan gratis yang menjalankan proses Python akan tidur. Python tetap dipakai, tetapi untuk **alat data** (bagian 11), bukan untuk melayani pengunjung |
| WordPress/CMS jadi | Tampilan sulit dibuat orisinal, dan tidak ada nilai rekayasa untuk portofolio |

Perhatikan satu konsekuensi desain: karena CPU dibatasi 10 ms, **halaman tidak dirender di Worker**. Halaman dibuat saat build dan disajikan sebagai file statis (permintaan file statis gratis). Worker hanya melayani `/api/*`.

---

## 3. Improvisasi terhadap referensi

Referensi yang kamu berikan adalah situs wisata dengan hero foto penuh layar, headline serif besar, panel pencarian penerbangan, deretan kartu destinasi, baris lencana kepercayaan, dan angka statistik. Saya ambil **prinsip**-nya (foto sebagai pusat, tipografi besar, pencarian langsung di layar pertama) dan mengubah yang lain, karena beberapa elemennya justru ciri desain generik atau tidak bisa dibangun jujur.

| Di referensi | Di Singgah | Alasan |
|---|---|---|
| Panel pencarian penerbangan | **Rencana Cepat**: tujuan, bulan, lama, suasana | Tidak ada API tiket gratis yang layak. Rencana Cepat memakai data iklim sendiri dan benar-benar berfungsi |
| Panel kaca gelap di kanan | Panel kertas solid menempel di dasar hero | Efek kaca dan blur termasuk pola generik. Panel solid lebih terbaca di atas foto |
| Deretan kartu destinasi yang seragam | Grid editorial tak simetris + "Sedang bagus bulan ini" | Kartu identik berjajar adalah pola template. Isinya juga dibuat dinamis berdasarkan bulan |
| Lencana "Best Price Guarantee, 24/7 Support…" | **Dihapus** | Singgah tidak menjual apa pun, jadi klaim itu tidak ada dasarnya |
| Statistik "500+ destinasi, 10K+ pelancong, 4.9 rating" | **Dihapus**. Hanya angka nyata yang dihitung dari konten ("12 destinasi, diperbarui 12 Okt 2026") | Statistik yang tidak punya sumber adalah bukti sosial palsu |
| Label huruf kapital kecil di atas headline | Tidak dipakai | Pola template yang umum |
| Palet mint-teal di atas biru gelap | Kabut + tinta laut, aksen **kunyit** | Lebih khas dan lebih berhubungan dengan subjeknya |
| Foto hero tanpa keterangan | Keterangan lokasi, koordinat, dan kredit fotografer | Situs panduan perlu menyebut sumbernya |
| (tidak ada) | **Kalender musim** sebagai elemen khas | Satu hal yang dirancang untuk diingat orang |
| (tidak ada) | Cetak rencana, tautan berbagi, halaman "Catatan data" | Fitur yang berguna dan memperlihatkan kejujuran data |

---

## 4. Masalah & tujuan

### 4.1 Masalah
- Informasi "kapan waktu terbaik" di banyak situs wisata hanya satu kalimat umum, tanpa data. Padahal pola musim berbeda antar wilayah di Indonesia (sebagian Maluku, misalnya, tidak mengikuti pola Jawa dan Bali).
- Menyusun rencana perjalanan biasanya terjadi di catatan ponsel atau tabel yang tersebar, sulit dibagikan ke teman seperjalanan.
- Banyak situs wisata ramai iklan, lambat di ponsel, dan penuh klise ("surga tersembunyi", "wajib dikunjungi").

### 4.2 Tujuan
| Tujuan | Ukuran |
|---|---|
| Orang langsung paham dan tertarik | Dari membuka situs sampai melihat hasil Rencana Cepat ≤ 20 detik |
| Cepat di ponsel | LCP halaman beranda dan destinasi ≤ 2,2 detik pada 4G ponsel kelas menengah |
| Data yang bisa dipercaya | Setiap kalender musim menampilkan sumber, periode, dan batasannya. Konten faktual punya tanggal verifikasi |
| Biaya nol | Seluruh arsitektur berjalan di tingkat gratis |
| Portofolio yang meyakinkan | Penilai bisa melihat fitur statis, dinamis, akun, dan pipeline data dalam satu produk |

---

## 5. Pengguna

| Persona | Kebutuhan | Fitur utama |
|---|---|---|
| **Pelancong fleksibel** punya libur 4 hari di bulan November dan belum tahu mau ke mana | Rekomendasi menurut bulan, bukan menurut tempat | Rencana Cepat, Sedang bagus bulan ini |
| **Perencana** sudah punya tujuan dan butuh rencana harian untuk dibagikan ke teman | Menyusun, mengurutkan, dan membagikan rencana | Penyusun rencana, tautan berbagi, cetak |
| **Pembaca penasaran** membaca soal tempat yang belum tentu dikunjungi | Tulisan yang jujur dan nyaman dibaca | Halaman destinasi, Catatan lapangan |
| **Penilai portofolio** (rekruter atau teknisi) | Memahami proyek dengan cepat dan menemukan bukti kualitas | Beranda statis yang jelas, halaman Catatan data, repositori, tes |

Pengguna masuk dengan Google bila ingin menyimpan rencana. **Semua fitur baca dan Rencana Cepat bisa dipakai tanpa akun.**

---

## 6. Metrik

| Ukuran | Target |
|---|---|
| LCP beranda dan halaman destinasi (4G, ponsel kelas menengah) | ≤ 2,2 detik |
| CLS | ≤ 0,05 |
| INP | ≤ 200 ms |
| JavaScript awal beranda (terkompresi) | ≤ 30 KB |
| JavaScript halaman penyusun rencana (terkompresi) | ≤ 180 KB |
| Berat foto hero | ≤ 160 KB (AVIF, lebar 1600 px) |
| Lighthouse mobile: Performance / Accessibility / SEO | ≥ 92 / ≥ 97 / ≥ 97 |
| Waktu proses CPU rata-rata di Worker | ≤ 5 ms (batas keras gratis: 10 ms) |
| Rasio cache cuaca | ≥ 90% permintaan dilayani dari cache |
| Konten | 12 destinasi pada v1; 100% lolos pemeriksa konten |

---

## 7. Prinsip produk

1. **Foto yang berbicara, antarmuka yang menepi.** Layar pertama berisi foto sungguhan. Tidak ada gambar buatan AI, ilustrasi dekoratif, atau foto stok yang jelas stok.
2. **Data sebelum klaim.** Kalimat seperti "waktu terbaik Mei sampai September" harus bisa ditelusuri ke angka.
3. **Jujur soal batas.** Data iklim itu rata-rata, bukan ramalan. Situs mengatakannya langsung.
4. **Statis di depan, dinamis di belakang.** Apa pun yang bisa dihitung saat build tidak dihitung saat pengunjung datang.
5. **Kuota gratis adalah anggaran.** Setiap fitur dinilai juga dari seberapa banyak ia memakan jatah.
6. **Gagal dengan lembut.** Bila API sedang bermasalah, halaman statis tetap utuh dan fitur dinamis menjelaskan keadaannya.

---

## 8. Lingkup

### 8.1 Masuk lingkup v1
- Beranda, daftar dan detail destinasi, jelajah menurut suasana, pencarian, Catatan lapangan (artikel).
- Kalender musim untuk setiap destinasi, dihitung dari data iklim 30 tahun.
- Cuaca sekarang dan prakiraan 7 hari per destinasi (Open-Meteo, lewat cache).
- Rencana Cepat dan halaman saran.
- Akun lewat Google; penyusun rencana; tautan berbagi; tampilan cetak; favorit.
- Tips pelancong dengan moderasi.
- Halaman atribusi, Catatan data, dan Privasi.
- 12 destinasi yang ditulis orisinal, dengan foto berlisensi dan terkredit.

### 8.2 Di luar lingkup v1
- Pemesanan tiket, hotel, atau tur, dan monetisasi apa pun (iklan, afiliasi).
- Ulasan berbintang dan peringkat. Tips pelancong sudah cukup.
- Unggahan foto oleh pengguna (menambah beban moderasi dan penyimpanan).
- Aplikasi seluler native.
- Konten di luar Indonesia.
- Rekomendasi berbasis AI/LLM. Perencana memakai aturan yang transparan, dan itu memang sengaja (lihat 13.3).
- Notifikasi email atau push.

---

## 9. Arsitektur

### 9.1 Gambaran umum

```
                         Pengunjung
                             │
                             ▼
            ┌──────────────────────────────────┐
            │  Cloudflare Workers (satu proyek)│
            │                                  │
   /*  ───► │  Static assets (HTML, CSS, JS,   │  gratis, tanpa menjalankan Worker
            │  gambar, indeks pencarian)       │
            │                                  │
 /api/* ──► │  Worker (Hono, TypeScript)       │
            └───────┬──────────┬───────────────┘
                    │          │
                    ▼          ▼
               D1 (SQLite)   Open-Meteo (cuaca, di-cache)
               akun, rencana,
               favorit, tips         Google OAuth (login)

 Dibuat saat build (bukan saat pengunjung datang):
   Konten Markdown ──► Astro ──► HTML statis
   Alat Python ──► data/climate/*.json ──► kalender musim

 GitHub Actions: tes, build, migrasi D1, deploy, pemeriksa foto dan konten
```

### 9.2 Pilihan teknologi

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Situs | Astro (output statis), TypeScript | Content Collections untuk destinasi dan artikel |
| Interaktivitas ringan | JavaScript biasa (progressive enhancement) | Beranda, Rencana Cepat, cuaca, kalender musim. Bila JS gagal, formulir tetap berfungsi sebagai GET biasa |
| Interaktivitas berat | React, hanya di `/rencana/*` dan `/akun` | Penyusun rencana dengan seret dan lepas; dipisah agar beranda tetap ringan |
| API | Hono di Workers | Validasi dengan Zod |
| Basis data | D1 dengan Drizzle ORM | Migrasi lewat Wrangler |
| Autentikasi | Google OAuth (Authorization Code + PKCE), sesi buram di D1 | Cookie HttpOnly. Tanpa kata sandi yang harus disimpan |
| Logika skor | Paket TypeScript murni `packages/scoring` | Dipakai bersama oleh Worker dan peramban |
| Pencarian | Pagefind (indeks statis di sisi klien) | Gratis, instan, tanpa kueri ke server |
| Peta (fase 5) | MapLibre GL | Sumber ubin: lihat bagian 10.3 |
| Alat data | Python 3.12 (httpx, pydantic, pytest) | Mengambil data iklim, memeriksa konten dan foto |
| Tes | Vitest, `@cloudflare/vitest-pool-workers`, Playwright, axe-core, Lighthouse CI | |
| CI/CD | GitHub Actions + Wrangler | Gratis untuk repositori publik |
| Analitik | Cloudflare Web Analytics (tanpa cookie) | Cek ketersediaan di dashboard saat mendaftar |

### 9.3 Konfigurasi penyajian

```jsonc
// apps/api/wrangler.jsonc  (acuan; cek sintaks terbaru di dokumentasi Wrangler)
{
  "name": "singgah",
  "main": "src/index.ts",
  "compatibility_date": "2026-10-12",
  "assets": {
    "directory": "../web/dist",
    "not_found_handling": "404-page",
    "run_worker_first": ["/api/*"]
  },
  "d1_databases": [
    { "binding": "DB", "database_name": "singgah", "database_id": "<diisi-setelah-dibuat>" }
  ]
}
```

> **Verifikasi:** dokumentasi migrasi Cloudflare menjelaskan `run_worker_first` sebagai `true` (Worker berjalan lebih dulu untuk semua permintaan). Bentuk daftar pola seperti `["/api/*"]` untuk membatasinya hanya ke jalur API saya ambil dari dokumentasi routing, tetapi halaman yang saya baca tidak merincinya. **Cek halaman "Worker script routing" sebelum memakainya.** Kalau berbeda, alternatifnya memisahkan dua Worker atau memakai pola rute.

### 9.4 Dua nasihat arsitektur yang menentukan

- **Konten adalah kode.** Destinasi, artikel, dan foto disimpan sebagai berkas di Git. Hasilnya cepat, bisa ditinjau lewat pull request, dan **tidak menghabiskan satu pun pembacaan D1**.
- **D1 hanya untuk data pengguna.** Akun, rencana, favorit, dan tips. Ini menjaga pemakaian jauh di bawah batas harian.

---

## 10. Batas tingkat gratis

Diverifikasi pada **12 Oktober 2026** dari dokumentasi resmi. Angka seperti ini berubah, jadi **cek ulang sebelum mulai**.

### 10.1 Cloudflare

| Layanan | Batas yang relevan | Dampak ke desain |
|---|---|---|
| Workers (gratis) | 100.000 permintaan/hari, **10 ms CPU per permintaan**, 50 subrequest per pemanggilan, 20.000 berkas statis per versi, maksimum 25 MiB per berkas. Permintaan berkas statis gratis | Hanya `/api/*` yang menjalankan Worker. Halaman tidak dirender di server. Satu permintaan cuaca = satu subrequest |
| D1 (gratis) | 5 juta baris dibaca/hari, 100.000 baris ditulis/hari, 5 GB total. **Sejak 1 September 2026, kueri gagal bila batas harian terlampaui**, dan baru pulih pukul 00.00 UTC (07.00 WIB) | Semua kueri wajib berindeks. API mengembalikan galat yang jelas bila batas tercapai. Halaman statis tidak terpengaruh |
| Custom domain | Workers tidak mendukung domain di luar zona Cloudflare (Pages mendukung) | Pakai `*.workers.dev`, atau pindahkan DNS domain ke Cloudflare |

Sumber: [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [pemberlakuan batas D1 1 Sep 2026](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/), [batas Workers](https://developers.cloudflare.com/workers/platform/limits/), [panduan migrasi Pages ke Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/).

### 10.2 Layanan pihak ketiga

| Layanan | Batas dan syarat | Dampak ke desain |
|---|---|---|
| **Open-Meteo** (cuaca, data historis) | Gratis hanya untuk **penggunaan non-komersial**. Di bawah 10.000 panggilan/hari, 5.000/jam, 600/menit. Data berlisensi CC BY 4.0 (wajib atribusi) | Situs tanpa iklan dan afiliasi. Respons di-cache 30 menit. Data iklim dihitung sekali secara offline. Atribusi tampil di footer dan halaman Catatan data |
| **Unsplash API** | Mode demo 50 permintaan/jam; produksi 1.000/jam setelah disetujui. Hanya permintaan JSON ke `api.unsplash.com` yang dihitung. **Wajib memakai URL gambar dari API secara langsung (hotlink)**, mempertahankan parameter `ixid`, mencantumkan atribusi fotografer dan Unsplash, serta memanggil endpoint pelacakan unduhan saat sebuah foto dipakai | Foto Unsplash tidak disalin ke penyimpanan sendiri. Tabel foto menyimpan `provider` dan URL aslinya. Pemilihan foto dilakukan lewat alat Python yang memanggil endpoint pelacakan |
| **Protomaps / OpenStreetMap** | Menyajikan ubin sendiri hanya memakan biaya penyimpanan dan permintaan. Data OSM berlisensi ODbL (wajib atribusi) | Peta ditunda ke fase 5 dan opsional. Lihat 10.3 |

Sumber: [syarat Open-Meteo](https://open-meteo.com/en/terms), [dokumentasi Unsplash API](https://unsplash.com/documentation), [FAQ Protomaps](https://protomaps.com/faq).

### 10.3 Peta (opsional, fase 5)
Dua jalur, dengan kompromi yang jelas:
- **Penyedia ubin vektor gratis** (mis. OpenFreeMap). Paling sederhana. **Saya belum memverifikasi syaratnya**, jadi baca dulu.
- **PMTiles milik sendiri di R2**, diekstrak hanya untuk wilayah destinasi. Kendali penuh, tetapi R2 biasanya meminta metode pembayaran terdaftar walau pemakaiannya di bawah kuota gratis, dan ukuran berkas ekstrak belum saya periksa.

Keputusan ada di D6.

---

## 11. Strategi data

Tiga jenis data diperlakukan berbeda, dan ini inti rancangannya.

| Jenis | Contoh | Disimpan di | Dihasilkan | Diubah |
|---|---|---|---|---|
| **Konten editorial** | Destinasi, artikel, foto | Git (Markdown dan JSON) | Ditulis manual | Lewat pull request |
| **Data terhitung** | Iklim bulanan per destinasi | `data/climate/*.json` di Git | Skrip Python, sekali dan saat koordinat berubah | Jalankan ulang skrip |
| **Data pengguna** | Akun, rencana, favorit, tips | D1 | Dibuat pengguna | Lewat API |
| **Data langsung** | Cuaca sekarang | Cache edge (30 menit) | Open-Meteo | Otomatis kedaluwarsa |

### 11.1 Alat Python (`tools/`)

| Alat | Fungsi |
|---|---|
| `climate/fetch_climate.py` | Membaca koordinat setiap destinasi, mengambil data harian periode **1994–2023** dari API historis Open-Meteo (`archive-api.open-meteo.com`), menghitung rata-rata bulanan (curah hujan total, jumlah hari hujan ≥ 1 mm, suhu maksimum rata-rata, suhu minimum rata-rata), dan menulis `data/climate/{slug}.json` beserta metadata sumber dan tanggal ambil. Permintaan periode panjang berbobot besar, jadi dipecah per beberapa tahun dan diberi jeda |
| `photos/pick_photo.py` | Mencari foto di Unsplash, memanggil endpoint pelacakan unduhan, lalu menulis entri foto (ID, URL dengan `ixid`, kredit, lisensi, dimensi, warna dominan) ke `src/content/photos/` |
| `lint/content_lint.py` | Memeriksa seluruh konten (lihat 24) dan dijalankan di CI |
| `photos/check_links.py` | Mengecek bahwa setiap URL foto masih hidup; dijalankan mingguan di CI |

Pada data iklim, Open-Meteo memakai reanalisis dengan resolusi spasial kasar. Artinya lembah, kaki gunung, dan pesisir sempit bisa menyimpang dari angka. Batas ini ditulis di halaman Catatan data (F13).

---

## 12. Model konten

### 12.1 Skema destinasi (Astro Content Collections)

```ts
// apps/web/src/content.config.ts (ringkas)
import { z, defineCollection } from 'astro:content';

const highlight = z.object({
  id: z.string(),                       // slug unik dalam destinasi
  name: z.string().min(2),
  kind: z.enum(['alam', 'budaya', 'kuliner', 'aktivitas', 'transit']),
  area: z.string(),                     // pengelompok lokasi untuk menekan perpindahan
  duration: z.enum(['singkat', 'setengah-hari', 'sehari']),
  best_time: z.enum(['pagi', 'siang', 'sore', 'bebas']).default('bebas'),
  note: z.string().max(240),
  coords: z.object({ lat: z.number(), lon: z.number() }).optional(),
});

const destinations = defineCollection({
  schema: z.object({
    name: z.string(),
    region: z.object({ island: z.string(), province: z.string() }),
    timezone: z.enum(['WIB', 'WITA', 'WIT']),
    coords: z.object({ lat: z.number(), lon: z.number() }),
    profile: z.enum(['pantai', 'gunung', 'kota', 'selam', 'budaya']), // menentukan bobot skor
    moods: z.array(z.string()).min(1),
    summary: z.string().max(160),
    hero: z.object({ photo: z.string(), focal: z.object({ x: z.number(), y: z.number() }) }),
    typical_days: z.object({ min: z.number().int(), max: z.number().int() }),
    getting_there: z.object({ notes: z.string(), sources: z.array(z.string().url()).min(1) }),
    highlights: z.array(highlight).min(4),
    season_notes: z.array(z.object({
      months: z.array(z.number().int().min(1).max(12)),
      note: z.string().max(200),
      sources: z.array(z.string().url()).optional(),
    })).default([]),
    season_overrides: z.array(z.object({
      month: z.number().int().min(1).max(12),
      level: z.enum(['kurang', 'cukup', 'baik', 'sangat-baik']),
      reason: z.string(),             // wajib, ditampilkan ke pembaca
    })).default([]),
    verified_at: z.string().date(),   // tanggal terakhir fakta diperiksa
    updated_at: z.string().date(),
  }),
});
```

Isi Markdown berisi uraian destinasi. Tiga aturan penting: **setiap fakta non-umum wajib punya sumber**, `verified_at` yang lebih tua dari 12 bulan memunculkan peringatan di CI, dan `season_overrides` wajib menyertakan alasan yang tampil ke pembaca.

### 12.2 Foto

```ts
const photos = defineCollection({
  type: 'data',
  schema: z.object({
    provider: z.enum(['unsplash', 'sendiri', 'wikimedia']),
    provider_id: z.string().optional(),
    url: z.string().url(),            // untuk Unsplash: URL API apa adanya, termasuk ixid
    credit_name: z.string(),
    credit_url: z.string().url(),
    license: z.string(),
    width: z.number().int(), height: z.number().int(),
    dominant_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    lqip: z.string().optional(),      // placeholder kecil (data URI)
    alt: z.string().min(20),          // bahasa Indonesia, menjelaskan apa yang terlihat
    place: z.string(),                // "Nusa Penida, Bali"
    coords: z.object({ lat: z.number(), lon: z.number() }).optional(),
  }),
});
```

Aturan: **hanya foto asli**, tidak ada gambar hasil AI. Foto Unsplash di-hotlink sesuai syaratnya; foto milik sendiri dan Wikimedia diproses Astro menjadi AVIF/WebP berbagai lebar.

### 12.3 Koleksi lain
`moods` (suasana: nama, deskripsi, foto), `articles` (Catatan lapangan: judul, ringkasan, tanggal, waktu baca, destinasi terkait). Skema serupa; sumber faktual wajib.

---

## 13. Kalender musim

Ini elemen khas Singgah, jadi aturannya harus eksplisit dan teruji.

### 13.1 Masukan
Dari `data/climate/{slug}.json`, untuk setiap bulan: `precip_mm` (curah hujan total rata-rata), `wet_days` (hari dengan hujan ≥ 1 mm), `tmax_c` (suhu maksimum rata-rata).

### 13.2 Perhitungan

```ts
// packages/scoring/src/season.ts (inti; konstanta per profil ada di profiles.ts)
type Month = { precip_mm: number; wet_days: number; tmax_c: number };
type Level = 'kurang' | 'cukup' | 'baik' | 'sangat-baik';

const lerp = (v: number, a: number, b: number, from: number, to: number) =>
  v <= a ? from : v >= b ? to : from + ((v - a) / (b - a)) * (to - from);

export function score(m: Month, p: Profile): number {
  const rain = m.precip_mm <= p.rain.good ? 1
             : m.precip_mm <= p.rain.ok   ? lerp(m.precip_mm, p.rain.good, p.rain.ok, 1, 0.5)
             :                              lerp(m.precip_mm, p.rain.ok, p.rain.bad, 0.5, 0);
  const wet  = lerp(m.wet_days, p.wet.good, p.wet.bad, 1, 0);
  const temp = m.tmax_c >= p.temp.lo && m.tmax_c <= p.temp.hi ? 1
             : Math.max(0, 1 - Math.min(Math.abs(m.tmax_c - p.temp.lo), Math.abs(m.tmax_c - p.temp.hi)) / p.temp.tol);
  return p.w.rain * rain + p.w.wet * wet + p.w.temp * temp;
}

export function level(s: number): Level {
  return s >= 0.75 ? 'sangat-baik' : s >= 0.55 ? 'baik' : s >= 0.35 ? 'cukup' : 'kurang';
}
```

Bobot per profil (nilai awal, **harus dikalibrasi** terhadap pengetahuan lokal dan diuji):

| Profil | Hujan | Hari hujan | Suhu | Alasan |
|---|---|---|---|---|
| `pantai` | 0,50 | 0,35 | 0,15 | Cerah dan kering menentukan hampir segalanya |
| `gunung` | 0,45 | 0,40 | 0,15 | Hujan menutup jarak pandang dan memperburuk jalur |
| `kota` | 0,35 | 0,35 | 0,30 | Hujan dan panas menyengat sama-sama mengganggu |
| `budaya` | 0,35 | 0,35 | 0,30 | Sama dengan kota; banyak aktivitas di luar ruangan |
| `selam` | 0,40 | 0,25 | 0,10 | Hujan hanya proksi kasar. Visibilitas dan arus **tidak ada di data**, wajib dikoreksi lewat `season_overrides` |

**Contoh ilustrasi** (angka rekaan, bukan data nyata): `precip_mm = 40`, `wet_days = 4`, `tmax_c = 31` pada profil `pantai` menghasilkan skor ≈ 1,0 ("sangat baik"). `precip_mm = 280`, `wet_days = 22` menghasilkan skor ≈ 0,03 ("kurang").

### 13.3 Prinsip
- **Bukan ramalan.** Ini rata-rata historis, dan di UI selalu disebut demikian.
- **Bukan AI.** Rumus terbuka, deterministik, dan diuji. Penilai bisa membacanya.
- **Penyimpangan lokal ditangani manusia.** Ombak besar, kabut asap, atau musim ramai tidak ada di data cuaca. Itu dicatat lewat `season_overrides` beserta alasannya, yang tampil ke pembaca.
- **Satu sumber kebenaran.** Paket `scoring` dipakai oleh Worker, peramban, dan skrip build, sehingga tidak mungkin ada dua hasil berbeda.

### 13.4 Tampilan
Strip 12 batang. **Tinggi batang dan warna** sama-sama menunjukkan tingkat, jadi informasi tidak bergantung pada warna saja. Spesifikasi visual ada di `design.md`.

---

## 14. Model data D1

```sql
-- migrations/0001_init.sql
CREATE TABLE users (
  id           TEXT PRIMARY KEY,              -- ULID
  google_sub   TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  avatar_url   TEXT,
  role         TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at   INTEGER NOT NULL
);

CREATE TABLE sessions (
  id           TEXT PRIMARY KEY,              -- SHA-256 dari token
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

CREATE TABLE trips (
  id           TEXT PRIMARY KEY,              -- ULID
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80),
  destination  TEXT NOT NULL,                 -- slug destinasi
  start_month  INTEGER CHECK (start_month BETWEEN 1 AND 12),
  days         INTEGER NOT NULL CHECK (days BETWEEN 1 AND 21),
  share_slug   TEXT UNIQUE,                   -- acak ≥ 64 bit; NULL = privat
  version      INTEGER NOT NULL DEFAULT 1,    -- kunci optimistik
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);
CREATE INDEX idx_trips_user ON trips(user_id, updated_at DESC);

CREATE TABLE trip_items (
  id           TEXT PRIMARY KEY,
  trip_id      TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_index    INTEGER NOT NULL CHECK (day_index >= 1),
  position     INTEGER NOT NULL CHECK (position >= 0),
  kind         TEXT NOT NULL CHECK (kind IN ('tempat','makan','transit','catatan')),
  title        TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  highlight_id TEXT,                          -- merujuk highlight di konten, bila ada
  time_of_day  TEXT CHECK (time_of_day IN ('pagi','siang','sore','malam')),
  notes        TEXT CHECK (length(notes) <= 400)
);
CREATE INDEX idx_items_trip ON trip_items(trip_id, day_index, position);

CREATE TABLE favorites (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination  TEXT NOT NULL,
  created_at   INTEGER NOT NULL,
  PRIMARY KEY (user_id, destination)
);

CREATE TABLE tips (
  id           TEXT PRIMARY KEY,
  destination  TEXT NOT NULL,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL CHECK (length(body) BETWEEN 20 AND 400),
  visited_month INTEGER CHECK (visited_month BETWEEN 1 AND 12),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','hidden')),
  created_at   INTEGER NOT NULL,
  moderated_at INTEGER
);
CREATE INDEX idx_tips_dest ON tips(destination, status, created_at DESC);

CREATE TABLE tip_reports (
  id           TEXT PRIMARY KEY,
  tip_id       TEXT NOT NULL REFERENCES tips(id) ON DELETE CASCADE,
  reporter_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason       TEXT NOT NULL,
  created_at   INTEGER NOT NULL,
  UNIQUE (tip_id, reporter_id)
);
```

**Anggaran baca.** Memuat satu rencana ≈ 1 baris `trips` + sampai ±60 baris `trip_items` + 1 baris `sessions`. Bahkan seribu pemuatan per hari hanya sekitar 60.000 baris, jauh di bawah 5 juta. Semua kueri berindeks dan diperiksa dengan `EXPLAIN QUERY PLAN` di tes agar tidak ada pemindaian tabel penuh.

---

## 15. API

Semua di bawah `/api/v1`. Galat memakai format seragam:

```json
{ "error": { "code": "BATAS_HARIAN_TERCAPAI", "message": "Fitur akun beristirahat sampai pukul 07.00 WIB.", "details": { "retry_after": "07:00 WIB" } } }
```

| Kelompok | Endpoint | Autentikasi |
|---|---|---|
| Kesehatan | `GET /health` | — |
| Cuaca | `GET /weather/{slug}` (sekarang + 7 hari, di-cache 30 menit) | — |
| Perencana | `POST /planner/suggest` (bulan, hari, suasana → destinasi berperingkat + alasan + kerangka harian) | — |
| Autentikasi | `GET /auth/google`, `GET /auth/google/callback`, `POST /auth/logout`, `GET /me`, `GET /me/export`, `DELETE /me` | sesuai |
| Rencana | `GET /trips`, `POST /trips`, `GET /trips/{id}`, `PATCH /trips/{id}`, `DELETE /trips/{id}`, `PUT /trips/{id}/share`, `DELETE /trips/{id}/share` | Wajib |
| Rencana publik | `GET /shared/{share_slug}` (hanya-baca) | — |
| Favorit | `GET /favorites`, `PUT /favorites/{slug}`, `DELETE /favorites/{slug}` | Wajib |
| Tips | `GET /destinations/{slug}/tips`, `POST /destinations/{slug}/tips`, `POST /tips/{id}/report` | Baca bebas; tulis wajib |
| Admin | `GET /admin/tips?status=pending`, `POST /admin/tips/{id}/publish`, `POST /admin/tips/{id}/hide` | Admin |

Aturan lintas endpoint:
- **Pembatasan laju** memakai fitur Rate Limiting Workers (fitur ini ada di Workers; konfigurasi bindingnya mengikuti dokumentasi terbaru). Cuaca dan saran per IP; tips dan laporan per pengguna.
- **Pembaruan rencana** memakai `version` sebagai kunci optimistik; bila berbeda, API mengembalikan `409` dengan versi terbaru.
- **Respons cuaca** menyertakan atribusi Open-Meteo dan waktu pengambilan; header `Cache-Control` dan penyimpanan lewat Cache API.
- **Batas D1 tercapai:** API mengembalikan `503` dengan kode `BATAS_HARIAN_TERCAPAI`. Frontend menampilkan keadaan "beristirahat" yang jujur, dan seluruh halaman statis tetap berjalan.
- Semua metode yang mengubah data mewajibkan `Content-Type: application/json` dan header `Origin` yang sama dengan situs.

---

## 16. Spesifikasi fitur

Tiap fitur ditandai fasenya (bagian 22). Kriteria penerimaan ditulis agar bisa dicentang.

### F1 — Beranda — *Fase 1 (statis), Fase 2 (dinamis)*
- Hero berisi foto asli layar penuh, headline, satu kalimat penjelasan, dua tindakan, keterangan lokasi dan kredit foto, serta panel Rencana Cepat di dasar hero.
- "Sedang bagus bulan ini": destinasi yang kalender musimnya baik di bulan berjalan, dihitung di peramban dengan paket `scoring` (Fase 2). Di Fase 1 berisi bulan saat build sebagai nilai awal.
- "Menurut suasana": daftar tipografis, bukan kartu.
- "Kapan waktu terbaik, menurut data": kalender musim interaktif sebagai momen khas.
- "Catatan lapangan": tiga tulisan terbaru.
- Footer berisi atribusi, tanggal build, tautan repositori, dan tautan Catatan data.
- **Diterima bila:** Lighthouse memenuhi bagian 6. Tanpa JavaScript, formulir Rencana Cepat tetap berfungsi dan mengarah ke halaman saran lewat GET biasa.

### F2 — Daftar destinasi & pencarian — *Fase 1*
- Daftar dengan filter pulau, suasana, dan **bulan** (menampilkan yang baik pada bulan itu).
- Pencarian Pagefind: hasil muncul saat mengetik, tanpa permintaan ke server.
- Filter tercermin di URL sehingga bisa dibagikan.
- **Diterima bila:** hasil kosong menyarankan filter terdekat, bukan sekadar "tidak ditemukan".

### F3 — Halaman destinasi — *Fase 1*
- Foto utama penuh lebar, judul, ringkasan.
- Fakta singkat: pulau dan provinsi, zona waktu (WIB/WITA/WIT), lama ideal, tanggal verifikasi terakhir.
- Kalender musim lengkap dengan catatan lokal.
- Cuaca sekarang (Fase 2).
- Cara ke sana (dengan sumber), "Yang layak disinggahi" (highlight), Tips pelancong (Fase 4).
- Tombol "Tambahkan ke rencana" dan favorit (Fase 3).
- Data terstruktur `TouristDestination` untuk SEO.
- **Diterima bila:** setiap klaim non-umum punya sumber yang tertaut, dan halaman lolos pemeriksa konten.

### F4 — Kalender musim — *Fase 1*
- Komponen tunggal dengan dua ukuran (ringkas di kartu, penuh di halaman destinasi).
- Tooltip dan fokus papan ketik menampilkan angka bulan itu: "Agustus: sangat baik. Hujan 42 mm, 5 hari hujan, 29 °C."
- Alternatif teks untuk pembaca layar: "Sangat baik: Mei sampai September. Kurang: Desember sampai Februari."
- Bulan berjalan ditandai.
- Penimpaan (`season_overrides`) tampil dengan alasannya.
- **Diterima bila:** tes unit memeriksa konsistensi keluaran `scoring`, dan satu tes snapshot memeriksa keluaran HTML-nya.

### F5 — Cuaca sekarang — *Fase 2*
- Widget memuat dari `/api/v1/weather/{slug}`: suhu sekarang, keterangan kondisi dalam bahasa Indonesia, dan prakiraan 7 hari berupa suhu serta peluang hujan.
- Kerangka muat berukuran sama persis dengan widget asli (tanpa pergeseran tata letak).
- Bila API gagal: tulisan "Cuaca belum bisa dimuat. Coba lagi", tombol coba ulang, dan tautan ke BMKG sebagai sumber resmi.
- Atribusi Open-Meteo terlihat.
- **Diterima bila:** ≥ 90% permintaan dilayani dari cache, dan permintaan beruntun ke destinasi yang sama hanya menghasilkan satu panggilan ke Open-Meteo dalam 30 menit.

### F6 — Rencana Cepat & halaman saran — *Fase 2*
- Masukan: tujuan (opsional), bulan (bawaan: bulan ini), lama 1–14 hari, suasana (opsional).
- Hasil: daftar destinasi berperingkat. Setiap hasil menampilkan strip bulan terpilih, alasan dalam kalimat (mis. "Kering di bulan ini, 4 hari hujan, cocok untuk 3–5 hari"), dan tombol "Mulai rencana dari sini".
- Bila tidak ada hasil: tawarkan bulan terdekat yang cocok.
- **Diterima bila:** algoritma deterministik (masukan sama menghasilkan hasil sama) dan diuji dengan ≥ 20 kasus, termasuk kasus tepi (1 hari, 14 hari, semua suasana, bulan terburuk).

### F7 — Masuk dengan Google — *Fase 3*
- Alur Authorization Code + PKCE dengan `state`.
- Sesi buram 30 hari, disimpan sebagai hash di D1, cookie `HttpOnly; Secure; SameSite=Lax`.
- Akun baru hanya menyimpan `google_sub`, nama, dan avatar. Email tidak disimpan.
- Peran admin ditentukan lewat daftar putih di variabel lingkungan.
- **Diterima bila:** keluar menghapus sesi di sisi server, dan permintaan tanpa sesi ke endpoint terlindungi mengembalikan `401`.

### F8 — Penyusun rencana — *Fase 3*
- Buat rencana dari nol atau dari hasil saran. Kolom per hari; item bisa ditambah dari "Yang layak disinggahi" atau ditulis bebas.
- Mengurutkan item: seret dan lepas **dan** tombol naik/turun (wajib berfungsi dengan papan ketik).
- Simpan otomatis dengan penanda status. Pengguna tanpa akun: tersimpan lokal; saat masuk, ditawarkan untuk dipindahkan ke akun.
- Peringatan lembut: terlalu padat dalam satu hari, atau item di area yang berjauhan berurutan.
- **Diterima bila:** konflik pembaruan (dua tab) tertangani lewat `version`, dan seluruh alur bisa diselesaikan dengan papan ketik.

### F9 — Bagikan & cetak — *Fase 3*
- Tombol bagikan membuat `share_slug` acak; halaman `/r/{slug}` bersifat hanya-baca.
- Bisa dicabut kapan saja.
- Tampilan cetak: satu hari per bagian, tanpa navigasi, tanpa foto latar, hitam putih ramah printer.
- **Diterima bila:** tautan yang dicabut langsung mengembalikan `404`, dan hasil cetak terbaca di A4.

### F10 — Favorit — *Fase 3*
- Hati kecil pada halaman destinasi dan daftar; "Favorit saya" di halaman akun.
- Perubahan bersifat optimistis dan dibatalkan bila gagal.

### F11 — Tips pelancong & moderasi — *Fase 4*
- Pengguna masuk dapat menulis satu tip (20–400 karakter, teks polos) per destinasi, dengan bulan kunjungan opsional.
- Tip baru berstatus `pending` dan baru tampil setelah admin menyetujui.
- Tombol "Laporkan" untuk tip yang dipublikasikan.
- Halaman moderasi sederhana (hanya admin): antrean, setujui, sembunyikan.
- Pembatasan laju: 1 tip per destinasi per pengguna, 5 tip per hari.
- **Diterima bila:** konten pengguna tidak pernah dirender sebagai HTML, dan fitur bisa dimatikan lewat `TIPS_ENABLED=false`.

### F12 — Catatan lapangan — *Fase 1*
- Artikel Markdown dengan foto, waktu baca otomatis, dan destinasi terkait.
- Pedoman penulisan ada di bagian 24. Lolos pemeriksa konten.

### F13 — Atribusi, Catatan data, Privasi — *Fase 1, dilengkapi di Fase 6*
- **Atribusi:** daftar fotografer dan sumber, Open-Meteo (CC BY 4.0), OpenStreetMap bila peta dipakai.
- **Catatan data:** cara kalender musim dihitung, periode data, resolusi kasar, apa yang tidak tercakup, dan rumus lengkap.
- **Privasi:** data apa yang disimpan, mengapa, dan cara menghapusnya (`DELETE /me`, `GET /me/export`).

### F14 — Peta destinasi — *Fase 5, opsional*
- Peta kecil di halaman destinasi dengan penanda highlight.
- Tidak ada pemuatan peta sebelum diinteraksi (hemat bandwidth).
- Atribusi OSM tampil.

---

## 17. Kebutuhan non-fungsional

### 17.1 Performa
- Foto hero dimuat dengan `fetchpriority="high"` dan didahului placeholder buram kecil (LQIP).
- Foto Unsplash di-hotlink dengan parameter lebar, format, dan kualitas; DNS di-`preconnect` ke `images.unsplash.com`.
- JavaScript beranda ≤ 30 KB. React hanya dimuat di `/rencana/*` dan `/akun`.
- Font di-*self-host*, subset Latin, maksimal dua keluarga.
- Anggaran CPU Worker: ≤ 5 ms rata-rata. Respons JSON ringkas, tanpa kolom yang tidak ditampilkan.

### 17.2 Aksesibilitas
- WCAG 2.2 AA. Teks di atas foto selalu didukung scrim dan diuji pada kondisi terburuk.
- Semua alur (Rencana Cepat, penyusun rencana, moderasi) bisa diselesaikan dengan papan ketik.
- Informasi tidak hanya lewat warna: kalender musim memakai tinggi batang dan teks.
- Teks alternatif foto berbahasa Indonesia dan menjelaskan apa yang terlihat.
- `prefers-reduced-motion` mematikan seluruh animasi.
- Sasaran sentuh minimal 44×44 px.
- Diuji dengan pembaca layar pada satu alur penuh sebelum rilis.

### 17.3 Keamanan
- OAuth dengan PKCE dan `state`; sesi buram yang disimpan sebagai hash; cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Perlindungan CSRF: `SameSite=Lax`, pemeriksaan `Origin`, dan `Content-Type: application/json` wajib pada metode yang mengubah data.
- Tautan berbagi tidak bisa ditebak (≥ 64 bit entropi).
- Konten pengguna teks polos, tidak pernah HTML; semua keluaran dilepaskan (*escaped*).
- Content-Security-Policy ketat. Sumber gambar hanya domain situs dan `images.unsplash.com`.
- Pembatasan laju pada cuaca, saran, tips, dan laporan.
- Rahasia hanya sebagai *secret* Wrangler dan GitHub; tidak pernah di repositori.
- Dependabot dan `npm audit`/`pip-audit` di CI.

### 17.4 Privasi
- Data pengguna minimal: `google_sub`, nama, avatar. Email tidak disimpan.
- Analitik tanpa cookie. Hanya cookie sesi esensial yang dipakai, sehingga **situs tidak memasang banner persetujuan cookie** (ini pertimbangan produk, bukan nasihat hukum).
- Pengguna bisa mengekspor dan menghapus datanya sendiri (`GET /me/export`, `DELETE /me`). Pertimbangkan juga kesesuaian dengan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

### 17.5 Keandalan
- Bila D1 mencapai batas harian, halaman statis dan Rencana Cepat (yang tidak memakai D1) tetap berjalan; fitur akun menjelaskan keadaannya.
- Bila Open-Meteo gagal, widget cuaca menampilkan keadaan galat; kalender musim (data statis) tidak terpengaruh.
- Bila foto hotlink hilang, `dominant_color` menjadi latar cadangan dan teks tetap terbaca. Pemeriksa mingguan melaporkan tautan mati.

---

## 18. Pengujian

| Jenis | Cakupan | Alat |
|---|---|---|
| Unit | Skor musim, level, perencana saran, pengelompokan item per hari, pemformat angka dan tanggal | Vitest |
| Properti | Skor selalu 0–1; level monoton terhadap skor; saran deterministik | fast-check |
| API | Setiap endpoint dengan D1 nyata di lingkungan uji; matriks hak akses; galat batas harian | `@cloudflare/vitest-pool-workers` |
| Kueri | Setiap kueri berindeks (`EXPLAIN QUERY PLAN` tidak boleh memuat pemindaian tabel penuh) | Tes khusus |
| Konten | Skema, sumber, tanggal verifikasi, teks alternatif, frasa terlarang, URL foto hidup | `content_lint.py` + pytest |
| Aksesibilitas | Halaman utama tanpa pelanggaran axe | axe-core di Playwright |
| End-to-end | 3 alur: (1) Rencana Cepat → saran → mulai rencana; (2) masuk → susun → bagikan → buka tautan di sesi lain; (3) tulis tip → disetujui admin → tampil | Playwright |
| Performa | Anggaran bagian 6 pada beranda, destinasi, dan penyusun rencana | Lighthouse CI |

Target: cakupan ≥ 85% untuk `packages/scoring` dan lapisan API. CI gagal bila turun.

---

## 19. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Batas D1 harian tercapai (kini ditegakkan) | Fitur akun mati sampai 07.00 WIB | Kueri berindeks, konten tidak memakai D1, galat jelas, halaman statis tak terpengaruh, pemantauan penggunaan |
| CPU Worker melebihi 10 ms | Permintaan gagal | Worker hanya melayani API ringan; tanpa render server; ukur dengan metrik Workers; hindari pustaka berat |
| Syarat Open-Meteo gratis dilanggar | Akses dicabut | Tanpa iklan atau afiliasi sama sekali; atribusi terlihat; cache 30 menit |
| Foto hotlink Unsplash dihapus atau berubah | Gambar rusak | Warna dominan + LQIP sebagai cadangan, pemeriksa mingguan, kandidat foto cadangan per destinasi |
| Skor musim menyesatkan di wilayah mikroklimat | Rekomendasi salah | Penimpaan manual dengan alasan, catatan batas data, label "rata-rata historis" di UI |
| Konten lemah atau generik | Situs terlihat seperti template | Pemeriksa konten dengan frasa terlarang, wajib sumber, 12 destinasi ditulis dengan teliti dibanding 50 yang dangkal |
| Beban penulisan konten di luar perkiraan | Proyek molor | Fase 1 dikunci pada 6 destinasi untuk rilis awal, sisanya menyusul di Fase 6 |
| Penyalahgunaan tips (spam) | Konten tidak pantas | Pra-moderasi, pembatasan laju, tombol laporan, bisa dimatikan |
| Bot memenuhi kuota 100.000 permintaan/hari | API berhenti | `robots.txt` melarang `/api`, pembatasan laju, cache agresif |
| Nama atau merek "Singgah" sudah dipakai | Konflik | Cek sebelum domain dibeli; alternatif di D2 |
| Lingkup melebar | Tak selesai | Daftar di luar lingkup dikunci; ide baru masuk daftar tunggu |

---

## 20. Keputusan terbuka

| # | Pertanyaan | Rekomendasi | Dibutuhkan sebelum |
|---|---|---|---|
| D1 | Posisi yang dituju: fullstack, frontend, atau data? | Fullstack dengan bobot frontend | Fase 0 |
| D2 | Nama final | *Singgah*. Cadangan: *Labuh*, *Persinggahan*. Cek domain dan DJKI dulu | Fase 0 |
| D3 | 12 destinasi mana yang dipilih? | Pilih yang kamu kenal atau bisa riset mendalam, dengan sebaran pulau dan suasana yang beragam | Fase 1 |
| D4 | Foto: Unsplash (hotlink), milik sendiri, atau campuran? | Campuran: foto milik sendiri bila ada, Unsplash sisanya, sesuai syarat 10.2 | Fase 1 |
| D5 | Domain kustom? | Mulai dari `*.workers.dev`; pindahkan DNS ke Cloudflare bila ingin domain sendiri | Fase 6 |
| D6 | Peta: penyedia gratis atau PMTiles di R2? | Penyedia gratis (setelah membaca syaratnya). R2 hanya jika siap memberi metode pembayaran | Fase 5 |
| D7 | Tips pelancong dihidupkan pada rilis publik? | Ya, dengan pra-moderasi dan sakelar pemati | Fase 4 |
| D8 | Bahasa Inggris? | Tidak untuk v1. Struktur konten memakai kolom `locale` agar bisa ditambah | Fase 5 |
| D9 | Integrasi BMKG (peringatan cuaca dan gempa) | Opsional. Cek dulu syarat penggunaan dan ketersediaan datanya | Fase 5 |
| D10 | Video hero | Foto dulu. Video loop ≤ 5 MB hanya jika ada klip berlisensi yang jelas | Fase 5 |

---

## 21. Struktur repositori

```
singgah/
├─ apps/
│  ├─ web/                       # Astro
│  │  ├─ src/
│  │  │  ├─ content/             # destinations/, articles/, moods/, photos/
│  │  │  ├─ components/          # SeasonStrip, QuickPlan, WeatherNow, HeroPhoto, ...
│  │  │  ├─ islands/             # React: planner/, account/
│  │  │  ├─ layouts/
│  │  │  ├─ pages/
│  │  │  └─ styles/              # token.css (dari design.md), global.css, print.css
│  │  └─ astro.config.mjs
│  └─ api/                       # Cloudflare Worker (Hono)
│     ├─ src/
│     │  ├─ routes/              # weather, planner, auth, trips, favorites, tips, admin
│     │  ├─ db/                  # skema Drizzle
│     │  ├─ lib/                 # sesi, oauth, ratelimit, errors
│     │  └─ index.ts
│     ├─ migrations/
│     └─ wrangler.jsonc
├─ packages/
│  ├─ scoring/                   # skor musim + perencana (murni, diuji)
│  └─ schema/                    # skema Zod bersama (API dan klien)
├─ tools/                        # Python
│  ├─ climate/  ├─ photos/  └─ lint/
├─ data/climate/                 # keluaran tools/climate
├─ docs/
│  ├─ architecture.md
│  ├─ data-notes.md              # rumus musim, periode, batas
│  └─ decisions/                 # ADR singkat
├─ .github/workflows/            # ci, deploy, photo-check, content-freshness
├─ design.md
├─ prd.md
└─ README.md
```

**Variabel lingkungan dan rahasia** (nilai hanya di Wrangler/GitHub): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, `ADMIN_SUBS` (daftar `google_sub` admin), `PUBLIC_SITE_URL`, `TIPS_ENABLED`. Khusus alat Python, di mesin lokal atau CI: `UNSPLASH_ACCESS_KEY`. Kunci ini **tidak pernah** dipakai oleh Worker.

---

## 22. Roadmap bertahap

Setiap fase **berakhir dengan situs yang bisa dibuka publik**. Perkiraan waktu untuk satu orang paruh waktu (6–10 jam seminggu); ini perkiraan, bukan janji, dan konten adalah bagian yang paling sering meleset.

### Fase 0 — Fondasi (±1 minggu)
- Repositori monorepo, pnpm, TypeScript, lint, format.
- Skeleton Astro dan Worker, `GET /api/v1/health`.
- Deploy otomatis ke `*.workers.dev` lewat GitHub Actions.
- Token desain, font, dan komponen kerangka (header, footer).
- **Hasil yang bisa dibuka:** URL publik dengan halaman beranda sementara (hero foto asli + wordmark) dan `/api/v1/health` yang menjawab.
- **Selesai bila:** CI hijau dan deploy berjalan hanya dengan `git push`.

### Fase 1 — Situs statis yang memukau (±3–4 minggu)
- Skema konten, 6 destinasi awal (target akhir fase: 12), foto, moods, 3 artikel.
- Alat Python: data iklim, pemilih foto, pemeriksa konten.
- Beranda, daftar dan detail destinasi, jelajah menurut suasana, Catatan lapangan, pencarian Pagefind.
- Kalender musim (dari data iklim).
- SEO: sitemap, OG, data terstruktur. Halaman atribusi, Catatan data, Privasi.
- **Hasil yang bisa dibuka:** situs panduan lengkap tanpa fitur akun.
- **Selesai bila:** anggaran performa (bagian 6) terpenuhi, pemeriksa konten hijau, 6 destinasi tayang.

### Fase 2 — Dinamis ringan (±2 minggu)
- API cuaca dengan cache, widget cuaca.
- "Sedang bagus bulan ini" dari paket `scoring`.
- Rencana Cepat dan halaman saran (`/planner/suggest`).
- Pembatasan laju.
- **Hasil yang bisa dibuka:** situs yang menjawab "ke mana bulan ini?" tanpa akun.
- **Selesai bila:** rasio cache ≥ 90%, CPU rata-rata ≤ 5 ms, dan 20 kasus uji saran lulus.

### Fase 3 — Akun dan rencana (±2–3 minggu)
- Migrasi D1, Google OAuth, sesi.
- Penyusun rencana (seret/lepas + papan ketik), tautan berbagi, tampilan cetak, favorit.
- Pemindahan rencana lokal ke akun saat masuk.
- **Hasil yang bisa dibuka:** pengguna menyusun dan membagikan rencana perjalanan.
- **Selesai bila:** dua alur e2e pertama lulus; semua kueri berindeks; galat batas harian ditangani.

### Fase 4 — Komunitas (±1–2 minggu)
- Tips pelancong, laporan, halaman moderasi, sakelar `TIPS_ENABLED`.
- **Selesai bila:** alur ketiga e2e lulus dan konten pengguna terbukti tidak pernah dirender sebagai HTML.

### Fase 5 — Polesan (±2 minggu, sebagian opsional)
- Peta (F14), mode gelap diperiksa satu per satu, PWA, audit aksesibilitas dengan pembaca layar.
- Opsional: video hero, integrasi BMKG, bahasa Inggris, aksen warna per destinasi dari warna dominan foto.
- **Selesai bila:** audit aksesibilitas bersih dan anggaran performa tetap terpenuhi setelah tambahan.

### Fase 6 — Pengemasan portofolio (±1 minggu)
- Menggenapkan 12 destinasi, README, ADR, dokumentasi arsitektur, tangkapan layar, laporan Lighthouse yang ditautkan.
- Domain kustom (opsional).
- **Selesai bila:** orang asing bisa membuka tautan dan menyelesaikan satu alur penuh tanpa bantuan.

> **Total** sekitar 3–4 bulan paruh waktu. Bila waktunya sempit, **berhenti di akhir Fase 2** sudah menghasilkan portofolio yang kuat (situs cepat, data nyata, dua integrasi API). Fase 3 menambahkan akun dan penyimpanan, dan itulah yang membuktikan kamu bisa membangun sisi backend yang utuh.

---

## 23. Daftar periksa dari nol sampai tayang

**Persiapan**
- [ ] Buat akun GitHub, Cloudflare, Google Cloud (OAuth), Unsplash (developer)
- [ ] Putuskan D1 (posisi), D2 (nama; cek domain dan DJKI), D3 (12 destinasi)
- [ ] Buat repositori dengan struktur bagian 21

**Fase 0**
- [ ] Inisialisasi pnpm workspace dan skeleton Astro serta Worker
- [ ] `wrangler d1 create singgah` dan isi `database_id`
- [ ] Setel rahasia: `wrangler secret put ...`
- [ ] Workflow deploy GitHub Actions (token Cloudflare sebagai *secret*)
- [ ] Verifikasi sintaks `run_worker_first` terhadap dokumentasi routing

**Konten (Fase 1)**
- [ ] Jalankan `fetch_climate.py` untuk semua destinasi
- [ ] Pilih foto dengan `pick_photo.py` (memanggil endpoint pelacakan Unsplash)
- [ ] Tulis destinasi, dengan sumber untuk setiap fakta non-umum
- [ ] `content_lint.py` hijau

**Integrasi**
- [ ] Google OAuth: buat klien dan setel URI pengalihan ke domain produksi
- [ ] Baca ulang syarat Open-Meteo dan pastikan atribusi tampil
- [ ] Aktifkan Cloudflare Web Analytics (cek ketersediaan)

**Sebelum dibagikan**
- [ ] Uji di ponsel nyata dengan koneksi lambat
- [ ] Uji hanya dengan papan ketik dan dengan pembaca layar
- [ ] Jalankan Lighthouse mobile pada beranda, destinasi, dan penyusun rencana
- [ ] Simulasikan batas D1 tercapai dan pastikan tampilan "beristirahat" muncul
- [ ] Pastikan tidak ada rahasia di riwayat Git
- [ ] Ekspor cadangan D1 pertama dan coba pulihkan

---

## 24. Pedoman konten

### 24.1 Suara
Bahasa Indonesia yang lugas dan hangat. Kalimat aktif. Sebut hal yang spesifik (nama tempat, jam, jarak, bulan) alih-alih sifat umum.

### 24.2 Frasa terlarang (diperiksa otomatis oleh `content_lint.py`)
"surga tersembunyi", "hidden gem", "wajib dikunjungi", "memanjakan mata", "pesona", "eksotis", "memukau", "tak terlupakan", "instagramable", "menyuguhkan keindahan". Daftar ini boleh diperpanjang di `tools/lint/banned.txt`.

### 24.3 Aturan fakta
- Setiap klaim non-umum (waktu tempuh, harga, jam buka, aturan taman nasional) wajib punya sumber tertaut dan `verified_at`.
- Tidak menyalin teks dari situs lain, termasuk Wikivoyage atau situs ulasan. Menulis ulang dengan kata sendiri pun tetap harus berdasarkan fakta dari sumber primer.
- Harga disebut sebagai rentang dengan tahun pengecekan, bukan angka tunggal.
- Keselamatan (pendakian, selam, penyeberangan) selalu mengarahkan ke sumber resmi.

### 24.4 Foto
Foto asli saja. Teks alternatif menjelaskan apa yang terlihat ("Perahu kayu bersandar di teluk berbatu karang saat air surut"), bukan "gambar pantai". Kredit selalu tampil.

---

*PRD Singgah v1.0 — dokumen hidup. Tutup keputusan di bagian 20 satu per satu dan catat tanggalnya.*
