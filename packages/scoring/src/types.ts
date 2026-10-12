import type {
  DestinationProfile,
  SeasonLevel,
  MonthClimate,
  Destination,
  DestinationClimate,
} from '@singgah/schema';

export type { DestinationProfile, SeasonLevel, MonthClimate };

export interface MonthData {
  precip_mm: number;
  wet_days: number;
  tmax_c: number;
}

export interface ProfileWeights {
  rain: number;
  wet: number;
  temp: number;
}

export interface ProfileConfig {
  w: ProfileWeights;
  rain: { good: number; ok: number; bad: number };
  wet: { good: number; bad: number };
  temp: { lo: number; hi: number; tol: number };
}

export interface ScoredMonth {
  month: number;
  score: number;
  level: SeasonLevel;
  precip_mm: number;
  wet_days: number;
  tmax_c: number;
  is_override: boolean;
  override_reason?: string;
}

export interface PlannerSuggestion {
  destination: Destination;
  climate: DestinationClimate;
  selected_month: number;
  score: number;
  level: SeasonLevel;
  reason: string;
  recommended_days: number;
}
