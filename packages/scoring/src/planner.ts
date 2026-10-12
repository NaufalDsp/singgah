import type { Destination, DestinationClimate } from '@singgah/schema';
import type { PlannerSuggestion } from './types.js';
import { calculateYearSeasons } from './season.js';

export interface PlannerInput {
  destinations: Destination[];
  climates: Record<string, DestinationClimate>;
  month?: number;
  days?: number;
  mood?: string;
  destinationSlug?: string;
}

export function generateSeasonReason(
  precip_mm: number,
  wet_days: number,
  minDays: number,
  maxDays: number,
  overrideReason?: string,
): string {
  if (overrideReason) {
    return `${overrideReason}. Waktu ideal ${minDays} sampai ${maxDays} hari.`;
  }

  let dryness = 'Cukup cerah';
  if (wet_days <= 5 && precip_mm <= 80) {
    dryness = 'Kering dan minim hujan';
  } else if (wet_days <= 10) {
    dryness = 'Cuaca bersahabat';
  } else if (wet_days >= 18 || precip_mm >= 250) {
    dryness = 'Curah hujan tinggi';
  }

  return `${dryness}, rata-rata ${Math.round(wet_days)} hari hujan (${Math.round(precip_mm)} mm). Ideal untuk ${minDays}–${maxDays} hari.`;
}

export function suggestDestinations(input: PlannerInput): PlannerSuggestion[] {
  const currentMonth = input.month ?? new Date().getMonth() + 1;
  const targetDays = input.days ?? 4;

  const suggestions: PlannerSuggestion[] = [];

  for (const dest of input.destinations) {
    // If specific destination is requested, filter
    // Note: dest doesn't have slug directly in schema, usually filename or we compare name
    const climate = input.climates[dest.name.toLowerCase().replace(/\s+/g, '-')];
    if (!climate) continue;

    // Mood filtering if specified
    if (input.mood && input.mood !== 'Apa saja' && !dest.moods.includes(input.mood)) {
      continue;
    }

    const scoredMonths = calculateYearSeasons(climate.months, dest.profile, dest.season_overrides);

    const targetScored = scoredMonths.find((sm) => sm.month === currentMonth);
    if (!targetScored) continue;

    // Duration suitability adjustment
    const daysWithinIdeal =
      targetDays >= dest.typical_days.min && targetDays <= dest.typical_days.max;
    const durationMultiplier = daysWithinIdeal ? 1.0 : 0.85;

    const finalScore = targetScored.score * durationMultiplier;

    const reason = generateSeasonReason(
      targetScored.precip_mm,
      targetScored.wet_days,
      dest.typical_days.min,
      dest.typical_days.max,
      targetScored.override_reason,
    );

    suggestions.push({
      destination: dest,
      climate,
      selected_month: currentMonth,
      score: Math.round(finalScore * 1000) / 1000,
      level: targetScored.level,
      reason,
      recommended_days: Math.min(
        Math.max(targetDays, dest.typical_days.min),
        dest.typical_days.max,
      ),
    });
  }

  // Sort descending by score
  return suggestions.sort((a, b) => b.score - a.score);
}
