import { z } from 'zod';

export const MonthClimateSchema = z.object({
  month: z.number().int().min(1).max(12),
  precip_mm: z.number().min(0),
  wet_days: z.number().min(0).max(31),
  tmax_c: z.number(),
  tmin_c: z.number().optional(),
});
export type MonthClimate = z.infer<typeof MonthClimateSchema>;

export const DestinationClimateSchema = z.object({
  slug: z.string(),
  source: z.string(),
  period: z.string(), // "1994-2023"
  fetched_at: z.string(),
  months: z.array(MonthClimateSchema).length(12),
});
export type DestinationClimate = z.infer<typeof DestinationClimateSchema>;
