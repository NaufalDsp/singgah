import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { users, trips, trip_items, favorites, tips } from '../db/schema.js';
import {
  getCurrentUser,
  createSession,
  destroySession,
  generateRandomToken,
  sha256,
} from '../lib/auth.js';
import { apiError } from '../lib/errors.js';
import type { Env } from '../index.js';

export const authRoute = new Hono<{ Bindings: Env }>();

// GET /api/v1/auth/google
authRoute.get('/google', async (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    // Mode demo/development jika credentials belum diisi di wrangler.jsonc
    return c.json({
      message: 'Google Client ID belum dikonfigurasi di environment.',
      demo_login_url: '/api/v1/auth/demo-login',
    });
  }

  const state = generateRandomToken(16);
  const redirectUri = `${c.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/api/v1/auth/google/callback`;

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  return c.redirect(authUrl.toString());
});

// Demo login untuk pengujian lokal saat offline / tanpa Google Cloud Console
authRoute.get('/demo-login', async (c) => {
  const db = drizzle(c.env.DB);
  const now = Math.floor(Date.now() / 1000);
  const demoSub = 'demo-traveler-sub-001';

  let user = await db.select().from(users).where(eq(users.google_sub, demoSub)).get();
  if (!user) {
    const newId = `usr_${generateRandomToken(8)}`;
    await db.insert(users).values({
      id: newId,
      google_sub: demoSub,
      name: 'Pelancong Nusantara',
      avatar_url:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      created_at: now,
    });
    user = await db.select().from(users).where(eq(users.id, newId)).get();
  }

  if (user) {
    await createSession(c, user.id);
  }

  const redirectUrl = c.env.PUBLIC_SITE_URL || 'http://localhost:4321';
  return c.redirect(`${redirectUrl}/akun`);
});

// GET /api/v1/auth/google/callback
authRoute.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) {
    return apiError(c, 400, 'KODE_OTORISASI_KOSONG', 'Parameter code dari Google tidak ditemukan.');
  }

  const clientId = c.env.GOOGLE_CLIENT_ID;
  const clientSecret = c.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${c.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/api/v1/auth/google/callback`;

  try {
    // Exchange authorization code dengan access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`Google token exchange gagal: ${tokenRes.status}`);
    }

    const tokenData: any = await tokenRes.json();
    const userInfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile: any = await userInfoRes.json();
    if (!profile.sub) {
      throw new Error('Profil Google tidak memiliki sub id.');
    }

    const db = drizzle(c.env.DB);
    const now = Math.floor(Date.now() / 1000);

    // Cek daftar admin dari env (ADMIN_SUBS)
    const adminSubs = (c.env.ADMIN_SUBS || '').split(',').map((s) => s.trim());
    const role = adminSubs.includes(profile.sub) ? 'admin' : 'user';

    // Upsert user berdasarkan google_sub (Tanpa menyimpan email)
    let user = await db.select().from(users).where(eq(users.google_sub, profile.sub)).get();

    if (!user) {
      const newId = `usr_${generateRandomToken(8)}`;
      await db.insert(users).values({
        id: newId,
        google_sub: profile.sub,
        name: profile.name || 'Pelancong Singgah',
        avatar_url: profile.picture || null,
        role: role,
        created_at: now,
      });
      user = await db.select().from(users).where(eq(users.id, newId)).get();
    } else {
      // Update nama / avatar / role jika berubah
      await db
        .update(users)
        .set({
          name: profile.name || user.name,
          avatar_url: profile.picture || user.avatar_url,
          role: role,
        })
        .where(eq(users.id, user.id));
    }

    if (user) {
      await createSession(c, user.id);
    }

    const targetUrl = c.env.PUBLIC_SITE_URL || 'http://localhost:4321';
    return c.redirect(`${targetUrl}/akun`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return apiError(c, 500, 'OTENTIKASI_GAGAL', 'Gagal memproses otentikasi akun dengan Google.');
  }
});

// POST /api/v1/auth/logout
authRoute.post('/logout', async (c) => {
  await destroySession(c);
  return c.json({ success: true, message: 'Berhasil keluar.' });
});

// GET /api/v1/auth/me (Profil Pengguna Aktif)
authRoute.get('/me', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk untuk mengakses fitur ini.');
  }

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at,
    },
  });
});

// GET /api/v1/auth/me/export (Portabilitas data sesuai UU PDP)
authRoute.get('/me/export', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk untuk mengekspor data.');
  }

  const db = drizzle(c.env.DB);
  const userTrips = await db.select().from(trips).where(eq(trips.user_id, user.id)).all();
  const userFavs = await db.select().from(favorites).where(eq(favorites.user_id, user.id)).all();
  const userTips = await db.select().from(tips).where(eq(tips.user_id, user.id)).all();

  return c.json({
    exported_at: new Date().toISOString(),
    profile: {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at,
    },
    trips: userTrips,
    favorites: userFavs,
    tips: userTips,
  });
});

// DELETE /api/v1/auth/me (Penghapusan akun mandiri tanpa sisa)
authRoute.delete('/me', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return apiError(c, 401, 'BELUM_MASUK', 'Silakan masuk untuk menghapus akun.');
  }

  const db = drizzle(c.env.DB);
  // D1 FOREIGN KEY ON DELETE CASCADE otomatis menghapus trips, sessions, favorites, tips
  await db.delete(users).where(eq(users.id, user.id));
  await destroySession(c);

  return c.json({
    success: true,
    message: 'Akun dan seluruh data tersimpan telah dihapus secara permanen.',
  });
});
