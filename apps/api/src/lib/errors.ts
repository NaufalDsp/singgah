import type { Context } from 'hono';

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export function apiError(
  c: Context,
  status: 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503,
  code: string,
  message: string,
  details?: Record<string, unknown>,
) {
  return c.json<ApiErrorPayload>(
    {
      error: {
        code,
        message,
        details,
      },
    },
    status,
  );
}

export const ERROR_D1_LIMIT = {
  code: 'BATAS_HARIAN_TERCAPAI',
  message: 'Fitur akun beristirahat sampai pukul 07.00 WIB.',
  details: { retry_after: '07:00 WIB' },
};
