import { NextRequest, NextResponse } from 'next/server';

// Validates that the request has the correct API key in the Authorization header.
// Used to protect POST / PUT / DELETE routes.
//
// Usage in a route:
//   const authError = requireApiKey(req);
//   if (authError) return authError;
//
// Set ADMIN_API_KEY in your .env.local and in Vercel environment variables.

export function requireApiKey(req: NextRequest): NextResponse | null {
  const apiKey = process.env.ADMIN_API_KEY;

  if (!apiKey) {
    console.error('ADMIN_API_KEY is not set in environment variables');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization') ?? '';
  const provided   = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (provided !== apiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null; // authorized
}
