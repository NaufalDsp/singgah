import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoute } from './routes/health.js';
import { weatherRoute } from './routes/weather.js';
import { plannerRoute } from './routes/planner.js';
import { authRoute } from './routes/auth.js';
import { tripsRoute } from './routes/trips.js';
import { sharedRoute } from './routes/shared.js';
import { favoritesRoute } from './routes/favorites.js';
import { apiError, ERROR_D1_LIMIT } from './lib/errors.js';

export interface Env {
  DB: D1Database;
  TIPS_ENABLED?: string;
  PUBLIC_SITE_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  ADMIN_SUBS?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Global CORS & middleware
app.use('*', async (c, next) => {
  const origin = c.env?.PUBLIC_SITE_URL || '*';
  const corsMiddleware = cors({
    origin: origin === '*' ? '*' : [origin],
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

// Mount routes under /api/v1
const v1 = new Hono<{ Bindings: Env }>();
v1.route('/health', healthRoute);
v1.route('/weather', weatherRoute);
v1.route('/planner', plannerRoute);
v1.route('/auth', authRoute);
v1.route('/trips', tripsRoute);
v1.route('/shared', sharedRoute);
v1.route('/favorites', favoritesRoute);

app.route('/api/v1', v1);

// Global Error Handler
app.onError((err, c) => {
  console.error('Unhandled API error:', err);

  // Check if D1 daily quota limit reached error
  if (err.message && err.message.toLowerCase().includes('daily limit')) {
    return apiError(c, 503, ERROR_D1_LIMIT.code, ERROR_D1_LIMIT.message, ERROR_D1_LIMIT.details);
  }

  return apiError(c, 500, 'INTERNAL_ERROR', 'Terjadi kesalahan sistem.');
});

// 404 handler for API routes
app.notFound((c) => {
  return apiError(c, 404, 'NOT_FOUND', 'Endpoint API tidak ditemukan.');
});

export default app;
