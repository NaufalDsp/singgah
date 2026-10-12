import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, asc } from 'drizzle-orm';
import { trips, trip_items } from '../db/schema.js';
import { apiError } from '../lib/errors.js';
import type { Env } from '../index.js';

export const sharedRoute = new Hono<{ Bindings: Env }>();

// GET /api/v1/shared/:shareSlug
sharedRoute.get('/:shareSlug', async (c) => {
  const shareSlug = c.req.param('shareSlug');
  if (!shareSlug) return apiError(c, 400, 'SLUG_KOSONG', 'Tautan tidak valid.');

  const db = drizzle(c.env.DB);
  const trip = await db
    .select({
      id: trips.id,
      title: trips.title,
      destination: trips.destination,
      start_month: trips.start_month,
      days: trips.days,
      share_slug: trips.share_slug,
      created_at: trips.created_at,
      updated_at: trips.updated_at,
    })
    .from(trips)
    .where(eq(trips.share_slug, shareSlug))
    .get();

  if (!trip) {
    return apiError(
      c,
      404,
      'TAUTAN_TIDAK_DITEMUKAN',
      'Rencana perjalanan tidak ditemukan atau tautan berbagi telah dicabut.',
    );
  }

  const items = await db
    .select({
      id: trip_items.id,
      day_index: trip_items.day_index,
      position: trip_items.position,
      kind: trip_items.kind,
      title: trip_items.title,
      highlight_id: trip_items.highlight_id,
      time_of_day: trip_items.time_of_day,
      notes: trip_items.notes,
    })
    .from(trip_items)
    .where(eq(trip_items.trip_id, trip.id))
    .orderBy(asc(trip_items.day_index), asc(trip_items.position))
    .all();

  return c.json({ trip, items });
});
