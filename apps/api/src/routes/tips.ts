import { Hono } from 'hono';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, desc, count, gt } from 'drizzle-orm';
import { tips, tip_reports, users } from '../db/schema.js';
import { getCurrentUser, generateRandomToken } from '../lib/auth.js';
import { apiError } from '../lib/errors.js';
import type { Env } from '../index.js';

// Sanitasi teks polos ketat: membuang tag HTML dan karakter berbahaya
export function sanitizePlainText(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, '') // Hapus tag HTML
    .replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#039;';
        default:
          return m;
      }
    })
    .trim();
}

const CreateTipSchema = z.object({
  body: z.string().min(20, 'Tip minimal 20 karakter.').max(400, 'Tip maksimal 400 karakter.'),
  visited_month: z.number().int().min(1).max(12).nullable().optional(),
});

const ReportTipSchema = z.object({
  reason: z.string().min(5, 'Alasan minimal 5 karakter.').max(200, 'Alasan maksimal 200 karakter.'),
});

export const tipsRoute = new Hono<{ Bindings: Env }>();

// Middleware pemeriksaan sakelar global TIPS_ENABLED
tipsRoute.use('*', async (c, next) => {
  if (c.env.TIPS_ENABLED === 'false') {
    return apiError(
      c,
      503,
      'FITUR_DINONAKTIFKAN',
      'Fitur tips komunitas sedang dinonaktifkan sementara.',
    );
  }
  return next();
});

// GET /api/v1/destinations/:slug/tips (Baca tips terpublikasi)
tipsRoute.get('/destinations/:slug/tips', async (c) => {
  const slug = c.req.param('slug')?.toLowerCase();
  if (!c.env.DB) return c.json({ tips: [] });
  const db = drizzle(c.env.DB);

  const publishedTips = await db
    .select({
      id: tips.id,
      body: tips.body,
      visited_month: tips.visited_month,
      created_at: tips.created_at,
      author: {
        id: users.id,
        name: users.name,
        avatar_url: users.avatar_url,
      },
    })
    .from(tips)
    .innerJoin(users, eq(tips.user_id, users.id))
    .where(and(eq(tips.destination, slug), eq(tips.status, 'published')))
    .orderBy(desc(tips.created_at))
    .all();

  return c.json({
    destination: slug,
    total: publishedTips.length,
    tips: publishedTips,
  });
});

// POST /api/v1/destinations/:slug/tips (Tulis tip baru - status pending)
tipsRoute.post('/destinations/:slug/tips', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk akun untuk menulis tip perjalanan.');
  }

  const slug = c.req.param('slug')?.toLowerCase();
  let body: any = {};
  try {
    body = await c.req.json();
  } catch {
    return apiError(c, 400, 'JSON_TIDAK_VALID', 'Format JSON tidak valid.');
  }

  const parsed = CreateTipSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(c, 400, 'DATA_TIDAK_VALID', 'Isi tip tidak memenuhi kriteria panjang.', {
      errors: parsed.error.flatten(),
    });
  }

  const db = drizzle(c.env.DB);
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;

  // Rate Limiting 1: 1 tip per destinasi per pengguna
  const existingForDest = await db
    .select()
    .from(tips)
    .where(and(eq(tips.user_id, user.id), eq(tips.destination, slug)))
    .get();

  if (existingForDest) {
    return apiError(
      c,
      429,
      'BATAS_TIP_DESTINASI',
      'Kamu sudah menulis tip untuk destinasi ini. Setiap pengguna dibatasi 1 tip per destinasi.',
    );
  }

  // Rate Limiting 2: Maksimal 5 tip per hari per pengguna
  const dailyCountRes = await db
    .select({ count: count() })
    .from(tips)
    .where(and(eq(tips.user_id, user.id), gt(tips.created_at, oneDayAgo)))
    .get();

  if (dailyCountRes && dailyCountRes.count >= 5) {
    return apiError(
      c,
      429,
      'BATAS_HARIAN_TERCAPAI',
      'Kamu telah mencapai batas maksimal 5 tip dalam 24 jam terakhir.',
    );
  }

  const cleanBody = sanitizePlainText(parsed.data.body);
  const newTipId = `tip_${generateRandomToken(8)}`;

  await db.insert(tips).values({
    id: newTipId,
    destination: slug,
    user_id: user.id,
    body: cleanBody,
    visited_month: parsed.data.visited_month ?? null,
    status: 'pending', // Wajib dimoderasi sebelum tampil publik
    created_at: now,
  });

  return c.json(
    {
      success: true,
      tip_id: newTipId,
      status: 'pending',
      message: 'Tip berhasil dikirim dan akan tampil setelah disetujui moderator.',
    },
    201,
  );
});

// POST /api/v1/tips/:id/report (Laporkan tip publik)
tipsRoute.post('/tips/:id/report', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk akun untuk melaporkan tip.');
  }

  const tipId = c.req.param('id');
  let body: any = {};
  try {
    body = await c.req.json();
  } catch {
    return apiError(c, 400, 'JSON_TIDAK_VALID', 'Format JSON tidak valid.');
  }

  const parsed = ReportTipSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(c, 400, 'DATA_TIDAK_VALID', 'Alasan laporan tidak valid.');
  }

  const db = drizzle(c.env.DB);
  const existingTip = await db.select().from(tips).where(eq(tips.id, tipId)).get();
  if (!existingTip) {
    return apiError(c, 404, 'TIP_TIDAK_DITEMUKAN', 'Tip yang dilaporkan tidak ditemukan.');
  }

  const now = Math.floor(Date.now() / 1000);
  const reportId = `rep_${generateRandomToken(8)}`;

  try {
    await db.insert(tip_reports).values({
      id: reportId,
      tip_id: tipId,
      reporter_id: user.id,
      reason: sanitizePlainText(parsed.data.reason),
      created_at: now,
    });
  } catch {
    // Unique constraint violation: user sudah melaporkan tip ini
    return apiError(c, 409, 'SUDAH_DILAPORKAN', 'Kamu sudah melaporkan tip ini sebelumnya.');
  }

  return c.json({
    success: true,
    message: 'Laporan berhasil dicatat dan akan segera ditinjau oleh tim moderator.',
  });
});
