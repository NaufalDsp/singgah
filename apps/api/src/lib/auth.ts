import type { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, gt } from 'drizzle-orm';
import { users, sessions } from '../db/schema.js';
import type { Env } from '../index.js';

const SESSION_COOKIE_NAME = 'singgah_sess';
const SESSION_DURATION_DAYS = 30;

// Menghasilkan hash SHA-256 dari string (untuk token sesi buram di D1)
export async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest('SHA-256', enc);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Menghasilkan random token aman (64 bit atau lebih)
export function generateRandomToken(bytes: number = 32): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Mengambil user yang sedang terautentikasi dari cookie
export async function getCurrentUser(c: Context<{ Bindings: Env }>) {
  const rawToken = getCookie(c, SESSION_COOKIE_NAME);
  if (!rawToken || !c.env.DB) return null;

  const sessionHash = await sha256(rawToken);
  const db = drizzle(c.env.DB);
  const now = Math.floor(Date.now() / 1000);

  const matched = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.user_id, users.id))
    .where(and(eq(sessions.id, sessionHash), gt(sessions.expires_at, now)))
    .get();

  if (!matched) return null;
  return matched.user;
}

// Membuat sesi baru dan setel HttpOnly secure cookie
export async function createSession(c: Context<{ Bindings: Env }>, userId: string) {
  if (!c.env.DB) return '';
  const rawToken = generateRandomToken(32);
  const sessionHash = await sha256(rawToken);
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_DURATION_DAYS * 24 * 60 * 60;

  const db = drizzle(c.env.DB);
  await db.insert(sessions).values({
    id: sessionHash,
    user_id: userId,
    created_at: now,
    expires_at: expiresAt,
  });

  setCookie(c, SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });

  return rawToken;
}

// Menghapus sesi di server dan clear cookie
export async function destroySession(c: Context<{ Bindings: Env }>) {
  const rawToken = getCookie(c, SESSION_COOKIE_NAME);
  if (rawToken && c.env.DB) {
    const sessionHash = await sha256(rawToken);
    const db = drizzle(c.env.DB);
    await db.delete(sessions).where(eq(sessions.id, sessionHash));
  }

  deleteCookie(c, SESSION_COOKIE_NAME, {
    path: '/',
    secure: true,
    sameSite: 'Lax',
  });
}
