import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getIp } from '@/lib/rateLimit';

export const config = {
  matcher: [
    '/api/admin/login',
    '/api/orders',
    '/api/products/search',
  ],
};

const RULES: Record<string, { limit: number; windowMs: number }> = {
  '/api/admin/login':      { limit: 10,  windowMs: 60_000  }, // 10 attempts / min
  '/api/orders':           { limit: 20,  windowMs: 60_000  }, // 20 orders / min per IP
  '/api/products/search':  { limit: 60,  windowMs: 60_000  }, // 60 searches / min
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = RULES[pathname];

  // Only rate-limit POST for login and orders; GET is fine for search
  if (!rule) return NextResponse.next();
  if (pathname === '/api/admin/login' && req.method !== 'POST') return NextResponse.next();
  if (pathname === '/api/orders'      && req.method !== 'POST') return NextResponse.next();

  const ip  = getIp(req);
  const key = `${pathname}:${ip}`;
  const res = rateLimit(key, rule);

  if (!res.success) {
    return new NextResponse(
      JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.' }),
      {
        status: 429,
        headers: {
          'Content-Type':  'application/json',
          'Retry-After':   String(Math.ceil(res.resetMs / 1000)),
          'X-RateLimit-Limit':     String(res.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  const next = NextResponse.next();
  next.headers.set('X-RateLimit-Limit',     String(res.limit));
  next.headers.set('X-RateLimit-Remaining', String(res.remaining));
  return next;
}
