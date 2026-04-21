import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM contact_info LIMIT 1') as any[];
    return NextResponse.json((rows as any[])[0] || null);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch contact info', message: error.message }, { status: 500 });
  }
}
