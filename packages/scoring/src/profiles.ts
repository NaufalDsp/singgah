import type { DestinationProfile, ProfileConfig } from './types.js';

export const PROFILES: Record<DestinationProfile, ProfileConfig> = {
  pantai: {
    w: { rain: 0.5, wet: 0.35, temp: 0.15 },
    rain: { good: 80, ok: 160, bad: 260 },
    wet: { good: 5, bad: 18 },
    temp: { lo: 27, hi: 32, tol: 5 },
  },
  gunung: {
    w: { rain: 0.45, wet: 0.4, temp: 0.15 },
    rain: { good: 60, ok: 130, bad: 230 },
    wet: { good: 5, bad: 16 },
    temp: { lo: 16, hi: 24, tol: 7 },
  },
  kota: {
    w: { rain: 0.35, wet: 0.35, temp: 0.3 },
    rain: { good: 100, ok: 180, bad: 300 },
    wet: { good: 6, bad: 19 },
    temp: { lo: 24, hi: 32, tol: 6 },
  },
  budaya: {
    w: { rain: 0.35, wet: 0.35, temp: 0.3 },
    rain: { good: 100, ok: 180, bad: 300 },
    wet: { good: 6, bad: 19 },
    temp: { lo: 24, hi: 32, tol: 6 },
  },
  selam: {
    w: { rain: 0.4, wet: 0.25, temp: 0.1 },
    rain: { good: 70, ok: 150, bad: 250 },
    wet: { good: 5, bad: 16 },
    temp: { lo: 27, hi: 32, tol: 4 },
  },
};
