import type {
  MonthData,
  ProfileConfig,
  SeasonLevel,
  ScoredMonth,
  DestinationProfile,
} from './types.js';
import { PROFILES } from './profiles.js';
import type { MonthClimate, SeasonOverride } from '@singgah/schema';

export const lerp = (v: number, a: number, b: number, from: number, to: number): number => {
  if (v <= a) return from;
  if (v >= b) return to;
  return from + ((v - a) / (b - a)) * (to - from);
};

export function score(m: MonthData, p: ProfileConfig): number {
  const rain =
    m.precip_mm <= p.rain.good
      ? 1
      : m.precip_mm <= p.rain.ok
        ? lerp(m.precip_mm, p.rain.good, p.rain.ok, 1, 0.5)
        : lerp(m.precip_mm, p.rain.ok, p.rain.bad, 0.5, 0);

  const wet = lerp(m.wet_days, p.wet.good, p.wet.bad, 1, 0);

  const temp =
    m.tmax_c >= p.temp.lo && m.tmax_c <= p.temp.hi
      ? 1
      : Math.max(
          0,
          1 - Math.min(Math.abs(m.tmax_c - p.temp.lo), Math.abs(m.tmax_c - p.temp.hi)) / p.temp.tol,
        );

  const raw = p.w.rain * rain + p.w.wet * wet + p.w.temp * temp;
  return Math.max(0, Math.min(1, Math.round(raw * 1000) / 1000));
}

export function level(s: number): SeasonLevel {
  if (s >= 0.75) return 'sangat-baik';
  if (s >= 0.55) return 'baik';
  if (s >= 0.35) return 'cukup';
  return 'kurang';
}

export function calculateYearSeasons(
  months: MonthClimate[],
  profile: DestinationProfile,
  overrides: SeasonOverride[] = [],
): ScoredMonth[] {
  const config = PROFILES[profile] ?? PROFILES.pantai;
  const overrideMap = new Map<number, SeasonOverride>();
  for (const o of overrides) {
    overrideMap.set(o.month, o);
  }

  return months.map((m) => {
    const rawScore = score(m, config);
    const ov = overrideMap.get(m.month);

    if (ov) {
      return {
        month: m.month,
        score: rawScore,
        level: ov.level,
        precip_mm: m.precip_mm,
        wet_days: m.wet_days,
        tmax_c: m.tmax_c,
        is_override: true,
        override_reason: ov.reason,
      };
    }

    return {
      month: m.month,
      score: rawScore,
      level: level(rawScore),
      precip_mm: m.precip_mm,
      wet_days: m.wet_days,
      tmax_c: m.tmax_c,
      is_override: false,
    };
  });
}
