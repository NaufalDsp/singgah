import { defineCollection, z } from 'astro:content';
import { DestinationSchema, PhotoSchema } from '@singgah/schema';

const destinations = defineCollection({
  schema: DestinationSchema,
});

const photos = defineCollection({
  type: 'data',
  schema: PhotoSchema,
});

const moods = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    photo: z.string(),
  }),
});

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    reading_time_min: z.number().int(),
    destination_slug: z.string().optional(),
    published_at: z.string().date(),
    photo: z.string(),
  }),
});

export const collections = {
  destinations,
  photos,
  moods,
  articles,
};
