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

export interface DailyOutlineItem {
  title: string;
  kind: string;
  time_of_day: string;
  note: string;
}

export interface DailyOutline {
  day_index: number;
  title: string;
  items: DailyOutlineItem[];
}

export interface PlannerSuggestion {
  slug: string;
  destination: Destination;
  climate: DestinationClimate;
  selected_month: number;
  score: number;
  level: SeasonLevel;
  reason: string;
  recommended_days: number;
  outline_days: DailyOutline[];
  closest_best_month?: {
    month: number;
    score: number;
    level: SeasonLevel;
  };
}
