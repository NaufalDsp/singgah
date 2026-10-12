import { describe, it, expect } from 'vitest';
import { suggestDestinations, buildDailyOutline, generateSeasonReason } from './planner.js';
import type { Destination, DestinationClimate } from '@singgah/schema';

// Mock destinations & climates
const mockDestinations: Array<{ slug: string; data: Destination }> = [
  {
    slug: 'labuan-bajo',
    data: {
      name: 'Labuan Bajo',
      region: { island: 'Flores', province: 'Nusa Tenggara Timur' },
      timezone: 'WITA',
      coords: { lat: -8.4964, lon: 119.8877 },
      profile: 'pantai',
      moods: ['pantai-sepi', 'laut-dalam'],
      summary: 'Kepulauan savana dan laut Komodo.',
      hero: { photo: 'https://example.com/photo.jpg', focal: { x: 50, y: 50 } },
      typical_days: { min: 3, max: 5 },
      getting_there: { notes: 'Pesawat ke Bandara Komodo.', sources: ['https://example.com'] },
      highlights: [
        {
          id: 'h1',
          name: 'Pulau Padar',
          kind: 'alam',
          area: 'Komodo',
          duration: 'setengah-hari',
          best_time: 'pagi',
          note: 'Trekking.',
        },
        {
          id: 'h2',
          name: 'Pink Beach',
          kind: 'alam',
          area: 'Komodo',
          duration: 'singkat',
          best_time: 'siang',
          note: 'Pantai.',
        },
        {
          id: 'h3',
          name: 'Manta Point',
          kind: 'aktivitas',
          area: 'Selat',
          duration: 'setengah-hari',
          best_time: 'siang',
          note: 'Snorkeling.',
        },
        {
          id: 'h4',
          name: 'Kampung Ujung',
          kind: 'kuliner',
          area: 'Kota',
          duration: 'singkat',
          best_time: 'malam',
          note: 'Ikan bakar.',
        },
      ],
      season_notes: [],
      season_overrides: [{ month: 1, level: 'kurang', reason: 'Gelombang tinggi Selat Sape.' }],
      verified_at: '2026-10-12',
      updated_at: '2026-10-12',
    },
  },
  {
    slug: 'bromo',
    data: {
      name: 'Bromo',
      region: { island: 'Jawa', province: 'Jawa Timur' },
      timezone: 'WIB',
      coords: { lat: -7.9425, lon: 112.953 },
      profile: 'gunung',
      moods: ['gunung-kabut'],
      summary: 'Kaldera vulkanik Tengger.',
      hero: { photo: 'https://example.com/bromo.jpg', focal: { x: 50, y: 50 } },
      typical_days: { min: 2, max: 3 },
      getting_there: { notes: 'Jip dari Probolinggo.', sources: ['https://example.com'] },
      highlights: [
        {
          id: 'b1',
          name: 'Penanjakan 1',
          kind: 'alam',
          area: 'Tengger Atas',
          duration: 'singkat',
          best_time: 'pagi',
          note: 'Matahari terbit.',
        },
        {
          id: 'b2',
          name: 'Kawah Bromo',
          kind: 'alam',
          area: 'Kaldera',
          duration: 'setengah-hari',
          best_time: 'pagi',
          note: 'Kawah.',
        },
        {
          id: 'b3',
          name: 'Pasir Berbisik',
          kind: 'alam',
          area: 'Segara Wedi',
          duration: 'singkat',
          best_time: 'siang',
          note: 'Lautan pasir.',
        },
        {
          id: 'b4',
          name: 'Desa Ngadisari',
          kind: 'budaya',
          area: 'Ngadisari',
          duration: 'setengah-hari',
          best_time: 'sore',
          note: 'Suku Tengger.',
        },
      ],
      season_notes: [],
      season_overrides: [],
      verified_at: '2026-10-12',
      updated_at: '2026-10-12',
    },
  },
  {
    slug: 'banda-neira',
    data: {
      name: 'Banda Neira',
      region: { island: 'Kepulauan Banda', province: 'Maluku' },
      timezone: 'WIT',
      coords: { lat: -4.5256, lon: 129.9042 },
      profile: 'selam',
      moods: ['laut-dalam', 'desa-upacara'],
      summary: 'Kepulauan rempah pala.',
      hero: { photo: 'https://example.com/banda.jpg', focal: { x: 50, y: 50 } },
      typical_days: { min: 5, max: 8 },
      getting_there: { notes: 'Kapal Pelni dari Ambon.', sources: ['https://example.com'] },
      highlights: [
        {
          id: 'bn1',
          name: 'Benteng Belgica',
          kind: 'budaya',
          area: 'Neira',
          duration: 'singkat',
          best_time: 'sore',
          note: 'Benteng VOC.',
        },
        {
          id: 'bn2',
          name: 'Lava Flow',
          kind: 'aktivitas',
          area: 'Gunung Api',
          duration: 'setengah-hari',
          best_time: 'pagi',
          note: 'Karang lava.',
        },
        {
          id: 'bn3',
          name: 'Pulau Hatta',
          kind: 'aktivitas',
          area: 'Pulau Hatta',
          duration: 'sehari',
          best_time: 'pagi',
          note: 'Palung laut.',
        },
        {
          id: 'bn4',
          name: 'Kebun Pala',
          kind: 'budaya',
          area: 'Banda Besar',
          duration: 'setengah-hari',
          best_time: 'pagi',
          note: 'Pohon pala.',
        },
      ],
      season_notes: [],
      season_overrides: [{ month: 6, level: 'kurang', reason: 'Gelombang tinggi angin timur.' }],
      verified_at: '2026-10-12',
      updated_at: '2026-10-12',
    },
  },
];

const mockClimates: Record<string, DestinationClimate> = {
  'labuan-bajo': {
    slug: 'labuan-bajo',
    source: 'Open-Meteo',
    period: '1994-2023',
    fetched_at: '2026-10-12',
    months: [
      { month: 1, precip_mm: 240, wet_days: 18, tmax_c: 30.5 },
      { month: 2, precip_mm: 220, wet_days: 16, tmax_c: 30.2 },
      { month: 3, precip_mm: 180, wet_days: 14, tmax_c: 30.8 },
      { month: 4, precip_mm: 95, wet_days: 8, tmax_c: 31.2 },
      { month: 5, precip_mm: 55, wet_days: 5, tmax_c: 31.0 },
      { month: 6, precip_mm: 35, wet_days: 4, tmax_c: 30.5 },
      { month: 7, precip_mm: 25, wet_days: 3, tmax_c: 30.1 },
      { month: 8, precip_mm: 20, wet_days: 2, tmax_c: 30.4 },
      { month: 9, precip_mm: 30, wet_days: 3, tmax_c: 31.5 },
      { month: 10, precip_mm: 65, wet_days: 6, tmax_c: 32.2 },
      { month: 11, precip_mm: 130, wet_days: 11, tmax_c: 32.0 },
      { month: 12, precip_mm: 210, wet_days: 16, tmax_c: 31.0 },
    ],
  },
  bromo: {
    slug: 'bromo',
    source: 'Open-Meteo',
    period: '1994-2023',
    fetched_at: '2026-10-12',
    months: [
      { month: 1, precip_mm: 290, wet_days: 21, tmax_c: 19.5 },
      { month: 2, precip_mm: 275, wet_days: 20, tmax_c: 19.8 },
      { month: 3, precip_mm: 250, wet_days: 18, tmax_c: 20.2 },
      { month: 4, precip_mm: 140, wet_days: 12, tmax_c: 20.5 },
      { month: 5, precip_mm: 70, wet_days: 6, tmax_c: 20.8 },
      { month: 6, precip_mm: 35, wet_days: 3, tmax_c: 20.2 },
      { month: 7, precip_mm: 20, wet_days: 2, tmax_c: 19.5 },
      { month: 8, precip_mm: 15, wet_days: 2, tmax_c: 20.1 },
      { month: 9, precip_mm: 25, wet_days: 3, tmax_c: 21.4 },
      { month: 10, precip_mm: 60, wet_days: 6, tmax_c: 22.0 },
      { month: 11, precip_mm: 160, wet_days: 13, tmax_c: 21.2 },
      { month: 12, precip_mm: 260, wet_days: 19, tmax_c: 20.1 },
    ],
  },
  'banda-neira': {
    slug: 'banda-neira',
    source: 'Open-Meteo',
    period: '1994-2023',
    fetched_at: '2026-10-12',
    months: [
      { month: 1, precip_mm: 180, wet_days: 13, tmax_c: 30.5 },
      { month: 2, precip_mm: 160, wet_days: 12, tmax_c: 30.8 },
      { month: 3, precip_mm: 130, wet_days: 10, tmax_c: 31.2 },
      { month: 4, precip_mm: 110, wet_days: 8, tmax_c: 31.5 },
      { month: 5, precip_mm: 270, wet_days: 17, tmax_c: 30.2 },
      { month: 6, precip_mm: 320, wet_days: 20, tmax_c: 29.5 },
      { month: 7, precip_mm: 290, wet_days: 19, tmax_c: 29.2 },
      { month: 8, precip_mm: 190, wet_days: 14, tmax_c: 29.8 },
      { month: 9, precip_mm: 80, wet_days: 6, tmax_c: 30.9 },
      { month: 10, precip_mm: 60, wet_days: 5, tmax_c: 31.6 },
      { month: 11, precip_mm: 75, wet_days: 6, tmax_c: 31.8 },
      { month: 12, precip_mm: 150, wet_days: 11, tmax_c: 31.0 },
    ],
  },
};

describe('Planner Suggestion Engine (20 Kasus Uji)', () => {
  // Kasus 1-12: Setiap bulan 1 sampai 12
  for (let m = 1; m <= 12; m++) {
    it(`Kasus ${m}: Berfungsi deterministik untuk bulan ${m}`, () => {
      const res1 = suggestDestinations({
        destinations: mockDestinations,
        climates: mockClimates,
        month: m,
        days: 4,
      });
      const res2 = suggestDestinations({
        destinations: mockDestinations,
        climates: mockClimates,
        month: m,
        days: 4,
      });

      expect(res1.length).toBe(3);
      expect(res1[0].slug).toBe(res2[0].slug);
      expect(res1[0].score).toBe(res2[0].score);
    });
  }

  // Kasus 13: Batas minimum 1 hari
  it('Kasus 13: Menangani durasi batas bawah 1 hari', () => {
    const res = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      days: 1,
      month: 8,
    });
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].outline_days.length).toBe(1);
  });

  // Kasus 14: Batas maksimum 14 hari
  it('Kasus 14: Menangani durasi batas atas 14 hari', () => {
    const res = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      days: 14,
      month: 8,
    });
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].outline_days.length).toBe(14);
  });

  // Kasus 15: Filter suasana spesifik (pantai-sepi)
  it('Kasus 15: Memfilter suasana pantai-sepi dengan benar', () => {
    const res = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      mood: 'pantai-sepi',
      month: 8,
    });
    expect(res.every((r) => r.destination.moods.includes('pantai-sepi'))).toBe(true);
  });

  // Kasus 16: Filter suasana gunung-kabut
  it('Kasus 16: Memfilter suasana gunung-kabut dengan benar', () => {
    const res = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      mood: 'gunung-kabut',
      month: 8,
    });
    expect(res.length).toBe(1);
    expect(res[0].slug).toBe('bromo');
  });

  // Kasus 17: Filter destinasi spesifik
  it('Kasus 17: Memfilter destinasi spesifik (Banda Neira)', () => {
    const res = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      destinationSlug: 'banda-neira',
      month: 10,
    });
    expect(res.length).toBe(1);
    expect(res[0].slug).toBe('banda-neira');
  });

  // Kasus 18: Bulan terburuk (anomali gelombang/hujan di bulan 6 untuk Banda Neira)
  it('Kasus 18: Menghormati override cuaca buruk pada bulan Juni di Banda Neira', () => {
    const res = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      destinationSlug: 'banda-neira',
      month: 6,
    });
    expect(res[0].level).toBe('kurang');
    expect(res[0].reason).toContain('Gelombang tinggi');
    expect(res[0].closest_best_month).toBeDefined();
  });

  // Kasus 19: Durasi di luar batas ideal mendapat penalti multiplier
  it('Kasus 19: Memberikan penyesuaian bobot durasi bila melebihi typical_days', () => {
    const idealRes = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      destinationSlug: 'bromo',
      month: 8,
      days: 3, // Bromo typical: 2-3
    });

    const nonIdealRes = suggestDestinations({
      destinations: mockDestinations,
      climates: mockClimates,
      destinationSlug: 'bromo',
      month: 8,
      days: 10, // di luar typical
    });

    expect(idealRes[0].score).toBeGreaterThan(nonIdealRes[0].score);
  });

  // Kasus 20: Monotonik dan rentang skor selalu 0 <= score <= 1
  it('Kasus 20: Seluruh skor perencana berada dalam rentang valid [0, 1]', () => {
    for (let m = 1; m <= 12; m++) {
      const res = suggestDestinations({
        destinations: mockDestinations,
        climates: mockClimates,
        month: m,
        days: 4,
      });
      for (const item of res) {
        expect(item.score).toBeGreaterThanOrEqual(0);
        expect(item.score).toBeLessThanOrEqual(1);
      }
    }
  });
});
