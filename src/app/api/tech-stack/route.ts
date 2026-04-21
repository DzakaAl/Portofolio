import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM tech_stack ORDER BY display_order, category, name') as any[];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch tech stack', message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { name, category, icon, display_order } = await req.json();
    const [result] = await db.query(
      'INSERT INTO tech_stack (name, category, icon, display_order) VALUES (?, ?, ?, ?)',
      [name, category, icon, display_order || 0]
    ) as any[];
    return NextResponse.json({ id: (result as any).insertId, message: 'Tech stack item created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create tech stack item', message: error.message }, { status: 500 });
  }
}
