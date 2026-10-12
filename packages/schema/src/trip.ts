import { z } from 'zod';

export const TripItemKindSchema = z.enum(['tempat', 'makan', 'transit', 'catatan']);
export type TripItemKind = z.infer<typeof TripItemKindSchema>;

export const TripItemTimeOfDaySchema = z.enum(['pagi', 'siang', 'sore', 'malam']);
export type TripItemTimeOfDay = z.infer<typeof TripItemTimeOfDaySchema>;

export const TripItemSchema = z.object({
  id: z.string(),
  trip_id: z.string(),
  day_index: z.number().int().min(1),
  position: z.number().int().min(0),
  kind: TripItemKindSchema,
  title: z.string().min(1).max(120),
  highlight_id: z.string().nullable().optional(),
  time_of_day: TripItemTimeOfDaySchema.nullable().optional(),
  notes: z.string().max(400).nullable().optional(),
});
export type TripItem = z.infer<typeof TripItemSchema>;

export const TripSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string().min(1).max(80),
  destination: z.string(),
  start_month: z.number().int().min(1).max(12).nullable().optional(),
  days: z.number().int().min(1).max(21),
  share_slug: z.string().nullable().optional(),
  version: z.number().int().min(1).default(1),
  created_at: z.number().int(),
  updated_at: z.number().int(),
});
export type Trip = z.infer<typeof TripSchema>;

export const QuickPlanQuerySchema = z.object({
  destination: z.string().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  days: z.coerce.number().int().min(1).max(14).default(4),
  mood: z.string().optional(),
});
export type QuickPlanQuery = z.infer<typeof QuickPlanQuerySchema>;
