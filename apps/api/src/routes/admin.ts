import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc } from 'drizzle-orm';
import { tips, users } from '../db/schema.js';
import { getCurrentUser } from '../lib/auth.js';
import { apiError } from '../lib/errors.js';
import type { Env } from '../index.js';

export const adminRoute = new Hono<{ Bindings: Env }>();

// Middleware autentikasi khusus Admin
adminRoute.use('*', async (c, next) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk dengan akun pengelola.');
  }

  if (user.role !== 'admin') {
    return apiError(
      c,
      403,
      'AKSES_TERLARANG',
      'Halaman dan tindakan ini hanya dapat diakses oleh peran pengelola (admin).',
    );
  }

  return next();
});

// GET /api/v1/admin/tips (Antrean tips untuk dimoderasi)
adminRoute.get('/tips', async (c) => {
  const targetStatus = (c.req.query('status') || 'pending') as 'pending' | 'published' | 'hidden';
  const db = drizzle(c.env.DB);

  const list = await db
    .select({
      id: tips.id,
      destination: tips.destination,
      body: tips.body,
      visited_month: tips.visited_month,
      status: tips.status,
      created_at: tips.created_at,
      moderated_at: tips.moderated_at,
      author: {
        id: users.id,
        name: users.name,
      },
    })
    .from(tips)
    .innerJoin(users, eq(tips.user_id, users.id))
    .where(eq(tips.status, targetStatus))
    .orderBy(desc(tips.created_at))
    .all();

  return c.json({
    status: targetStatus,
    total: list.length,
    tips: list,
  });
});

// POST /api/v1/admin/tips/:id/publish (Setujui dan tayangkan tip)
adminRoute.post('/tips/:id/publish', async (c) => {
  const tipId = c.req.param('id');
  const db = drizzle(c.env.DB);
  const now = Math.floor(Date.now() / 1000);

  const existing = await db.select().from(tips).where(eq(tips.id, tipId)).get();
  if (!existing) {
    return apiError(c, 404, 'TIP_TIDAK_DITEMUKAN', 'Tip tidak ditemukan.');
  }

  await db
    .update(tips)
    .set({
      status: 'published',
      moderated_at: now,
    })
    .where(eq(tips.id, tipId));

  return c.json({
    success: true,
    tip_id: tipId,
    status: 'published',
    message: 'Tip berhasil disetujui dan kini tampil ke publik.',
  });
});

// POST /api/v1/admin/tips/:id/hide (Sembunyikan / tolak tip)
adminRoute.post('/tips/:id/hide', async (c) => {
  const tipId = c.req.param('id');
  const db = drizzle(c.env.DB);
  const now = Math.floor(Date.now() / 1000);

  const existing = await db.select().from(tips).where(eq(tips.id, tipId)).get();
  if (!existing) {
    return apiError(c, 404, 'TIP_TIDAK_DITEMUKAN', 'Tip tidak ditemukan.');
  }

  await db
    .update(tips)
    .set({
      status: 'hidden',
      moderated_at: now,
    })
    .where(eq(tips.id, tipId));

  return c.json({
    success: true,
    tip_id: tipId,
    status: 'hidden',
    message: 'Tip telah disembunyikan dari publik.',
  });
});
