import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { order } = await req.json() as { order: { id: number; display_order: number }[] };

    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    await Promise.all(
      order.map(({ id, display_order }) =>
        db.query('UPDATE tech_stack SET display_order = ? WHERE id = ?', [display_order, id])
      )
    );

    return NextResponse.json({ message: 'Tech stack reordered successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to reorder tech stack', message: error.message }, { status: 500 });
  }
}
