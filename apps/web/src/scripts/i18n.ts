/**
 * Singgah i18n Translation Engine (ID <-> EN)
 * Clean client-side internationalization system with localStorage persistence
 */

export type SupportedLang = 'id' | 'en';

export const translations: Record<SupportedLang, Record<string, string>> = {
  id: {
    // Header & Navigation
    'nav.destinasi': 'Destinasi',
    'nav.suasana': 'Suasana',
    'nav.rencana': 'Rencana Saya',
    'nav.catatan': 'Catatan',
    'nav.data': 'Tentang Data',
    'nav.masuk': 'Masuk',
    'nav.susun': 'Susun Rencana',

    // Hero Section
    'hero.eyebrow': 'NUSANTARA MENANTI',
    'hero.title': 'Petualangan <br /> Yang Selalu <br /> Bersamamu',
    'hero.desc': 'Temukan keelokan tersembunyi pulau-pulau Nusantara, momen musim terbaik yang presisi, dan kenangan abadi — dikurasi dari data iklim 30 tahun.',
    'hero.cta_explore': 'Jelajahi Destinasi',
    'hero.cta_notes': 'Catatan Lapangan',

    // Booking Card (Semua dalam Bahasa Indonesia)
    'planner.title': 'Mau ke mana berikutnya?',
    'planner.subtitle': 'Temukan liburan sempurna Anda',
    'planner.flights': 'Penerbangan',
    'planner.hotels': 'Hotel',
    'planner.experiences': 'Aktivitas',
    'planner.from_label': 'DARI',
    'planner.to_label': 'KE',
    'planner.dates_label': 'TANGGAL',
    'planner.travelers_label': 'WISATAWAN',
    'planner.choose_dest': 'Pilih Destinasi (Rekomendasi AI)',
    'planner.submit': 'Cari Penerbangan',

    // Trust Badges
    'badge.verified_dest': 'Presisi Musim',
    'badge.verified_sub': 'Skor objektif',
    'badge.weather_data': 'Data 30 Tahun',
    'badge.weather_sub': 'Open-Meteo',
    'badge.flex_plan': 'Rencana Fleksibel',
    'badge.flex_sub': 'Highlight nyata',
    'badge.ad_free': 'Bebas Sponsor',
    'badge.ad_free_sub': '100% Netral',

    // Stats Bar
    'stats.dest': 'Destinasi',
    'stats.dest_sub': 'Riset lapangan & satelit',
    'stats.climate': 'Rekam Jejak Iklim',
    'stats.climate_sub': 'Data historis ECMWF presisi',
    'stats.highlights': 'Titik Highlight Alam',
    'stats.highlights_sub': 'Musim & momen terbaik',
    'stats.rating': 'Rating Wisatawan',
    'stats.rating_sub': '100% netral & tanpa sponsor',

    // Popular Destinations
    'pop.title': 'Destinasi Populer',
    'pop.view_all': 'Lihat semua',

    // Best Month Section
    'best.rec_prefix': 'REKOMENDASI BULAN',
    'best.heading': 'Sedang bagus dikunjungi bulan ini',
    'best.subheading': 'Destinasi dengan rasio hari cerah tertinggi dan curah hujan terendah berdasarkan algoritma cuaca 30 tahun.',
    'best.score_label': 'Skor Kelayakan',
    'best.cta_detail': 'Lihat Detail Musim & Kalender →',
    'best.other_title': 'Pilihan Menarik Lainnya',
    'best.plan_route': 'Susun rute ke sini →',
    'best.guide_btn': 'Lihat Panduan Lengkap',
    'best.trend_title': 'Tren Musim 12 Bulan',

    // Ritme & Lanskap
    'mood.eyebrow': 'RITME & LANSKAP NUSANTARA',
    'mood.count_badge': '5 Karakter Alam',
    'mood.heading': 'Jelajah menurut suasana perjalanan',
    'mood.subheading': 'Setiap penjuru kepulauan memiliki denyut alam, keheningan, dan siklus iklim tersendiri. Pilih suasana yang selaras dengan jiwa dan tujuan perjalanan Anda.',
    'mood.all_btn': 'Semua Kategori Suasana',
    'mood.filter_label': 'Filter Cepat:',
    'mood.coast': 'Pesisir Tenang',
    'mood.highlands': 'Dataran Tinggi',
    'mood.culture': 'Warisan Budaya',
    'mood.indigenous': 'Komunitas Adat',
    'mood.marine': 'Konservasi Bahari',
    'mood.explore_btn': 'Jelajahi suasana ini',
    'mood.custom_badge': 'REKOMENDASI ADAPTIF',
    'mood.custom_title': 'Punya Suasana Impian Sendiri?',
    'mood.custom_desc': 'Padukan preferensi keheningan, curah hujan nol, dan durasi cuti Anda. Algoritma Singgah akan mencocokkan pulau yang paling pas.',
    'mood.custom_cta': 'Susun Rencana Sekarang',

    // Observatorium Iklim
    'climate.badge': 'OBSERVATORIUM IKLIM HISTORIS',
    'climate.heading': 'Kapan waktu terbaik, dihitung menurut data',
    'climate.desc': 'Dihitung dari data historis 30 tahun (1994–2023) Open-Meteo per bulan. Menampilkan curah hujan, hari basah, dan suhu untuk menentukan momen ideal tanpa bias sponsor.',
    'climate.cta': 'Baca Metodologi Sains',
    'climate.showing': 'Menampilkan:',
    'climate.current_month': 'Bulan Berjalan:',

    // Catatan Lapangan
    'notes.badge': 'CATATAN & ESAI',
    'notes.heading': 'Catatan lapangan penjelajah',
    'notes.desc': 'Tulisan narasi mengenai ritme alam, musim, dan pengamatan faktual di tanah Nusantara.',
    'notes.view_all': 'Baca semua catatan →',
    'notes.read_more': 'Baca selengkapnya',

    // Itinerari Cerdas
    'itinerary.badge': 'ITINERARI CERDAS',
    'itinerary.heading': 'Contoh susunan rencana nyata',
    'itinerary.desc': 'Dirancang dari titik highlight autentik dengan memperhitungkan jarak tempuh, waktu terbaik hari, dan ritme tubuh.',
    'itinerary.cta': 'Rancang Rencana Perjalananmu Sendiri',
    'itinerary.day1': 'Hari 01',
    'itinerary.day2': 'Hari 02',
    'itinerary.day3': 'Hari 03',

    // CTA Banner
    'cta_banner.badge': 'PERJALANAN PRESISI TANPA TEBAK-TEBAKAN',
    'cta_banner.heading': 'Waktu Anda berharga. Jangan pertaruhkan liburan pada musim yang salah.',
    'cta_banner.desc': 'Gunakan kurasi berbasis data iklim historis 30 tahun kami untuk merancang perjalanan yang berkesan di saat alam sedang paling bersahabat.',
    'cta_banner.btn1': 'Mulai Susun Rencana',
    'cta_banner.btn2': 'Konsultasi Rekomendasi',

    // Footer
    'footer.hero_badge': 'SINGGAH NUSANTARA',
    'footer.hero_title': 'Menjelajah di saat alam sedang paling ramah',
    'footer.hero_btn1': 'Lihat 6 Destinasi',
    'footer.hero_btn2': 'Mulai Rencana',
    'footer.tagline': 'Platform kurasi destinasi Nusantara berbasis analisis data iklim historis 30 tahun (1994–2023) dari Open-Meteo. Memberikan rekomendasi jujur, tanpa opini sponsor.',
    'footer.col_explore': 'Jelajah',
    'footer.col_plan': 'Rencana',
    'footer.col_transparency': 'Transparansi',
    'footer.link_destinations': 'Semua Destinasi',
    'footer.link_moods': 'Kategori Suasana',
    'footer.link_notes': 'Catatan Lapangan',
    'footer.link_quick': 'Rekomendasi Cepat',
    'footer.link_builder': 'Penyusun Rencana',
    'footer.link_my_plans': 'Rencana Saya',
    'footer.link_data': 'Metodologi & Rumus',
    'footer.link_credits': 'Kredit Fotografer',
    'footer.link_privacy': 'Kebijakan Privasi',
    'footer.copyright': 'Singgah. Dibuat dengan cinta untuk keindahan alam Nusantara.'
  },

  en: {
    // Header & Navigation
    'nav.destinasi': 'Destinations',
    'nav.suasana': 'Vibe & Mood',
    'nav.rencana': 'My Plans',
    'nav.catatan': 'Field Notes',
    'nav.data': 'Climate Data',
    'nav.masuk': 'Sign In',
    'nav.susun': 'Plan Trip',

    // Hero Section
    'hero.eyebrow': 'THE ARCHIPELAGO AWAITS',
    'hero.title': 'Adventures <br /> That Stay <br /> With You',
    'hero.desc': 'Discover the hidden wonders of the Indonesian archipelago, precisely timed with optimal seasons and lasting memories — curated from 30 years of climate data.',
    'hero.cta_explore': 'Explore Destinations',
    'hero.cta_notes': 'Field Notes',

    // Booking Card (All in English)
    'planner.title': 'Where to next?',
    'planner.subtitle': 'Find your perfect escape',
    'planner.flights': 'Flights',
    'planner.hotels': 'Hotels',
    'planner.experiences': 'Experiences',
    'planner.from_label': 'FROM',
    'planner.to_label': 'TO',
    'planner.dates_label': 'DATES',
    'planner.travelers_label': 'TRAVELERS',
    'planner.choose_dest': 'Choose Destination (AI Recommendation)',
    'planner.submit': 'Search Flights',

    // Trust Badges
    'badge.verified_dest': 'Optimal Seasons',
    'badge.verified_sub': 'Objective score',
    'badge.weather_data': '30-Year Climate Data',
    'badge.weather_sub': 'Open-Meteo ECMWF',
    'badge.flex_plan': 'Flexible Itineraries',
    'badge.flex_sub': 'Authentic highlights',
    'badge.ad_free': 'Zero Sponsorships',
    'badge.ad_free_sub': '100% Unbiased',

    // Stats Bar
    'stats.dest': 'Destinations',
    'stats.dest_sub': 'Field & satellite research',
    'stats.climate': 'Climate History',
    'stats.climate_sub': 'Precise 30-year ECMWF data',
    'stats.highlights': 'Nature Highlights',
    'stats.highlights_sub': 'Optimal seasons & moments',
    'stats.rating': 'Traveler Rating',
    'stats.rating_sub': '100% neutral & unbiased',

    // Popular Destinations
    'pop.title': 'Popular Destinations',
    'pop.view_all': 'View all',

    // Best Month Section
    'best.rec_prefix': 'RECOMMENDED IN',
    'best.heading': 'Prime to visit this month',
    'best.subheading': 'Destinations with the highest sunny-day ratio and lowest rainfall, computed from 30 years of meteorological records.',
    'best.score_label': 'Feasibility Score',
    'best.cta_detail': 'View Season Details & Calendar →',
    'best.other_title': 'Other Great Recommendations',
    'best.plan_route': 'Plan route here →',
    'best.guide_btn': 'View Complete Guide',
    'best.trend_title': '12-Month Season Trend',

    // Ritme & Lanskap
    'mood.eyebrow': 'ARCHIPELAGO RHYTHM & LANDSCAPES',
    'mood.count_badge': '5 Nature Moods',
    'mood.heading': 'Explore by journey rhythm & atmosphere',
    'mood.subheading': 'Every corner of the archipelago carries its own pulse of nature, tranquility, and seasonal cycles. Find the escape in harmony with your soul.',
    'mood.all_btn': 'All Mood Categories',
    'mood.filter_label': 'Quick Filter:',
    'mood.coast': 'Quiet Coast',
    'mood.highlands': 'Cool Highlands',
    'mood.culture': 'Cultural Heritage',
    'mood.indigenous': 'Indigenous Villages',
    'mood.marine': 'Marine Depths',
    'mood.explore_btn': 'Explore this mood',
    'mood.custom_badge': 'ADAPTIVE RECOMMENDATION',
    'mood.custom_title': 'Have a Specific Dream Escape?',
    'mood.custom_desc': 'Match your preferences for calm, zero rainfall, and holiday duration. Our algorithm will pinpoint your ideal island.',
    'mood.custom_cta': 'Plan Your Journey Now',

    // Observatorium Iklim
    'climate.badge': 'HISTORICAL CLIMATE OBSERVATORY',
    'climate.heading': 'When is the best time, calculated from data',
    'climate.desc': 'Computed from 30 years (1994–2023) of Open-Meteo monthly climate history. Visualizing rainfall, wet days, and temperature to identify ideal moments without sponsor bias.',
    'climate.cta': 'Read Scientific Methodology',
    'climate.showing': 'Showing:',
    'climate.current_month': 'Current Month:',

    // Catatan Lapangan
    'notes.badge': 'NOTES & ESSAYS',
    'notes.heading': 'Explorer field dispatches',
    'notes.desc': 'Narrative essays capturing nature rhythms, seasons, and factual field observations across Nusantara.',
    'notes.view_all': 'Read all field notes →',
    'notes.read_more': 'Read full story',

    // Itinerari Cerdas
    'itinerary.badge': 'SMART ITINERARIES',
    'itinerary.heading': 'Real-world curated itineraries',
    'itinerary.desc': 'Engineered from authentic highlights with transit times, optimal times of day, and natural biorhythms.',
    'itinerary.cta': 'Design Your Custom Itinerary',
    'itinerary.day1': 'Day 01',
    'itinerary.day2': 'Day 02',
    'itinerary.day3': 'Day 03',

    // CTA Banner
    'cta_banner.badge': 'PRECISION TRAVEL WITHOUT GUESSWORK',
    'cta_banner.heading': 'Your time is precious. Don\'t gamble your getaway on the wrong season.',
    'cta_banner.desc': 'Harness our 30-year climate analysis to craft meaningful escapes when Indonesian nature is at its friendliest.',
    'cta_banner.btn1': 'Start Planning',
    'cta_banner.btn2': 'Consult Recommendations',

    // Footer
    'footer.hero_badge': 'SINGGAH NUSANTARA',
    'footer.hero_title': 'Exploring when nature is at its friendliest',
    'footer.hero_btn1': 'Explore 6 Destinations',
    'footer.hero_btn2': 'Start Planning',
    'footer.tagline': 'Archipelago destination curation platform powered by 30-year historical climate analysis (1994–2023) from Open-Meteo. Honest recommendations, unbiased & sponsor-free.',
    'footer.col_explore': 'Explore',
    'footer.col_plan': 'Planning',
    'footer.col_transparency': 'Transparency',
    'footer.link_destinations': 'All Destinations',
    'footer.link_moods': 'Vibe Categories',
    'footer.link_notes': 'Field Notes',
    'footer.link_quick': 'Quick Suggestions',
    'footer.link_builder': 'Trip Planner',
    'footer.link_my_plans': 'My Saved Plans',
    'footer.link_data': 'Methodology & Science',
    'footer.link_credits': 'Photographer Credits',
    'footer.link_privacy': 'Privacy Policy',
    'footer.copyright': 'Singgah. Crafted with love for the natural beauty of the Archipelago.'
  }
};

const monthTranslationsEn: Record<string, string> = {
  Januari: 'January',
  Februari: 'February',
  Maret: 'March',
  April: 'April',
  Mei: 'May',
  Juni: 'June',
  Juli: 'July',
  Agustus: 'August',
  September: 'September',
  Oktober: 'October',
  November: 'November',
  Desember: 'December',
};

const monthTranslationsId: Record<string, string> = {
  January: 'Januari',
  February: 'Februari',
  March: 'Maret',
  April: 'April',
  May: 'Mei',
  June: 'Juni',
  July: 'Juli',
  August: 'Agustus',
  September: 'September',
  October: 'Oktober',
  November: 'November',
  December: 'Desember',
};

const durationTranslationsEn: Record<string, string> = {
  '2 Dewasa • Akhir Pekan': '2 Adults • Weekend',
  '2 Dewasa • 3 Hari': '2 Adults • 3 Days',
  '2 Dewasa • 4 Hari': '2 Adults • 4 Days',
  '2 Dewasa • 5 Hari': '2 Adults • 5 Days',
  '2 Dewasa • 7 Hari': '2 Adults • 7 Days',
  '2 Adults • Weekend': '2 Adults • Weekend',
  '2 Adults • 3 Hari': '2 Adults • 3 Days',
  '2 Adults • 4 Hari': '2 Adults • 4 Days',
  '2 Adults • 5 Hari': '2 Adults • 5 Days',
  '2 Adults • 7 Hari': '2 Adults • 7 Days',
};

const durationTranslationsId: Record<string, string> = {
  '2 Adults • Weekend': '2 Dewasa • Akhir Pekan',
  '2 Adults • 3 Days': '2 Dewasa • 3 Hari',
  '2 Adults • 4 Days': '2 Dewasa • 4 Hari',
  '2 Adults • 5 Days': '2 Dewasa • 5 Hari',
  '2 Adults • 7 Days': '2 Dewasa • 7 Hari',
  '2 Dewasa • Akhir Pekan': '2 Dewasa • Akhir Pekan',
  '2 Dewasa • 3 Hari': '2 Dewasa • 3 Hari',
  '2 Dewasa • 4 Hari': '2 Dewasa • 4 Hari',
  '2 Dewasa • 5 Hari': '2 Dewasa • 5 Hari',
  '2 Dewasa • 7 Hari': '2 Dewasa • 7 Hari',
};

export function getSavedLang(): SupportedLang {
  if (typeof window === 'undefined') return 'id';
  try {
    const saved = localStorage.getItem('singgah_lang');
    return saved === 'en' ? 'en' : 'id';
  } catch {
    return 'id';
  }
}

export function applyLanguage(lang: SupportedLang): void {
  if (typeof document === 'undefined') return;

  // 1. Simpan preferensi
  try {
    localStorage.setItem('singgah_lang', lang);
  } catch {}

  document.documentElement.lang = lang;

  // 2. Perbarui label tombol di header (ID atau EN)
  const langLabel = document.getElementById('header-lang-code') || document.getElementById('lang-current-label');
  if (langLabel) {
    langLabel.textContent = lang.toUpperCase();
  }

  // 3. Perbarui active checkmark pada dropdown menu
  document.querySelectorAll<HTMLElement>('.lang-select-item').forEach((item) => {
    const itemLang = item.getAttribute('data-lang');
    if (itemLang === lang) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // 4. Terjemahkan elemen-elemen data-i18n
  const dict = translations[lang];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) {
      // Simpan teks asli jika belum tersimpan
      if (!el.hasAttribute('data-i18n-original')) {
        el.setAttribute('data-i18n-original', el.textContent?.trim() || '');
      }
      if (dict[key].includes('<br') || dict[key].includes('<span')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 5. Terjemahkan nama bulan pada select opsi (DATES dropdown)
  const bulanSelect = document.getElementById('qp-hero-bulan') as HTMLSelectElement | null;
  if (bulanSelect) {
    Array.from(bulanSelect.options).forEach((opt) => {
      const original = opt.getAttribute('data-orig-text') || opt.text;
      if (!opt.hasAttribute('data-orig-text')) {
        opt.setAttribute('data-orig-text', original);
      }
      if (lang === 'en') {
        opt.text = monthTranslationsEn[original] || original;
      } else {
        opt.text = monthTranslationsId[original] || original;
      }
    });
  }

  // 6. Terjemahkan durasi pada select opsi (TRAVELERS dropdown)
  const lamaSelect = document.getElementById('qp-hero-lama') as HTMLSelectElement | null;
  if (lamaSelect) {
    Array.from(lamaSelect.options).forEach((opt) => {
      const original = opt.getAttribute('data-orig-text') || opt.text;
      if (!opt.hasAttribute('data-orig-text')) {
        opt.setAttribute('data-orig-text', original);
      }
      if (lang === 'en') {
        opt.text = durationTranslationsEn[original] || original;
      } else {
        opt.text = durationTranslationsId[original] || original;
      }
    });
  }

  // 7. Beritahu komponen lain lewat CustomEvent
  window.dispatchEvent(new CustomEvent('singgah:lang-changed', { detail: { lang } }));
}

export function initLanguageSwitcher(): void {
  if (typeof window === 'undefined') return;

  const toggleBtn = document.getElementById('lang-toggle-btn');
  const dropdownMenu = document.getElementById('lang-dropdown-menu');

  if (toggleBtn && dropdownMenu) {
    // Buka/tutup dropdown saat tombol diklik (icon chevron berbalik arah secara mulus)
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdownMenu.classList.contains('hidden');
      if (isHidden) {
        dropdownMenu.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.classList.add('is-open');
      } else {
        dropdownMenu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('is-open');
      }
    });

    // Pilihan bahasa diklik
    document.querySelectorAll<HTMLElement>('.lang-select-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selected = item.getAttribute('data-lang') as SupportedLang;
        if (selected) {
          applyLanguage(selected);
        }
        dropdownMenu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('is-open');
      });
    });

    // Tutup saat klik di luar
    document.addEventListener('click', (e) => {
      if (!dropdownMenu.contains(e.target as Node) && !toggleBtn.contains(e.target as Node)) {
        dropdownMenu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('is-open');
      }
    });

    // Tutup dengan tombol Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('is-open');
      }
    });
  }

  // Terapkan bahasa saat halaman dimuat
  const initialLang = getSavedLang();
  applyLanguage(initialLang);
}
