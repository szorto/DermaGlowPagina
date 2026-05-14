import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const COOKIE_NAME = 'dg_admin';
const MAX_AGE     = 60 * 60 * 8; // 8 hours

function sign(value: string): string {
  const secret = process.env.ADMIN_SECRET ?? 'fallback-secret-change-me';
  const hmac   = createHmac('sha256', secret).update(value).digest('hex');
  return `${value}.${hmac}`;
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf('.');
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  if (sign(value) !== signed) return null;
  return value;
}

/** Call from an API route after verifying credentials. */
export async function setAdminSession() {
  const jar = await cookies();
  const payload = `admin:${Date.now()}`;
  jar.set(COOKIE_NAME, sign(payload), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   MAX_AGE,
  });
}

/** Call from an API route to log out. */
export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Returns true if the current request has a valid admin session. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const jar   = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return verify(value) !== null;
}
