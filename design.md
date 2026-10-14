# DESIGN — Singgah

**Sistem desain untuk situs panduan destinasi dan penyusun rencana perjalanan**

**Versi:** 1.0
**Tanggal:** 12 Oktober 2026
**Dokumen pasangan:** `prd.md`

> **Cara membaca dokumen ini.** Ini spesifikasi yang bisa langsung diterjemahkan menjadi token CSS dan komponen Astro/React, bukan moodboard. Nama komponen dan istilah (Rencana Cepat, Kalender musim, Catatan lapangan, Rencana saya) sama dengan `prd.md`.
>
> **Soal referensi.** Screenshot yang kamu berikan dipakai sebagai arah suasana: foto penuh layar, tipografi serif besar, pencarian langsung di layar pertama. Tidak ada nama, wordmark, teks, tata letak persis, atau foto dari situs itu yang dipakai. Bagian 1.2 menjelaskan apa yang sengaja saya ubah.

---

## 1. Arah visual

**Satu kalimat:** foto yang jujur, tipografi yang tenang, dan satu elemen data yang mudah diingat.

Singgah harus terasa seperti buku catatan perjalanan yang rapi: foto besar, kalimat jelas, angka yang bisa diperiksa. Tidak ada kilau, tidak ada janji besar.

### 1.1 Gagasan penuntun

| Gagasan | Artinya dalam antarmuka |
|---|---|
| **Foto sebagai isi, bukan hiasan** | Layar pertama selalu foto asli. Teks menempel pada foto lewat scrim yang dihitung, bukan ditebak |
| **Satu momen yang berani** | Seluruh keberanian visual dipusatkan di **Kalender musim**. Sisanya sengaja tenang |
| **Tipografi membawa karakter** | Serif besar untuk judul, sans netral untuk semua yang lain. Tidak ada gradien, kaca, atau bayangan di mana-mana |
| **Warna dijatah** | Antarmuka netral dingin. Kunyit hanya untuk tindakan utama dan penanda. Biru laut hanya untuk tautan dan data |
| **Data tidak berbohong** | Setiap angka punya sumber. Tidak ada statistik hiasan |
| **Satu tindakan utama per layar** | Hanya satu tombol kunyit yang terlihat pada satu waktu |

### 1.2 Yang saya ambil dan ubah dari referensi

| Di referensi | Di Singgah |
|---|---|
| Foto penuh layar dengan headline serif sangat besar | **Diambil.** Dengan huruf berbeda dan komposisi sendiri |
| Panel pencarian kaca gelap di kanan | **Diubah** menjadi panel kertas solid yang menempel di dasar hero |
| Deretan kartu destinasi seragam | **Diubah** menjadi grid editorial tak simetris dan daftar tipografis |
| Baris lencana kepercayaan dan statistik | **Dihapus.** Singgah tidak menjual apa pun, dan angka tanpa sumber adalah bukti sosial palsu |
| Label huruf kapital di atas headline, panah di tombol | **Tidak dipakai** |
| Mint-teal di atas biru gelap | **Diganti** kabut dingin, tinta laut, dan aksen kunyit |
| Foto tanpa keterangan | **Diubah.** Setiap hero menyebut lokasi dan kredit fotografer |

### 1.3 Daftar larangan (kriteria tolak saat peninjauan)

Setiap butir berlaku untuk seluruh situs.

- Gradien ungu-biru atau gradien mesh sebagai latar, tombol, atau teks.
- Panel kaca, blur latar, atau efek *glassmorphism*.
- Foto atau ilustrasi buatan AI. Hanya foto asli dengan fotografer terkredit.
- Foto stok yang jelas stok (jabat tangan, orang tertawa menghadap kamera dengan latar putih).
- Deretan tiga kartu berikon sejajar ("Mudah, Cepat, Aman").
- Kartu `rounded-2xl` dengan bayangan lembut dan border tipis seragam di mana-mana.
- Angka raksasa di tengah dengan label kecil sebagai statistik hiasan.
- Label huruf kapital tersebar di atas judul; label berbentuk "KATA — fragmen"; teks meta yang disambung titik tengah.
- Huruf monospasi untuk label data kecil.
- Panah `→` di belakang teks tombol atau tautan.
- Animasi masuk pada setiap bagian saat menggulir; efek memantul.
- Ikon bulat berwarna sebagai pengganti foto.
- Klise penulisan ("surga tersembunyi", "wajib dikunjungi", "memanjakan mata"). Diperiksa otomatis oleh `content_lint.py`.

---

## 2. Catatan peninjauan desain

Rencana awal saya ditinjau terhadap pola yang paling sering muncul pada desain yang dihasilkan otomatis. Ini yang saya ubah.

| Rencana awal | Masalah | Perubahan |
|---|---|---|
| Latar krem hangat, serif kontras tinggi, aksen terakota atau emas | Kombinasi yang sangat umum pada desain "editorial" buatan AI | Latar diganti **kabut dingin** (abu kebiruan). Serifnya tipis dan lebar sehingga karakternya berbeda. Aksen kunyit hanya untuk tombol dan penanda kecil, bukan permukaan besar |
| Mode gelap hitam dengan satu aksen terang | Pola umum yang lain | Gelap hanya dipakai di bagian tertentu (hero, Kalender musim, footer) dan sebagai tema opsional. Antarmuka utama terang |
| Kartu destinasi seragam | Pola SaaS | Grid tak simetris + daftar tipografis. Kartu foto hanya dipakai di tempat yang memang berupa daftar foto |
| Label kecil huruf kapital di atas judul | Tanda desain template | Dihapus. Judul bagian berupa kalimat biasa |
| Statistik "12+ destinasi, 4.9 rating" | Bukti sosial yang tidak punya dasar | Dihapus. Hanya angka nyata dari konten dan tanggal build |

**Satu keputusan keberanian:** Kalender musim. Strip 12 batang yang dihitung dari data iklim, muncul di kartu kecil, halaman destinasi, dan bagian khusus di beranda. Inilah satu-satunya elemen yang dirancang untuk diingat.

---

## 3. Warna

### 3.1 Palet dasar

| Nama | Hex | Asal nama |
|---|---|---|
| `kabut-50` | `#F1F4F3` | Kabut pagi di pelabuhan |
| `kabut-100` | `#E6EBEA` | |
| `kabut-300` | `#C5D0CE` | |
| `putih` | `#FFFFFF` | |
| `tinta` | `#0D1B22` | Tinta laut dalam |
| `tinta-2` | `#44555C` | |
| `tinta-3` | `#5F6F76` | |
| `laut-700` | `#124B5B` | Air laut dalam |
| `kunyit-500` | `#E8A317` | Kunyit |
| `kunyit-700` | `#8A5A00` | Kunyit tua, untuk teks |
| `cabai` | `#B8322A` | Galat |
| `daun` | `#2F7D5B` | Berhasil |
| `malam-950` | `#091218` | Latar gelap |
| `malam-900` | `#101D26` | |
| `malam-800` | `#17272F` | |
| `malam-600` | `#263640` | |

### 3.2 Token semantik

Komponen **hanya** memakai token semantik. Tidak ada nilai hex di komponen.

| Token | Terang | Gelap | Peran |
|---|---|---|---|
| `--bg` | `#F1F4F3` | `#091218` | Latar halaman |
| `--surface` | `#FFFFFF` | `#101D26` | Panel, bidang formulir |
| `--surface-2` | `#E6EBEA` | `#17272F` | Permukaan kedua |
| `--line` | `#C5D0CE` | `#263640` | Garis pemisah |
| `--text` | `#0D1B22` | `#E8EEEF` | Teks utama |
| `--text-2` | `#44555C` | `#A9B8BD` | Teks sekunder |
| `--text-3` | `#5F6F76` | `#7F9097` | Teks tersier dan keterangan |
| `--link` | `#124B5B` | `#7CC3D2` | Tautan dan elemen data |
| `--link-hover` | `#0A3441` | `#A8E0EC` | |
| `--cta-bg` | `#E8A317` | `#F0B13A` | Tombol utama |
| `--cta-hover` | `#D9960F` | `#F5C25E` | |
| `--cta-text` | `#0D1B22` | `#0D1B22` | Teks pada tombol utama |
| `--warn` | `#8A5A00` | `#E0B04C` | Peringatan lembut |
| `--warn-bg` | `#F7ECD0` | `#2E2612` | |
| `--error` | `#B8322A` | `#EE8279` | Galat |
| `--error-bg` | `#F6DEDB` | `#3A1D1B` | |
| `--ok` | `#2F7D5B` | `#6CC09D` | Berhasil |
| `--ok-bg` | `#DCEEE5` | `#14302A` | |
| `--focus` | `#124B5B` | `#7CC3D2` | Cincin fokus |

### 3.3 Skala Kalender musim

Skala sekuensial empat tingkat dalam satu rona (laut). Warna **bukan** satu-satunya penanda: tinggi batang juga mengodekan tingkat (lihat 11.5).

| Tingkat | Label | Terang | Gelap | Tinggi batang |
|---|---|---|---|---|
| 1 | Kurang | `#CBD5D5` | `#2B3A41` | 25% |
| 2 | Cukup | `#9BC3CC` | `#3F7482` | 50% |
| 3 | Baik | `#4F9AAB` | `#5FAFC2` | 75% |
| 4 | Sangat baik | `#124B5B` | `#A8E0EC` | 100% |

Setiap batang diberi garis tepi 1 px `--text-3` agar tingkat terendah (yang warnanya mendekati latar) tetap memenuhi kontras 3:1 untuk elemen grafis.

### 3.4 Kontras (dihitung perkiraan, verifikasi dengan alat)

| Pasangan | Rasio | Status |
|---|---|---|
| `--text` di atas `--bg` (terang) | ±15,8 : 1 | AAA |
| `--text-2` di atas `--bg` | ±7,0 : 1 | AAA |
| `--text-3` di atas `--bg` | ±4,7 : 1 | AA |
| `--link` di atas `--bg` | ±8,7 : 1 | AAA |
| `--cta-text` di atas `--cta-bg` (terang) | ±8,1 : 1 | AAA |
| `--warn` di atas `--surface` | ±5,9 : 1 | AA |
| `--error` di atas `--surface` | ±5,9 : 1 | AA |
| `--text` di atas `--bg` (gelap) | ±15,9 : 1 | AAA |
| `--text-3` di atas `--bg` (gelap) | ±5,7 : 1 | AA |
| `--link` di atas `--bg` (gelap) | ±9,4 : 1 | AAA |
| `--cta-text` di atas `--cta-bg` (gelap) | ±9,2 : 1 | AAA |

### 3.5 Aturan pemakaian
- **Kunyit** hanya untuk tombol utama dan penanda kecil (bulan berjalan di Kalender musim, titik penimpaan). Tidak untuk permukaan, latar bagian, atau teks panjang.
- **Biru laut** untuk tautan, elemen data, dan fokus. Bukan untuk dekorasi.
- Satu tombol kunyit per layar.
- Warna status (`--warn`, `--error`, `--ok`) hanya untuk status, dan selalu disertai teks.
- Bagian gelap (hero, Kalender musim, footer) memakai token gelap lewat kelas `.tema-malam`, terlepas dari tema pengguna.

---

## 4. Tipografi

| Peran | Keluarga | Bobot | Catatan |
|---|---|---|---|
| Judul besar, judul bagian, nama destinasi, angka cuaca | **Instrument Serif** | 400 (reguler dan miring) | Hanya satu bobot; dimaksudkan untuk ukuran besar |
| Isi, antarmuka, tombol, formulir, label | **Albert Sans** | 400, 500, 600 | Netral dan jernih di ukuran kecil |

> Keduanya tersedia di Google Fonts dengan lisensi terbuka (**cek lisensi saat mengunduh**). Di-*self-host*, di-subset Latin, `font-display: swap`, dengan `size-adjust` pada fallback agar tidak ada pergeseran tata letak. Instrument Serif tidak punya bobot tebal, jadi **jangan pernah memakai `font-weight` di atas 400 pada judul** (peramban akan memalsukan tebalnya). Bila setelah dicoba karakternya kurang cocok, kandidat pengganti: `Fraunces` (bobot rendah, ukuran optik besar) atau `Gloock`.
>
> Pastikan fontnya mencakup karakter yang dipakai (tanda derajat, tanda hubung, tanda petik melengkung) sebelum dikunci. Albert Sans mungkin tidak menyediakan angka bertabel; bila tidak, angka di Kalender musim memakai lebar sel tetap.

### 4.1 Skala

| Token | Ukuran | Line-height | Keluarga | Pemakaian |
|---|---|---|---|---|
| `--t-hero` | `clamp(3.25rem, 9.5vw, 9.5rem)` | 0,92 | Serif | Headline hero |
| `--t-display` | `clamp(2.5rem, 6vw, 5.5rem)` | 1,0 | Serif | Judul halaman destinasi |
| `--t-h2` | `clamp(2rem, 3.6vw, 3.25rem)` | 1,08 | Serif | Judul bagian |
| `--t-h3` | `1.5rem` | 1,2 | Serif | Nama destinasi di daftar, judul artikel |
| `--t-temp` | `clamp(4rem, 8vw, 6rem)` | 0,9 | Serif | Suhu di widget cuaca |
| `--t-lead` | `clamp(1.125rem, 1.5vw, 1.375rem)` | 1,5 | Sans | Pengantar |
| `--t-body` | `1.0625rem` (17 px) | 1,7 | Sans | Isi artikel dan uraian |
| `--t-ui` | `.9375rem` | 1,4 | Sans 500 | Tombol, menu, nilai bidang |
| `--t-small` | `.8125rem` (13 px) | 1,45 | Sans | Keterangan, kredit, label bidang |

### 4.2 Aturan
- Judul bagian berupa **kalimat biasa dengan huruf kapital hanya di awal**. Tidak ada judul huruf kapital semua, tidak ada label kecil huruf kapital di atas judul.
- Lebar baca isi maksimum **66 karakter** (`max-width: 66ch`). Isi artikel tidak rata-justify.
- Headline hero ditata **tidak sejajar**: baris kedua menjorok ±14% di desktop, dan ±8vw di ponsel. Tidak ada kata yang diberi warna atau gaya berbeda di dalam headline.
- Teks miring (serif miring) hanya untuk nama tempat pada keterangan foto dan kutipan pendek.
- Angka dan tanggal dalam format Indonesia: `1.250`, `31,5 °C`, `12 Okt 2026` (daftar) dan `12 Oktober 2026` (artikel). Suhu selalu memakai spasi sebelum `°C`.
- Tidak memakai monospasi.

---

## 5. Tata letak

### 5.1 Grid dan wadah

| Elemen | Nilai |
|---|---|
| Lebar maksimum konten | `1360px`. Hero dan bagian gelap selalu penuh lebar |
| Kolom | 12 (desktop), 8 (tablet), 4 (ponsel) |
| Gutter | 24 px (desktop), 16 px (ponsel) |
| Margin sisi | `clamp(16px, 4vw, 64px)` |
| Satuan dasar | 4 px |
| Skala ruang | 4, 8, 12, 16, 24, 32, 48, 72, 112, 160 |
| Jarak antar bagian | `clamp(72px, 10vw, 160px)` |

### 5.2 Breakpoint
`480` · `768` · `1024` · `1280` · `1536`. Dirancang dari ponsel ke atas.

### 5.3 Bentuk

| Elemen | Radius |
|---|---|
| Foto | 2 px |
| Tombol dan bidang | 6 px |
| Panel Rencana Cepat dan dialog | 4 px |
| Batang Kalender musim | 1 px (sudut atas) |

- **Bayangan:** hanya dua. `--shadow-panel: 0 18px 40px rgba(9,18,24,.28)` untuk panel Rencana Cepat, `--shadow-float: 0 8px 24px rgba(9,18,24,.18)` untuk menu dan dialog yang melayang. Tidak ada bayangan pada kartu atau daftar.
- **Garis:** `1px --line` sebagai pemisah. Struktur dibentuk oleh jarak dan garis, bukan kotak.

---

## 6. Foto & citra

Foto adalah isi utama situs ini, jadi aturannya ketat.

### 6.1 Aturan umum
- **Hanya foto asli**, dengan fotografer dan lisensi yang jelas. Tidak ada gambar hasil AI.
- Foto dalam satu halaman berbagi karakter warna yang sejalan: jangan campur satu foto jenuh dan satu foto pudar tanpa alasan.
- Hindari foto yang terlalu diolah (HDR agresif, saturasi tinggi).
- Subjek tidak boleh tepat di tengah bila ruang headline dibutuhkan; sisakan ruang lapang untuk teks.
- Orang tidak berpose menghadap kamera kecuali itu bagian dari cerita.

### 6.2 Rasio
| Penggunaan | Desktop | Ponsel |
|---|---|---|
| Hero beranda | 16:9, mengisi `min(100svh, 980px)` | 4:5 |
| Hero destinasi | 21:9 | 4:5 |
| Foto tinggi di grid | 4:5 | 4:5 |
| Foto di artikel | 3:2 | 3:2 |
| Gambar kecil di daftar | 4:5 (96×120) | 4:5 |

Rasio dikunci lewat `aspect-ratio` sehingga tidak ada pergeseran tata letak. Titik fokus (`focal.x`, `focal.y`) menjadi `object-position`.

### 6.3 Pemuatan
- Foto hero: `fetchpriority="high"`, `<link rel="preconnect">` ke `images.unsplash.com` bila foto Unsplash, `srcset` dengan lebar 640/960/1280/1600/2400.
- Placeholder buram (`lqip`) tampil sebagai latar sampai foto selesai; foto memudar masuk 600 ms.
- **Foto Unsplash tidak disalin atau diubah URL-nya** kecuali parameter ukuran dan format. Parameter `ixid` selalu dipertahankan (syarat Unsplash).
- Bila foto gagal dimuat, `dominant_color` yang sudah digelapkan menjadi latar cadangan dan teks tetap terbaca.

### 6.4 Scrim (dihitung, bukan ditebak)

Teks `#F4F7F6` di atas foto harus memenuhi kontras 4,5:1 untuk teks kecil dan 3:1 untuk teks besar. Alat `pick_photo.py` mengukur **luminans terburuk di area teks** (`L_foto`) dan memilih tingkat scrim.

Rumusnya: dengan `L_teks ≈ 0,93`, latar efektif harus `≤ 0,19`, sehingga alpha scrim minimal `a = (L_foto − 0,19) / (L_foto − 0,006)`.

| Tingkat | Alpha scrim di area teks | Dipakai bila `L_foto` di area teks |
|---|---|---|
| `ringan` | 0,50 | ≤ 0,38 |
| `sedang` | 0,65 | ≤ 0,53 |
| `kuat` | 0,78 | ≤ 0,84 |
| (ditolak) | | > 0,84. Foto dipotong ulang atau diganti |

Gradien: bagian bawah `linear-gradient(to top, rgb(9 18 24 / a) 0%, rgb(9 18 24 / a*0.55) 38%, transparent 72%)`; bagian atas (untuk header) `linear-gradient(to bottom, rgb(9 18 24 / .55), transparent 22%)`.

### 6.5 Keterangan dan teks alternatif
- Keterangan foto hero memuat dua baris: nama tempat (serif miring 16 px) dan kredit (13 px): "Nusa Penida, Bali" lalu "Foto: Nama Fotografer di Unsplash". Kredit selalu tertaut ke profil fotografer.
- Teks alternatif berbahasa Indonesia dan menjelaskan apa yang terlihat, minimal 20 karakter: "Perahu kayu bersandar di teluk berbatu karang saat air surut". Tidak boleh berupa "foto pantai".
- Foto dekoratif murni ditandai `alt=""` dengan sengaja, dan hampir tidak ada di situs ini.

---

## 7. Hero

Hero adalah kesan pertama. Hero berisi foto asli, satu headline, satu kalimat, dan panel Rencana Cepat. **Tidak ada tombol utama terpisah**: panel Rencana Cepat adalah tindakan utamanya.

### 7.1 Susunan desktop (≥ 1024 px)

```
┌────────────────────────────────────────────────────────────────────────┐
│ Singgah   Destinasi  Suasana  Catatan  Rencana saya      Masuk [Susun rencana]│  header transparan
│                                                                        │
│                        (foto asli penuh layar)                         │
│                                                                        │
│  Tempat yang pantas                                                    │  serif ±150 px
│             disinggahi                                                 │  baris 2 menjorok
│                                                                        │
│  Panduan 12 destinasi Nusantara dengan          Nusa Penida, Bali      │
│  kalender musim dari data cuaca 30 tahun.       Foto: Nama di Unsplash │
│  Jelajahi semua destinasi                                              │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Tujuan        │ Bulan      │ Lama       │ Suasana     │ [Lihat saran]│ │  panel kertas,
│ │ Belum tahu    │ November   │ 4 hari     │ Apa saja    │              │ │  menempel di dasar
│ └────────────────────────────────────────────────────────────────────┘ │  menimpa ±40 px
```

- **Tinggi:** `min(100svh, 980px)`, minimum 600 px.
- **Headline:** `--t-hero`, dua baris, rata kiri, `max-width: 12ch` per baris. Baris kedua menjorok 14% lebar wadah.
- **Kalimat pendamping:** `--t-lead`, maksimum 36 karakter per baris, `--text` terang di atas scrim. Angka "12" dihitung dari jumlah destinasi saat build, bukan ditulis tangan.
- **Tautan sekunder:** "Jelajahi semua destinasi", teks dengan garis bawah (tanpa panah).
- **Keterangan foto:** kanan bawah di atas panel, rata kanan (lihat 6.5).
- **Header:** transparan di atas hero. Wordmark "Singgah" (serif, 28 px) di kiri, menu di tengah, "Masuk" (teks) dan tombol "Susun rencana" (kunyit) di kanan. Setelah menggulir melewati hero, header berubah menjadi bilah `--bg` setinggi 64 px dengan garis bawah `1px --line`, tersembunyi saat menggulir turun dan muncul saat menggulir naik.

### 7.2 Panel Rencana Cepat
| Properti | Nilai |
|---|---|
| Latar | `--surface` solid. **Tidak ada transparansi atau blur** |
| Lebar | `min(1160px, 100% − 2 × margin)`, terpusat |
| Tinggi | 80 px pada desktop |
| Bayangan | `--shadow-panel` |
| Radius | 4 px |
| Pemisah antar bidang | garis vertikal `1px --line` |
| Label bidang | 13 px, `--text-3`, di atas nilai. Huruf biasa, bukan kapital |
| Nilai bidang | 16 px, 500, `--text` |
| Tombol | "Lihat saran", kunyit, tinggi penuh panel, sudut kanan membulat 4 px |

Bidang dan perilaku:
| Bidang | Jenis | Catatan |
|---|---|---|
| Tujuan | Combobox | Mengetik menyaring destinasi. Pilihan awal "Belum tahu, sarankan" |
| Bulan | Pilihan | Bawaan bulan berjalan |
| Lama | Stepper | 1–14 hari; tombol `−`/`+` dan ketik langsung; `↑`/`↓` mengubah satu |
| Suasana | Pilihan | Dari koleksi `moods`; bawaan "Apa saja" |

Tanpa JavaScript, panel adalah formulir `GET` biasa ke `/rencana/saran` dan tetap berfungsi.

### 7.3 Ponsel (< 768 px)

```
┌───────────────────┐
│ Singgah      Menu │
│                   │
│   (foto 4:5)      │
│                   │
│ Tempat yang       │
│ pantas            │
│    disinggahi     │
│ Panduan 12        │
│ destinasi …       │
│                   │
│ [   Rencana cepat ]│  tombol kunyit selebar layar
│ Nusa Penida, Bali │
│ Foto: Nama …      │
└───────────────────┘
```
- Tombol "Rencana cepat" membuka **lembar bawah** (dialog) berisi keempat bidang tersusun vertikal dan tombol "Lihat saran" di dasar.
- Keterangan foto berada di bawah tombol, rata kiri.
- Menu membuka lembar penuh layar dengan tautan serif besar.

### 7.4 Markup acuan

```html
<section class="hero tema-malam" aria-labelledby="hero-judul">
  <picture class="hero__foto" style="--lqip: url(...); --fx: 62%; --fy: 48%;">
    <img src="…&w=1600" srcset="…&w=640 640w, …&w=960 960w, …&w=1600 1600w, …&w=2400 2400w"
         sizes="100vw" width="2400" height="1350" fetchpriority="high"
         alt="Perahu kayu bersandar di teluk berbatu karang saat air surut">
  </picture>
  <div class="hero__scrim" style="--a: .65"></div>

  <h1 id="hero-judul" class="hero__judul">
    <span class="baris">Tempat yang pantas</span>
    <span class="baris baris--2">disinggahi</span>
  </h1>
  <p class="hero__lead">Panduan 12 destinasi Nusantara dengan kalender musim dari data cuaca 30 tahun.</p>
  <a class="tautan" href="/destinasi">Jelajahi semua destinasi</a>

  <figure class="hero__keterangan">
    <figcaption><em>Nusa Penida, Bali</em><br>Foto: <a href="…">Nama</a> di <a href="…">Unsplash</a></figcaption>
  </figure>
</section>
<form class="quickplan" method="get" action="/rencana/saran"> … </form>
```

---

## 8. Halaman beranda

Urutan bagian setelah hero. Setiap bagian punya **satu titik fokus**.

### 8.1 Sedang bagus bulan ini

```
┌──────────────────────────────┬─────────────────────────────────────────┐
│                              │ Sedang bagus bulan ini                  │
│     foto tinggi 4:5          │ (judul serif, nama bulan dinamis)       │
│     destinasi teratas        │                                         │
│                              │ [foto kecil] Bromo                      │
│  Nama destinasi (serif 32)   │              Kering, 3 hari hujan.      │
│  Satu kalimat alasan         │              ▂▃▅▇█▇▅▃▂▂▃▅  (strip ringkas)│
│                              │ ───────────────────────────────────     │
│                              │ [foto kecil] Labuan Bajo …              │
│                              │ ───────────────────────────────────     │
│                              │ [foto kecil] … (empat baris)            │
└──────────────────────────────┴─────────────────────────────────────────┘
```
- Kolom kiri 5/12, kolom kanan 6/12, satu kolom kosong di antaranya.
- Daftar di kanan berupa **baris dengan garis pemisah**, bukan kartu. Tidak ada angka urutan.
- Setiap baris: foto 96×120, nama (serif 24), satu kalimat alasan yang dibuat dari data ("Kering, 3 hari hujan, cocok untuk 3 sampai 5 hari"), dan Kalender musim ringkas dengan bulan berjalan ditandai.
- Dihitung di peramban dengan paket `scoring`. Nilai awal (HTML statis) memakai bulan saat build, lalu diperbarui bila bulan pengunjung berbeda.

### 8.2 Menurut suasana

Daftar tipografis besar. Bukan kartu.

```
Pantai yang sepi ──────────────────────────────  4 destinasi
Gunung dan kabut ──────────────────────────────  3 destinasi
Kota tua dan makanan ──────────────────────────  2 destinasi
Desa dan upacara ──────────────────────────────  2 destinasi
Laut dalam ────────────────────────────────────  1 destinasi
```
- Setiap baris: serif `clamp(2.25rem, 5vw, 4.5rem)`, garis pemisah `1px --line`, jumlah destinasi di kanan (13 px, `--text-3`).
- Desktop: saat baris disorot atau difokus, foto pratinjau 4:5 muncul di kolom kanan dengan pergantian memudar 200 ms. Ponsel: foto kecil di kanan setiap baris, selalu tampil.
- Jumlah dihitung dari konten.

### 8.3 Kapan waktu terbaik, menurut data

**Momen khas Singgah.** Bagian gelap (`.tema-malam`) selebar layar.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Kapan waktu terbaik, menurut data                                     │
│  Rata-rata cuaca 1994 sampai 2023, dihitung per bulan.                 │
│                                                                        │
│  Destinasi:  [ Labuan Bajo  ▾ ]                                        │
│                                                                        │
│        █                                                               │
│     █  █  █                                       █  █                 │
│  █  █  █  █  █                                 █  █  █  █              │
│  █  █  █  █  █  █  █  █  █  █  █  █                                    │
│  Jan Feb Mar Apr Mei Jun Jul Agu Sep Okt Nov Des                       │
│                                                                        │
│  Agustus: sangat baik                                                  │
│  42 mm hujan   5 hari hujan   29 °C                                    │
│  Lihat angka lengkap   Cara kami menghitung                            │
└────────────────────────────────────────────────────────────────────────┘
```
- Strip penuh (lihat 11.5), tinggi 160 px di desktop, dengan label bulan.
- Pilihan destinasi memakai `<select>` asli yang diberi gaya; mengubahnya menganimasikan batang dari tinggi lama ke tinggi baru dalam 300 ms.
- Panel rincian bulan: nama bulan dan tingkat dalam serif, tiga angka dalam sans besar dengan label di bawahnya.
- Tautan "Lihat angka lengkap" membuka tabel 12 baris; "Cara kami menghitung" mengarah ke halaman Catatan data.

### 8.4 Catatan lapangan

Tiga tulisan terbaru sebagai **daftar yang mengutamakan teks**.
- Setiap baris: judul serif 32 px, satu kalimat ringkasan, tanggal dan waktu baca ("8 menit baca") dalam 13 px, dan gambar 3:2 kecil di kanan.
- Garis pemisah `1px --line`. Tidak ada kartu.

### 8.5 Rencana contoh

Tiga kolom hari dipisahkan garis vertikal, menampilkan rencana contoh nyata (disusun dari data konten, bukan karangan).
- Judul kolom "Hari 1", "Hari 2", "Hari 3" (penomoran sah karena ini memang urutan).
- Item: waktu hari (pagi, siang, sore), nama, satu baris catatan.
- Satu tombol sekunder di bawah: "Susun rencanamu".

### 8.6 Footer
- Latar `--malam-950`. Wordmark serif besar di kiri.
- Kolom: Jelajah (Destinasi, Suasana, Catatan lapangan), Rencana (Rencana Cepat, Rencana saya), Tentang (Catatan data, Atribusi, Privasi, Repositori).
- Baris bawah, teks biasa 13 px: "Foto milik para fotografer yang tercantum di halaman Atribusi. Data cuaca dari Open-Meteo (CC BY 4.0). Dibangun 12 Oktober 2026."
- Pilihan tema tiga keadaan: Ikuti sistem, Terang, Gelap.

---

## 9. Halaman destinasi

```
┌────────────────────────────────────────────────────────────────────────┐
│ (foto penuh lebar 21:9, scrim)                                         │
│                                                                        │
│  Labuan Bajo                          (serif --t-display, kiri bawah)  │
│  Nusa Tenggara Timur                                                   │
├──────────────────────────────────────────────┬─────────────────────────┤
│ Ringkasan (lead, 2–3 kalimat)                │ [Tambah ke rencana]     │
│                                              │ [♡ Simpan favorit]      │
│ Kapan ke sana                                │ ─────────────────────── │
│   Kalender musim ukuran penuh                │ Zona waktu    WITA      │
│   catatan lokal dan penimpaan + alasannya    │ Lama ideal    3 sampai 5 hari│
│                                              │ Diverifikasi  12 Okt 2026│
│ Cuaca sekarang                               │                         │
│   [WeatherNow]                               │  (sticky di desktop)    │
│                                              │                         │
│ Cara ke sana (dengan sumber)                 │                         │
│                                              │                         │
│ Yang layak disinggahi                        │                         │
│   [HighlightRow] [HighlightRow] …            │                         │
│                                              │                         │
│ Tips dari pelancong                          │                         │
└──────────────────────────────────────────────┴─────────────────────────┘
```
- Isi utama di kolom 1–8, aside sticky di kolom 10–12.
- "Fakta singkat" ditata sebagai daftar definisi (nama di kiri, nilai di kanan) dengan garis pemisah. Bukan tabel berwarna.
- Tombol favorit memakai teks "Simpan favorit", bukan ikon saja.
- **Setiap klaim non-umum menampilkan sumbernya sebagai tautan kecil** di akhir kalimat atau paragraf, dan `verified_at` di aside.
- Ponsel: aside menjadi satu baris tombol di bawah ringkasan, bukan lengket.

---

## 10. Penyusun rencana & akun

### 10.1 Susunan penyusun rencana (desktop)

```
┌───────────────────┬─────────────────────────────────────┬────────────────────┐
│ Rencana           │ Hari 1                              │ Yang layak          │
│ [Judul rencana  ] │ ┌─────────────────────────────────┐ │ disinggahi          │
│ Tujuan  Labuan Bajo│ │⠿ Pagi   Pulau Padar        [⋯] │ │                    │
│ Bulan   November  │ │⠿ Sore   Kampung Ujung      [⋯] │ │ Pulau Padar  [Tambah]│
│ Lama    4 hari    │ └─────────────────────────────────┘ │ Pink Beach   [Tambah]│
│                   │ + Tambah item                       │ …                  │
│ Kalender musim    │                                     │                    │
│ ▂▃▅▇█▇▅▃▂▂▃▅     │ Hari 2 …                            │                    │
│ Terpilih: Nov     │                                     │                    │
│                   │                                     │                    │
│ Tersimpan 14:02   │                                     │                    │
│ [Bagikan] [Cetak] │                                     │                    │
└───────────────────┴─────────────────────────────────────┴────────────────────┘
```
- Tiga panel: pengaturan rencana (kiri, 3 kolom), hari-hari (tengah, 6 kolom), saran (kanan, 3 kolom).
- **Baris item** (tinggi 56 px): pegangan seret 44×44 px, pilihan waktu hari (pagi, siang, sore, malam), judul (dapat disunting langsung), menu "⋯" (naik, turun, pindah hari, catatan, hapus).
- **Seret dan lepas selalu punya padanan papan ketik:** menu `⋯` memuat "Naik" dan "Turun", dan pegangan dapat diaktifkan dengan `Spasi` lalu digeser dengan panah.
- Peringatan lembut muncul di bawah hari yang bermasalah dengan penanda `--warn` (garis kiri 2 px kunyit + teks): "Hari ini cukup padat: tiga aktivitas sehari penuh. Pertimbangkan memindahkan satu."
- Penanda simpan berupa teks: "Menyimpan", "Tersimpan 14:02", atau "Belum tersimpan. Masuk untuk menyimpan ke akunmu."
- Ponsel: satu kolom; panel pengaturan di atas (dapat dilipat), hari-hari di tengah, saran menjadi lembar bawah dari tombol "Tambah dari saran".

### 10.2 Halaman Rencana saya
Daftar baris (bukan kartu): judul, destinasi, bulan, jumlah hari, terakhir diubah, status berbagi. Tindakan per baris di menu `⋯`.

### 10.3 Halaman rencana bersama (`/r/{slug}`)
Hanya-baca, tanpa panel pengaturan, dengan tombol "Salin ke rencanaku" (masuk bila perlu) dan "Cetak". Header menampilkan nama pemilik **hanya bila ia mengizinkan**; bawaannya anonim.

---

## 11. Komponen

### 11.1 Tombol

| Varian | Rupa | Pemakaian |
|---|---|---|
| **Utama** | Latar `--cta-bg`, teks `--cta-text`, 6 px, tinggi 48 px, padding 20 px, 500 | Satu per layar |
| **Sekunder** | Latar `--surface`, garis 1 px `--line` yang lebih tegas (`--text-3` 40%), teks `--text` | Tindakan lain |
| **Teks** | Tanpa latar, teks `--link`, garis bawah 1 px, offset 4 px | Tautan dan tindakan ringan |
| **Berbahaya** | Latar `--error`, teks putih | Hapus rencana, hapus akun, setelah konfirmasi |

- Hover: perubahan warna 120 ms; tanpa pergeseran dan tanpa bayangan.
- Fokus: cincin 2 px `--focus` dengan offset 3 px, tidak pernah dimatikan.
- Saat permintaan berjalan, tombol menampilkan teks "Menyimpan" dan nonaktif; tidak ada putaran layar penuh.
- **Teks tombol tidak diakhiri panah.**

### 11.2 Bidang formulir
- Label di atas bidang, 13 px, `--text-3`. Placeholder bukan label.
- Tinggi 48 px, latar `--surface`, garis `1px --line` yang lebih tegas, radius 6 px.
- Galat di bawah bidang dengan awalan "Galat:" dan `aria-describedby`; warna `--error` hanya penguat.
- Pemilih berupa `<select>` asli yang diberi gaya, kecuali Tujuan yang memakai combobox aksesibel.

### 11.3 Combobox Tujuan
Mengetik menyaring daftar destinasi; hasil muncul di bawah bidang (maksimum 6). Pilihan panah, `Enter` memilih, `Esc` menutup. Opsi pertama selalu "Belum tahu, sarankan".

### 11.4 Stepper lama perjalanan
Tombol `−` dan `+` berukuran 44×44 px mengapit angka yang dapat diketik. Nilai di luar 1–14 dikoreksi saat kehilangan fokus, dengan pesan jelas.

### 11.5 Kalender musim (`SeasonStrip`) — elemen khas

**Struktur:** daftar 12 item, masing-masing satu `<button>`.

| Properti | Ringkas | Penuh |
|---|---|---|
| Tinggi maksimum | 28 px | 160 px |
| Jarak antar batang | 2 px | 6 px |
| Tinggi minimum (tingkat 1) | 25% dari maksimum | 25% |
| Label bulan | Disembunyikan secara visual; ada di nama aksesibel | Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agu, Sep, Okt, Nov, Des (13 px) |
| Radius | 1 px (sudut atas) | 2 px (sudut atas) |

**Pengodean ganda:** tinggi batang (25, 50, 75, 100%) dan warna (3.3) sama-sama menunjukkan tingkat. Garis tepi 1 px `--text-3` pada setiap batang.

**Penanda:**
- **Bulan berjalan:** garis bawah 2 px `--cta-bg` di bawah label (atau di bawah batang pada ukuran ringkas) dan label berbobot 600.
- **Bulan terpilih:** batang diberi garis tepi 2 px `--text`.
- **Bulan dengan penimpaan manual** (`season_overrides`): titik 4 px `--warn` di atas batang. Nama aksesibel dan tooltip menyertakan alasannya.

**Interaksi:**
- Tooltip muncul saat hover dan fokus: "Agustus: sangat baik. Hujan 42 mm, 5 hari hujan, 29 °C." Pada layar sentuh, ketuk memilih bulan dan menampilkan rincian di panel di bawah.
- Navigasi papan ketik: `←`/`→` berpindah bulan (roving tabindex), `Home`/`End` ke Januari/Desember.

**Alternatif teks dan tabel:**
- Nama aksesibel seluruh strip: "Kalender musim Labuan Bajo. Sangat baik: Mei sampai September. Kurang: Desember sampai Februari."
- Ukuran penuh menyediakan `<details>` "Lihat angka lengkap" berisi tabel 12 baris (bulan, hujan mm, hari hujan, suhu maksimum, tingkat).

**Gerak (satu kali):** saat pertama kali terlihat, batang tumbuh dari dasar (`scaleY` 0 ke 1, asal bawah), 480 ms, jeda 40 ms antar batang. Dimatikan oleh `prefers-reduced-motion`.

```css
.musim { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--musim-gap, 6px);
         align-items: end; height: var(--musim-h, 160px); }
.musim__bulan { height: calc(var(--lvl) * 25%); min-height: 6px;
  background: var(--musim-c); border-radius: 2px 2px 0 0;
  box-shadow: inset 0 0 0 1px var(--text-3); }
.musim__bulan[data-lvl="1"] { --lvl: 1; --musim-c: var(--musim-1); }
.musim__bulan[data-lvl="2"] { --lvl: 2; --musim-c: var(--musim-2); }
.musim__bulan[data-lvl="3"] { --lvl: 3; --musim-c: var(--musim-3); }
.musim__bulan[data-lvl="4"] { --lvl: 4; --musim-c: var(--musim-4); }
```

### 11.6 Cuaca sekarang (`WeatherNow`)
- Tata letak: suhu serif besar (`--t-temp`, mis. "29°"), di sampingnya kondisi dalam kalimat ("Cerah berawan"). Baris kedua: "Terasa 32 °C, angin 14 km/jam, peluang hujan 10%".
- Prakiraan 7 hari berupa tujuh kolom: singkatan hari (Sen, Sel, …), suhu maksimum dan minimum, dan batang kecil peluang hujan. Tanpa ikon cuaca bergaya kartun.
- Kerangka muat berukuran sama persis dengan widget asli.
- Keadaan galat: "Cuaca belum bisa dimuat. Coba lagi." dengan tombol teks dan tautan ke BMKG sebagai sumber resmi.
- Di bawahnya: "Data: Open-Meteo, diperbarui 14.05 WIB" (13 px, `--text-3`).

### 11.7 Baris highlight (`HighlightRow`)
Baris dengan garis pemisah: nama (serif 24), jenis dan lama dalam kalimat biasa ("Alam, setengah hari, paling baik pagi hari"), catatan satu atau dua kalimat, dan tombol sekunder "Tambahkan ke rencana". Tidak ada foto kecuali tersedia foto yang memang bermakna.

### 11.8 Tips pelancong
Setiap tip: isi (teks polos), "Dikunjungi pada Agustus" bila ada, nama tampilan, dan tombol teks "Laporkan". Tip tidak pernah dirender sebagai HTML. Keadaan kosong: "Belum ada tip untuk tempat ini. Pernah ke sini? Bagikan satu."

### 11.9 Header dan menu
- Desktop: lihat 7.1. Tautan menu 15 px, 500; tautan aktif diberi garis bawah 2 px `--cta-bg`.
- Ponsel: tombol "Menu" membuka lembar penuh layar `--malam-950` dengan tautan serif besar (`--t-h2`), fokus terjebak di dalamnya, `Esc` menutup.

### 11.10 Notifikasi (toast), dialog, dan lembar
- Toast kecil di kanan bawah (dasar tengah di ponsel), 4 detik, dapat ditutup, diumumkan lewat `aria-live="polite"`.
- Dialog: radius 4 px, `--surface`, `--shadow-float`, fokus terjebak, fokus kembali ke pemicu saat ditutup.
- Lembar bawah di ponsel meluncur 200 ms dari bawah.

---

## 12. Keadaan antarmuka dan teks

### 12.1 Keadaan

| Keadaan | Perlakuan |
|---|---|
| Memuat widget | Kerangka berukuran sama dengan konten asli |
| Kosong (belum ada rencana) | Satu kalimat dan dua tautan: "Belum ada rencana. Mulai dari Rencana Cepat atau pilih destinasi." |
| Kosong (hasil filter) | "Tidak ada destinasi yang cocok dengan filter ini." plus saran menghapus filter terdekat |
| Galat jaringan | Pita dengan penyebab dan tombol "Coba lagi" |
| Fitur akun beristirahat (batas D1) | "Fitur akun sedang beristirahat sampai pukul 07.00 WIB. Rencana yang kamu susun tetap tersimpan di perangkat ini." Halaman lain tetap berfungsi |
| 404 | Foto penuh layar dari pustaka, judul serif "Halaman ini tidak ketemu", satu tombol kembali ke beranda |

### 12.2 Pedoman teks antarmuka
- Bahasa Indonesia lugas, kalimat aktif, sapaan "kamu".
- Tombol menyebut apa yang terjadi: "Simpan ke Rencana saya", "Lihat saran", "Salin ke rencanaku". Bukan "Kirim" atau "OK".
- Satu tindakan memakai satu nama di seluruh alur ("Susun rencana" tetap "Susun rencana").
- Galat menyebut apa yang salah dan apa yang bisa dilakukan, tanpa meminta maaf berlebihan.
- Sentence case di mana-mana.

| Konteks | Teks |
|---|---|
| Tombol header | Susun rencana |
| Tombol panel | Lihat saran |
| Tautan hero | Jelajahi semua destinasi |
| Simpan | Simpan ke Rencana saya |
| Berbagi | Bagikan |
| Berhasil disalin | Tautan disalin |
| Hapus | Hapus rencana. Dialog: "Hapus rencana "Labuan Bajo, 4 hari"? Tindakan ini tidak bisa dibatalkan." |
| Masuk | Masuk dengan Google |

---

## 13. Gerak

Hanya tiga momen yang boleh bergerak tanpa dipicu pengguna.

| Momen | Perilaku |
|---|---|
| **Hero dimuat** | Foto memudar dari placeholder (600 ms). Dua baris headline naik dari balik topeng (`translateY` 100% ke 0 di dalam pembungkus `overflow: hidden`), 700 ms, jeda 120 ms antar baris, kurva `cubic-bezier(.2,.7,.2,1)`. Terjadi **sekali** |
| **Kalender musim pertama terlihat** | Batang tumbuh dari dasar, 480 ms, jeda 40 ms (lihat 11.5) |
| **Menu atau lembar dibuka** | Meluncur 200 ms |

Selain itu, hanya transisi keadaan: warna dan garis bawah 120 ms, pergantian foto pratinjau 200 ms, perubahan tinggi batang saat mengganti destinasi 300 ms. **Tidak ada** animasi masuk pada bagian lain, efek parallax, atau animasi yang berulang.

`prefers-reduced-motion: reduce` mematikan semuanya; perubahan tetap terjadi, hanya tanpa transisi.

---

## 14. Responsif

| Lebar | Perilaku |
|---|---|
| < 480 | Satu kolom. Hero 4:5. Rencana Cepat menjadi tombol yang membuka lembar. Daftar suasana menampilkan foto kecil di kanan baris |
| 480–767 | Seperti di atas dengan margin lebih besar |
| 768–1023 | Dua kolom pada grid editorial. Panel Rencana Cepat menjadi dua baris (bidang 2×2, tombol di baris ketiga). Menu menjadi lembar |
| 1024–1279 | Tata letak desktop penuh. Pratinjau foto suasana muncul saat disorot |
| 1280–1535 | Wadah 1360 px, margin lebih lega |
| ≥ 1536 | Wadah tetap 1360 px, hero tetap penuh lebar dengan tinggi maksimum 980 px |

- Sasaran sentuh minimal 44×44 px.
- Tidak ada fungsi yang hanya tersedia lewat hover.
- Penyusun rencana di ponsel tetap bisa dipakai penuh (satu kolom), tetapi pesan jujur menyarankan layar lebih lebar bila rencananya sangat padat.

---

## 15. Cetak

Tampilan cetak hanya untuk halaman rencana (`/rencana/*` dan `/r/*`).
- Latar putih, teks hitam, tanpa foto latar, tanpa navigasi dan tombol.
- Ukuran halaman A4, margin 18 mm.
- Judul rencana dalam serif; setiap hari menjadi satu bagian dengan `break-inside: avoid`.
- Setiap item menampilkan waktu hari, nama, dan catatan; tautan dicetak dalam bentuk teks.
- Di bagian bawah: "Dibuat dengan Singgah. Cuaca dan jam buka bisa berubah, periksa kembali sebelum berangkat."

---

## 16. Aksesibilitas

- Kontras diperiksa seperti di 3.4; teks di atas foto diperiksa pada kondisi terburuk lewat perhitungan scrim di 6.4.
- Seluruh alur (Rencana Cepat, penyusun rencana, moderasi) bisa diselesaikan dengan papan ketik. Urutan fokus mengikuti urutan visual.
- Cincin fokus 2 px `--focus`, offset 3 px, selalu terlihat.
- Informasi tidak hanya lewat warna: Kalender musim memakai tinggi batang, teks, dan tabel alternatif.
- Dialog menjebak fokus dan mengembalikannya; `Esc` menutup.
- Tautan "Lewati ke konten" muncul pertama saat `Tab`.
- Toast diumumkan lewat `aria-live`. Galat formulir dikaitkan ke bidangnya dan fokus berpindah ke galat pertama.
- Atribut `lang="id"` pada `<html>`; nama tempat berbahasa daerah tidak perlu diberi `lang` terpisah kecuali dalam kutipan panjang.
- Sasaran sentuh ≥ 44×44 px. Teks minimum 13 px.
- Diuji dengan pembaca layar pada satu alur penuh (Rencana Cepat sampai menyimpan rencana) sebelum rilis.

---

## 17. Token CSS

```css
:root {
  /* semantik, terang */
  --bg:#F1F4F3; --surface:#FFFFFF; --surface-2:#E6EBEA; --line:#C5D0CE;
  --text:#0D1B22; --text-2:#44555C; --text-3:#5F6F76;
  --link:#124B5B; --link-hover:#0A3441;
  --cta-bg:#E8A317; --cta-hover:#D9960F; --cta-text:#0D1B22;
  --warn:#8A5A00; --warn-bg:#F7ECD0;
  --error:#B8322A; --error-bg:#F6DEDB;
  --ok:#2F7D5B; --ok-bg:#DCEEE5;
  --focus:#124B5B;
  --musim-1:#CBD5D5; --musim-2:#9BC3CC; --musim-3:#4F9AAB; --musim-4:#124B5B;
  --scrim:9 18 24;

  /* tipografi */
  --font-serif:"Instrument Serif", Georgia, "Times New Roman", serif;
  --font-sans:"Albert Sans", "Helvetica Neue", Arial, sans-serif;
  --t-hero:clamp(3.25rem, 9.5vw, 9.5rem);
  --t-display:clamp(2.5rem, 6vw, 5.5rem);
  --t-h2:clamp(2rem, 3.6vw, 3.25rem);
  --t-h3:1.5rem;
  --t-temp:clamp(4rem, 8vw, 6rem);
  --t-lead:clamp(1.125rem, 1.5vw, 1.375rem);
  --t-body:1.0625rem; --t-ui:.9375rem; --t-small:.8125rem;

  /* ruang dan bentuk */
  --margin-x:clamp(16px, 4vw, 64px);
  --gutter:clamp(16px, 2vw, 24px);
  --section-y:clamp(72px, 10vw, 160px);
  --r-media:2px; --r-ui:6px; --r-panel:4px;
  --shadow-panel:0 18px 40px rgb(9 18 24 / .28);
  --shadow-float:0 8px 24px rgb(9 18 24 / .18);

  /* gerak */
  --ease:cubic-bezier(.2,.7,.2,1);
  --dur-fast:120ms; --dur-base:200ms; --dur-bars:480ms; --dur-hero:700ms;
}

/* tema gelap: pilihan pengguna, sistem, dan bagian yang selalu gelap */
:root[data-theme="dark"], .tema-malam {
  --bg:#091218; --surface:#101D26; --surface-2:#17272F; --line:#263640;
  --text:#E8EEEF; --text-2:#A9B8BD; --text-3:#7F9097;
  --link:#7CC3D2; --link-hover:#A8E0EC;
  --cta-bg:#F0B13A; --cta-hover:#F5C25E; --cta-text:#0D1B22;
  --warn:#E0B04C; --warn-bg:#2E2612;
  --error:#EE8279; --error-bg:#3A1D1B;
  --ok:#6CC09D; --ok-bg:#14302A;
  --focus:#7CC3D2;
  --musim-1:#2B3A41; --musim-2:#3F7482; --musim-3:#5FAFC2; --musim-4:#A8E0EC;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:#091218; --surface:#101D26; --surface-2:#17272F; --line:#263640;
    --text:#E8EEEF; --text-2:#A9B8BD; --text-3:#7F9097;
    --link:#7CC3D2; --link-hover:#A8E0EC;
    --cta-bg:#F0B13A; --cta-hover:#F5C25E;
    --warn:#E0B04C; --warn-bg:#2E2612;
    --error:#EE8279; --error-bg:#3A1D1B;
    --ok:#6CC09D; --ok-bg:#14302A;
    --focus:#7CC3D2;
    --musim-1:#2B3A41; --musim-2:#3F7482; --musim-3:#5FAFC2; --musim-4:#A8E0EC;
  }
}

body { background:var(--bg); color:var(--text); font:400 var(--t-body)/1.7 var(--font-sans); }
h1,h2,h3 { font-family:var(--font-serif); font-weight:400; margin:0; }
.hero__judul { font-size:var(--t-hero); line-height:.92; letter-spacing:-.02em; }
.hero__judul .baris--2 { display:block; margin-left:14%; }
@media (max-width:767px){ .hero__judul .baris--2 { margin-left:8vw; } }

:focus-visible { outline:2px solid var(--focus); outline-offset:3px; border-radius:var(--r-ui); }

.btn-utama { background:var(--cta-bg); color:var(--cta-text); min-height:48px; padding:0 20px;
  border:0; border-radius:var(--r-ui); font:500 var(--t-ui)/1 var(--font-sans); }
.btn-utama:hover { background:var(--cta-hover); }

@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { animation:none !important; transition:none !important; }
}
```

Tailwind, bila dipakai, dikonfigurasi membaca variabel di atas. **Tidak ada nilai hex yang ditulis langsung di komponen.**

---

## 18. Daftar periksa tinjauan desain

Setiap halaman baru lolos hanya bila semua butir terpenuhi.

- [ ] Layar pertama berisi foto asli dengan keterangan dan kredit yang tertaut.
- [ ] Hanya satu tombol kunyit terlihat pada satu waktu.
- [ ] Tidak ada pola dari daftar larangan di 1.3.
- [ ] Scrim dipilih berdasarkan hasil perhitungan 6.4; teks lolos kontras pada kondisi terburuk.
- [ ] Kalender musim memakai tinggi batang **dan** warna, punya nama aksesibel dan tabel alternatif.
- [ ] Tidak ada nilai hex, ukuran, atau jarak di luar token.
- [ ] Judul berupa kalimat biasa; tidak ada label huruf kapital, panah di tombol, atau monospasi.
- [ ] Keadaan memuat, kosong, galat, dan "beristirahat" (batas D1) sudah dirancang.
- [ ] Alur utama bisa diselesaikan hanya dengan papan ketik.
- [ ] `prefers-reduced-motion` diuji; halaman tetap utuh.
- [ ] Diuji di ponsel nyata dengan koneksi lambat, termasuk saat foto hotlink gagal dimuat.
- [ ] Teks alternatif foto berbahasa Indonesia dan menjelaskan apa yang terlihat.
- [ ] Tidak ada klise dari daftar frasa terlarang (diperiksa `content_lint.py`).
- [ ] Mode gelap diperiksa bagian demi bagian, bukan sekadar dibalik.
- [ ] Tampilan cetak rencana diuji pada A4.

---

*DESIGN v1.0 — dokumen hidup. Palet dan huruf adalah titik awal yang beralasan; ubah lewat token, bukan di komponen, dan catat alasannya di `docs/decisions/`.*
