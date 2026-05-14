import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME ?? 'admin';
  const validPass = process.env.ADMIN_PASSWORD;

  console.log('got:', JSON.stringify({ username, password }));
  console.log('expected:', JSON.stringify({ validUser, validPass }));
  console.log('pass defined:', !!validPass);

  if (!validPass) {
    return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 });
  }

  if (username !== validUser || password !== validPass) {
    // Constant-time-ish delay to slow brute force
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
