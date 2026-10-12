import { Hono } from 'hono';
import { z } from 'zod';
import { suggestDestinations } from '@singgah/scoring';
import { EMBEDDED_DESTINATIONS, EMBEDDED_CLIMATES } from '../data/static-destinations.js';
import { apiError } from '../lib/errors.js';

const PlannerSuggestRequestSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  days: z.coerce.number().int().min(1).max(14).default(4),
  mood: z.string().optional(),
  destination: z.string().optional(),
});

export const plannerRoute = new Hono();

// POST /api/v1/planner/suggest
plannerRoute.post('/suggest', async (c) => {
  let body: any = {};
  try {
    body = await c.req.json();
  } catch {
    body = {};
  }

  const parsed = PlannerSuggestRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(c, 400, 'PERMINTAAN_TIDAK_VALID', 'Format data perencana tidak sesuai.', {
      errors: parsed.error.flatten(),
    });
  }

  const { month, days, mood, destination } = parsed.data;

  const suggestions = suggestDestinations({
    destinations: EMBEDDED_DESTINATIONS,
    climates: EMBEDDED_CLIMATES,
    month,
    days,
    mood,
    destinationSlug: destination,
  });

  return c.json({
    query: {
      month: month ?? new Date().getMonth() + 1,
      days,
      mood: mood ?? 'apa-saja',
      destination: destination ?? null,
    },
    total: suggestions.length,
    suggestions,
  });
});

// GET /api/v1/planner/suggest (alternatif query params)
plannerRoute.get('/suggest', async (c) => {
  const query = c.req.query();
  const parsed = PlannerSuggestRequestSchema.safeParse(query);

  if (!parsed.success) {
    return apiError(c, 400, 'PARAMETER_TIDAK_VALID', 'Parameter pencarian rencana tidak sesuai.', {
      errors: parsed.error.flatten(),
    });
  }

  const { month, days, mood, destination } = parsed.data;

  const suggestions = suggestDestinations({
    destinations: EMBEDDED_DESTINATIONS,
    climates: EMBEDDED_CLIMATES,
    month,
    days,
    mood,
    destinationSlug: destination,
  });

  return c.json({
    query: {
      month: month ?? new Date().getMonth() + 1,
      days,
      mood: mood ?? 'apa-saja',
      destination: destination ?? null,
    },
    total: suggestions.length,
    suggestions,
  });
});
