import { Hono } from 'hono';
import { apiError } from '../lib/errors.js';
import type { WeatherResponse, WeatherDailyForecast } from '@singgah/schema';

// Koordinat resmi 6 destinasi awal
const DESTINATION_COORDS: Record<string, { name: string; lat: number; lon: number }> = {
  'labuan-bajo': { name: 'Labuan Bajo', lat: -8.4964, lon: 119.8877 },
  bromo: { name: 'Bromo', lat: -7.9425, lon: 112.953 },
  'banda-neira': { name: 'Banda Neira', lat: -4.5256, lon: 129.9042 },
  yogyakarta: { name: 'Yogyakarta', lat: -7.7956, lon: 110.3695 },
  'danau-toba': { name: 'Danau Toba', lat: 2.6845, lon: 98.8756 },
  toraja: { name: 'Toraja', lat: -3.1042, lon: 119.8631 },
};

// Penerjemah kode WMO Open-Meteo ke Bahasa Indonesia lugas
export function interpretWmoCode(code: number): string {
  switch (code) {
    case 0:
      return 'Cerah';
    case 1:
      return 'Sebagian besar cerah';
    case 2:
      return 'Cerah berawan';
    case 3:
      return 'Berawan';
    case 45:
    case 48:
      return 'Berkabut';
    case 51:
    case 53:
    case 55:
      return 'Gerimis ringan';
    case 61:
      return 'Hujan ringan';
    case 63:
      return 'Hujan sedang';
    case 65:
      return 'Hujan lebat';
    case 80:
      return 'Hujan lokal ringan';
    case 81:
    case 82:
      return 'Hujan lokal deras';
    case 95:
      return 'Hujan disertai petir';
    case 96:
    case 99:
      return 'Badai guruh dan petir';
    default:
      return 'Berawan';
  }
}

// Singkatan hari bahasa Indonesia
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const weatherRoute = new Hono();

weatherRoute.get('/:slug', async (c) => {
  const slug = c.req.param('slug')?.toLowerCase();
  const dest = DESTINATION_COORDS[slug];

  if (!dest) {
    return apiError(
      c,
      404,
      'DESTINASI_TIDAK_DITEMUKAN',
      `Destinasi '${slug}' tidak terdaftar dalam pemantauan cuaca.`,
    );
  }

  // Cek Cloudflare Edge Cache API bila tersedia
  const cacheKey = new Request(c.req.url, c.req.raw);
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  if (cache) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    const openMeteoUrl = new URL('https://api.open-meteo.com/v1/forecast');
    openMeteoUrl.searchParams.set('latitude', dest.lat.toString());
    openMeteoUrl.searchParams.set('longitude', dest.lon.toString());
    openMeteoUrl.searchParams.set(
      'current',
      'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m',
    );
    openMeteoUrl.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    );
    openMeteoUrl.searchParams.set('timezone', 'auto');
    openMeteoUrl.searchParams.set('forecast_days', '7');

    const res = await fetch(openMeteoUrl.toString(), {
      headers: {
        'User-Agent': 'Singgah-TravelGuide/1.0 (non-commercial; +https://singgah.pages.dev)',
      },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo mengembalikan status ${res.status}`);
    }

    const data: any = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const forecast7d: WeatherDailyForecast[] = [];
    if (Array.isArray(daily.time)) {
      for (let i = 0; i < daily.time.length && i < 7; i++) {
        const dDate = new Date(daily.time[i]);
        const dayLabel = DAY_NAMES[dDate.getDay()] || 'Hari';
        forecast7d.push({
          date: daily.time[i],
          day_label: dayLabel,
          tmax_c: Math.round(daily.temperature_2m_max[i] ?? 30),
          tmin_c: Math.round(daily.temperature_2m_min[i] ?? 24),
          precipitation_probability: Math.round(daily.precipitation_probability_max[i] ?? 10),
          condition: interpretWmoCode(daily.weather_code[i] ?? 0),
        });
      }
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const payload: WeatherResponse = {
      destination_slug: slug,
      temperature_c: Math.round(current.temperature_2m ?? 28),
      feels_like_c: Math.round(current.apparent_temperature ?? 30),
      condition: interpretWmoCode(current.weather_code ?? 0),
      wind_kmh: Math.round(current.wind_speed_10m ?? 10),
      rain_probability: Math.round(forecast7d[0]?.precipitation_probability ?? 10),
      forecast_7d: forecast7d,
      attribution: 'Open-Meteo (CC BY 4.0)',
      updated_at: `${timeFormatted} WIB`,
    };

    const response = c.json(payload, 200, {
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    });

    // Simpan ke Cache API selama 30 menit jika di environment Workers
    if (cache) {
      c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  } catch (err: any) {
    console.error(`Gagal memuat cuaca untuk ${slug}:`, err);
    return apiError(
      c,
      503,
      'CUACA_TIDAK_TERSEDIA',
      'Data cuaca langsung belum dapat dimuat dari penyedia hulu.',
      {
        slug,
        bmkg_url: 'https://www.bmkg.go.id',
      },
    );
  }
});
