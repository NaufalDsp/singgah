import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import { favorites } from '../db/schema.js';
import { getCurrentUser } from '../lib/auth.js';
import { apiError } from '../lib/errors.js';
import type { Env } from '../index.js';

export const favoritesRoute = new Hono<{ Bindings: Env }>();

// GET /api/v1/favorites
favoritesRoute.get('/', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk akun.');

  const db = drizzle(c.env.DB);
  const userFavs = await db.select().from(favorites).where(eq(favorites.user_id, user.id)).all();

  return c.json({ favorites: userFavs.map((f) => f.destination) });
});

// PUT /api/v1/favorites/:slug
favoritesRoute.put('/:slug', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk akun.');

  const slug = c.req.param('slug')?.toLowerCase();
  const db = drizzle(c.env.DB);
  const now = Math.floor(Date.now() / 1000);

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.user_id, user.id), eq(favorites.destination, slug)))
    .get();

  if (!existing) {
    await db.insert(favorites).values({
      user_id: user.id,
      destination: slug,
      created_at: now,
    });
  }

  return c.json({ success: true, destination: slug, saved: true });
});

// DELETE /api/v1/favorites/:slug
favoritesRoute.delete('/:slug', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk akun.');

  const slug = c.req.param('slug')?.toLowerCase();
  const db = drizzle(c.env.DB);

  await db
    .delete(favorites)
    .where(and(eq(favorites.user_id, user.id), eq(favorites.destination, slug)));

  return c.json({ success: true, destination: slug, saved: false });
});
