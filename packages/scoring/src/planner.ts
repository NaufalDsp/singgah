import type { Destination, DestinationClimate } from '@singgah/schema';
import type { PlannerSuggestion, DailyOutline } from './types.js';
import { calculateYearSeasons } from './season.js';

export interface DestinationWithSlug {
  slug: string;
  data: Destination;
}

export interface PlannerInput {
  destinations: DestinationWithSlug[] | Destination[];
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
    dryness = 'Curah hujan relatif tinggi';
  }

  return `${dryness}, rata-rata ${Math.round(wet_days)} hari hujan (${Math.round(precip_mm)} mm). Ideal untuk ${minDays}–${maxDays} hari.`;
}

export function buildDailyOutline(
  highlights: Destination['highlights'],
  targetDays: number,
  destinationName: string,
): DailyOutline[] {
  const days: DailyOutline[] = [];
  const daysCount = Math.max(1, Math.min(targetDays, 14));

  // Kelompokkan highlight per area untuk menekan perpindahan
  const areaGroups = new Map<string, typeof highlights>();
  for (const h of highlights) {
    const list = areaGroups.get(h.area) || [];
    list.push(h);
    areaGroups.set(h.area, list);
  }

  const flattenedHighlights = Array.from(areaGroups.values()).flat();

  for (let i = 1; i <= daysCount; i++) {
    const dayItems = [];
    if (i === 1) {
      dayItems.push({
        title: `Tiba & adaptasi di ${destinationName}`,
        kind: 'transit',
        time_of_day: 'pagi',
        note: 'Penyelesaian administrasi kedatangan dan persiapan logistik harian.',
      });
    }

    // Ambil 1-2 highlight untuk hari ini
    const h1 = flattenedHighlights[(i - 1) % flattenedHighlights.length];
    if (h1 && i > 1) {
      dayItems.push({
        title: h1.name,
        kind: h1.kind,
        time_of_day: h1.best_time === 'bebas' ? 'pagi' : h1.best_time,
        note: h1.note,
      });
    }

    const h2 = flattenedHighlights[(i * 2 - 1) % flattenedHighlights.length];
    if (h2 && h2.id !== h1?.id) {
      dayItems.push({
        title: h2.name,
        kind: h2.kind,
        time_of_day: h2.best_time === 'bebas' ? 'siang' : h2.best_time,
        note: h2.note,
      });
    }

    days.push({
      day_index: i,
      title: `Hari ${i}`,
      items: dayItems,
    });
  }

  return days;
}

export function suggestDestinations(input: PlannerInput): PlannerSuggestion[] {
  const currentMonth = input.month
    ? Math.min(Math.max(input.month, 1), 12)
    : new Date().getMonth() + 1;
  const targetDays = input.days ? Math.min(Math.max(input.days, 1), 14) : 4;

  const suggestions: PlannerSuggestion[] = [];

  for (const item of input.destinations) {
    const dest: Destination = 'data' in item ? item.data : item;
    const slug: string = 'slug' in item ? item.slug : dest.name.toLowerCase().replace(/\s+/g, '-');

    if (input.destinationSlug && input.destinationSlug !== slug) {
      continue;
    }

    const climate = input.climates[slug];
    if (!climate) continue;

    // Filter suasana jika diminta
    if (
      input.mood &&
      input.mood !== 'apa-saja' &&
      input.mood !== 'Apa saja' &&
      !dest.moods.includes(input.mood)
    ) {
      continue;
    }

    const scoredMonths = calculateYearSeasons(climate.months, dest.profile, dest.season_overrides);
    const targetScored = scoredMonths.find((sm) => sm.month === currentMonth);
    if (!targetScored) continue;

    // Penyesuaian skor terhadap lama hari ideal destinasi
    const daysWithinIdeal =
      targetDays >= dest.typical_days.min && targetDays <= dest.typical_days.max;
    const durationMultiplier = daysWithinIdeal ? 1.0 : 0.85;
    const finalScore = targetScored.score * durationMultiplier;

    // Cari bulan terbaik terdekat bila bulan ini berstatus kurang/cukup
    let closestBestMonth: PlannerSuggestion['closest_best_month'] = undefined;
    if (targetScored.level === 'kurang' || targetScored.level === 'cukup') {
      const bestCandidate = [...scoredMonths].sort((a, b) => b.score - a.score)[0];
      if (bestCandidate && bestCandidate.score > targetScored.score) {
        closestBestMonth = {
          month: bestCandidate.month,
          score: bestCandidate.score,
          level: bestCandidate.level,
        };
      }
    }

    const reason = generateSeasonReason(
      targetScored.precip_mm,
      targetScored.wet_days,
      dest.typical_days.min,
      dest.typical_days.max,
      targetScored.override_reason,
    );

    const outline = buildDailyOutline(dest.highlights, targetDays, dest.name);

    suggestions.push({
      slug,
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
      outline_days: outline,
      closest_best_month: closestBestMonth,
    });
  }

  // Sort descending berdasarkan skor
  return suggestions.sort((a, b) => b.score - a.score);
}
