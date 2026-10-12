import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, asc } from 'drizzle-orm';
import { trips, trip_items } from '../db/schema.js';
import { getCurrentUser, generateRandomToken } from '../lib/auth.js';
import { apiError } from '../lib/errors.js';
import type { Env } from '../index.js';

const TripItemInputSchema = z.object({
  id: z.string().optional(),
  day_index: z.number().int().min(1),
  position: z.number().int().min(0),
  kind: z.enum(['tempat', 'makan', 'transit', 'catatan']),
  title: z.string().min(1).max(120),
  highlight_id: z.string().nullable().optional(),
  time_of_day: z.enum(['pagi', 'siang', 'sore', 'malam']).nullable().optional(),
  notes: z.string().max(400).nullable().optional(),
});

const CreateTripSchema = z.object({
  title: z.string().min(1).max(80),
  destination: z.string(),
  start_month: z.number().int().min(1).max(12).nullable().optional(),
  days: z.number().int().min(1).max(21),
  items: z.array(TripItemInputSchema).default([]),
});

const UpdateTripSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  destination: z.string().optional(),
  start_month: z.number().int().min(1).max(12).nullable().optional(),
  days: z.number().int().min(1).max(21).optional(),
  version: z.number().int().min(1), // Optimistic lock wajib
  items: z.array(TripItemInputSchema).optional(),
});

export const tripsRoute = new Hono<{ Bindings: Env }>();

// GET /api/v1/trips (Semua rencana milik user)
tripsRoute.get('/', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk akun untuk melihat rencana.');

  const db = drizzle(c.env.DB);
  const userTrips = await db.select().from(trips).where(eq(trips.user_id, user.id)).all();

  return c.json({ trips: userTrips });
});

// POST /api/v1/trips (Buat rencana baru)
tripsRoute.post('/', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk akun untuk menyimpan rencana.');

  let body: any = {};
  try {
    body = await c.req.json();
  } catch {
    return apiError(c, 400, 'JSON_TIDAK_VALID', 'Format JSON tidak valid.');
  }

  const parsed = CreateTripSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(c, 400, 'DATA_TIDAK_VALID', 'Data rencana tidak sesuai skema.', {
      errors: parsed.error.flatten(),
    });
  }

  const { title, destination, start_month, days, items } = parsed.data;
  const db = drizzle(c.env.DB);
  const now = Math.floor(Date.now() / 1000);
  const tripId = `trp_${generateRandomToken(8)}`;

  await db.insert(trips).values({
    id: tripId,
    user_id: user.id,
    title,
    destination,
    start_month: start_month ?? null,
    days,
    version: 1,
    created_at: now,
    updated_at: now,
  });

  if (items.length > 0) {
    const itemRecords = items.map((it, idx) => ({
      id: it.id || `itm_${generateRandomToken(8)}`,
      trip_id: tripId,
      day_index: it.day_index,
      position: it.position ?? idx,
      kind: it.kind,
      title: it.title,
      highlight_id: it.highlight_id ?? null,
      time_of_day: it.time_of_day ?? null,
      notes: it.notes ?? null,
    }));
    await db.insert(trip_items).values(itemRecords);
  }

  const created = await db.select().from(trips).where(eq(trips.id, tripId)).get();
  return c.json({ trip: created, message: 'Rencana berhasil disimpan.' }, 201);
});

// GET /api/v1/trips/:id (Detail rencana + item harian)
tripsRoute.get('/:id', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk untuk melihat rencana ini.');

  const tripId = c.req.param('id');
  const db = drizzle(c.env.DB);

  const trip = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.user_id, user.id)))
    .get();

  if (!trip) {
    return apiError(c, 404, 'RENCANA_TIDAK_DITEMUKAN', 'Rencana perjalanan tidak ditemukan.');
  }

  const items = await db
    .select()
    .from(trip_items)
    .where(eq(trip_items.trip_id, tripId))
    .orderBy(asc(trip_items.day_index), asc(trip_items.position))
    .all();

  return c.json({ trip, items });
});

// PATCH /api/v1/trips/:id (Update dengan Optimistic Lock Version)
tripsRoute.patch('/:id', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk untuk memperbarui rencana.');

  const tripId = c.req.param('id');
  let body: any = {};
  try {
    body = await c.req.json();
  } catch {
    return apiError(c, 400, 'JSON_TIDAK_VALID', 'Format JSON tidak valid.');
  }

  const parsed = UpdateTripSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(c, 400, 'DATA_TIDAK_VALID', 'Data pembaruan tidak valid.', {
      errors: parsed.error.flatten(),
    });
  }

  const { title, destination, start_month, days, version, items } = parsed.data;
  const db = drizzle(c.env.DB);

  const existing = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.user_id, user.id)))
    .get();

  if (!existing) {
    return apiError(c, 404, 'RENCANA_TIDAK_DITEMUKAN', 'Rencana tidak ditemukan.');
  }

  // Cek konflik versi (Optimistic Locking)
  if (existing.version !== version) {
    return apiError(
      c,
      409,
      'KONFLIK_VERSI',
      'Rencana telah diperbarui di sesi lain. Muat ulang untuk mendapatkan versi terbaru.',
      { current_version: existing.version },
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const nextVersion = existing.version + 1;

  await db
    .update(trips)
    .set({
      title: title ?? existing.title,
      destination: destination ?? existing.destination,
      start_month: start_month !== undefined ? start_month : existing.start_month,
      days: days ?? existing.days,
      version: nextVersion,
      updated_at: now,
    })
    .where(eq(trips.id, tripId));

  // Jika items diperbarui, ganti data items yang lama
  if (items) {
    await db.delete(trip_items).where(eq(trip_items.trip_id, tripId));
    if (items.length > 0) {
      const newItems = items.map((it, idx) => ({
        id: it.id || `itm_${generateRandomToken(8)}`,
        trip_id: tripId,
        day_index: it.day_index,
        position: it.position ?? idx,
        kind: it.kind,
        title: it.title,
        highlight_id: it.highlight_id ?? null,
        time_of_day: it.time_of_day ?? null,
        notes: it.notes ?? null,
      }));
      await db.insert(trip_items).values(newItems);
    }
  }

  const updated = await db.select().from(trips).where(eq(trips.id, tripId)).get();
  return c.json({ trip: updated, version: nextVersion, message: 'Tersimpan.' });
});

// DELETE /api/v1/trips/:id
tripsRoute.delete('/:id', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk.');

  const tripId = c.req.param('id');
  const db = drizzle(c.env.DB);

  await db.delete(trips).where(and(eq(trips.id, tripId), eq(trips.user_id, user.id)));

  return c.json({ success: true, message: 'Rencana dihapus.' });
});

// PUT /api/v1/trips/:id/share (Buat tautan publik)
tripsRoute.put('/:id/share', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk.');

  const tripId = c.req.param('id');
  const db = drizzle(c.env.DB);

  const existing = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.user_id, user.id)))
    .get();

  if (!existing) return apiError(c, 404, 'RENCANA_TIDAK_DITEMUKAN', 'Rencana tidak ditemukan.');

  const shareSlug = existing.share_slug || generateRandomToken(16);
  await db
    .update(trips)
    .set({ share_slug: shareSlug, updated_at: Math.floor(Date.now() / 1000) })
    .where(eq(trips.id, tripId));

  return c.json({
    share_slug: shareSlug,
    share_url: `/r/${shareSlug}`,
  });
});

// DELETE /api/v1/trips/:id/share (Cabut tautan publik)
tripsRoute.delete('/:id/share', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk.');

  const tripId = c.req.param('id');
  const db = drizzle(c.env.DB);

  await db
    .update(trips)
    .set({ share_slug: null, updated_at: Math.floor(Date.now() / 1000) })
    .where(and(eq(trips.id, tripId), eq(trips.user_id, user.id)));

  return c.json({ success: true, message: 'Tautan berbagi dicabut.' });
});
