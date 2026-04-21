import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const [rows] = await db.query('SELECT * FROM messages ORDER BY created_at DESC') as any[];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch messages', message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const [result] = await db.query(
      'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
      [
        String(name).trim().substring(0, 100),
        String(email).trim().substring(0, 255),
        String(message).trim().substring(0, 5000),
      ]
    ) as any[];

    return NextResponse.json({ id: (result as any).insertId, message: 'Message sent successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message', message: error.message }, { status: 500 });
  }
}
