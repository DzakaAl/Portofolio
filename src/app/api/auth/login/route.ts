import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/server-auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = signJWT({ username: ADMIN_USERNAME, role: 'admin' });
      return NextResponse.json({
        success: true,
        token,
        user: { username: ADMIN_USERNAME, role: 'admin' },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Login failed', message: error.message }, { status: 500 });
  }
}
