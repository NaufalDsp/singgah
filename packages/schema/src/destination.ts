import { z } from 'zod';

export const HighlightKindSchema = z.enum(['alam', 'budaya', 'kuliner', 'aktivitas', 'transit']);
export type HighlightKind = z.infer<typeof HighlightKindSchema>;

export const HighlightDurationSchema = z.enum(['singkat', 'setengah-hari', 'sehari']);
export type HighlightDuration = z.infer<typeof HighlightDurationSchema>;

export const HighlightBestTimeSchema = z.enum(['pagi', 'siang', 'sore', 'bebas']);
export type HighlightBestTime = z.infer<typeof HighlightBestTimeSchema>;

export const HighlightSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  kind: HighlightKindSchema,
  area: z.string(),
  duration: HighlightDurationSchema,
  best_time: HighlightBestTimeSchema.default('bebas'),
  note: z.string().max(240),
  coords: z.object({ lat: z.number(), lon: z.number() }).optional(),
});
export type Highlight = z.infer<typeof HighlightSchema>;

export const DestinationProfileSchema = z.enum(['pantai', 'gunung', 'kota', 'selam', 'budaya']);
export type DestinationProfile = z.infer<typeof DestinationProfileSchema>;

export const SeasonLevelSchema = z.enum(['kurang', 'cukup', 'baik', 'sangat-baik']);
export type SeasonLevel = z.infer<typeof SeasonLevelSchema>;

export const SeasonOverrideSchema = z.object({
  month: z.number().int().min(1).max(12),
  level: SeasonLevelSchema,
  reason: z.string(),
});
export type SeasonOverride = z.infer<typeof SeasonOverrideSchema>;

export const SeasonNoteSchema = z.object({
  months: z.array(z.number().int().min(1).max(12)),
  note: z.string().max(200),
  sources: z.array(z.string().url()).optional(),
});
export type SeasonNote = z.infer<typeof SeasonNoteSchema>;

export const DestinationSchema = z.object({
  name: z.string(),
  region: z.object({
    island: z.string(),
    province: z.string(),
  }),
  timezone: z.enum(['WIB', 'WITA', 'WIT']),
  coords: z.object({ lat: z.number(), lon: z.number() }),
  profile: DestinationProfileSchema,
  moods: z.array(z.string()).min(1),
  summary: z.string().max(160),
  hero: z.object({
    photo: z.string(),
    focal: z.object({ x: z.number(), y: z.number() }),
  }),
  typical_days: z.object({
    min: z.number().int(),
    max: z.number().int(),
  }),
  getting_there: z.object({
    notes: z.string(),
    sources: z.array(z.string().url()).min(1),
  }),
  highlights: z.array(HighlightSchema).min(4),
  season_notes: z.array(SeasonNoteSchema).default([]),
  season_overrides: z.array(SeasonOverrideSchema).default([]),
  verified_at: z.string(),
  updated_at: z.string(),
});
export type Destination = z.infer<typeof DestinationSchema>;
