import { describe, it, expect } from 'vitest';
import { score, level, lerp, calculateYearSeasons } from './season.js';
import { PROFILES } from './profiles.js';
import type { MonthClimate, SeasonOverride } from '@singgah/schema';

describe('lerp function', () => {
  it('interpolates correctly within range', () => {
    expect(lerp(50, 0, 100, 0, 1)).toBe(0.5);
    expect(lerp(10, 0, 100, 1, 0)).toBe(0.9);
  });

  it('clamps at borders', () => {
    expect(lerp(-10, 0, 100, 0, 1)).toBe(0);
    expect(lerp(150, 0, 100, 0, 1)).toBe(1);
  });
});

describe('score and level calculation', () => {
  it('gives near perfect score for dry and optimal weather on pantai profile', () => {
    const perfectMonth = { precip_mm: 40, wet_days: 3, tmax_c: 30 };
    const s = score(perfectMonth, PROFILES.pantai);
    expect(s).toBeGreaterThanOrEqual(0.9);
    expect(level(s)).toBe('sangat-baik');
  });

  it('gives poor score for stormy monsoon weather', () => {
    const monsoonMonth = { precip_mm: 320, wet_days: 24, tmax_c: 29 };
    const s = score(monsoonMonth, PROFILES.pantai);
    expect(s).toBeLessThan(0.35);
    expect(level(s)).toBe('kurang');
  });

  it('always keeps score bounded in [0, 1]', () => {
    const extremeCases = [
      { precip_mm: 0, wet_days: 0, tmax_c: 30 },
      { precip_mm: 2000, wet_days: 31, tmax_c: 10 },
      { precip_mm: 120, wet_days: 10, tmax_c: 35 },
    ];
    for (const c of extremeCases) {
      const s = score(c, PROFILES.pantai);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
  });

  it('honors manual season_overrides correctly', () => {
    const mockMonths: MonthClimate[] = [
      { month: 1, precip_mm: 30, wet_days: 2, tmax_c: 29 }, // mathematically "sangat-baik"
    ];
    const overrides: SeasonOverride[] = [
      {
        month: 1,
        level: 'kurang',
        reason: 'Musim angin barat gelombang tinggi tidak aman untuk penyeberangan',
      },
    ];

    const result = calculateYearSeasons(mockMonths, 'pantai', overrides);
    expect(result[0].level).toBe('kurang');
    expect(result[0].is_override).toBe(true);
    expect(result[0].override_reason).toContain('Musim angin barat');
  });
});
