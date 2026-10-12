import { z } from 'zod';

export const PhotoProviderSchema = z.enum(['unsplash', 'sendiri', 'wikimedia']);
export type PhotoProvider = z.infer<typeof PhotoProviderSchema>;

export const PhotoSchema = z.object({
  id: z.string().optional(),
  provider: PhotoProviderSchema,
  provider_id: z.string().optional(),
  url: z.string().url(),
  credit_name: z.string(),
  credit_url: z.string().url(),
  license: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  dominant_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  scrim: z.enum(['ringan', 'sedang', 'kuat']).default('sedang'),
  lqip: z.string().optional(),
  alt: z.string().min(20),
  place: z.string(),
  coords: z.object({ lat: z.number(), lon: z.number() }).optional(),
});
export type Photo = z.infer<typeof PhotoSchema>;
