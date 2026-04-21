import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { name, category, icon, display_order } = await req.json();
    const [result] = await db.query(
      'UPDATE tech_stack SET name=?, category=?, icon=?, display_order=? WHERE id=?',
      [name, category, icon, display_order || 0, params.id]
    ) as any[];
    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Tech stack item not found' }, { status: 404 });
    return NextResponse.json({ message: 'Tech stack item updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update tech stack item', message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const [result] = await db.query('DELETE FROM tech_stack WHERE id = ?', [params.id]) as any[];
    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Tech stack item not found' }, { status: 404 });
    return NextResponse.json({ message: 'Tech stack item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete tech stack item', message: error.message }, { status: 500 });
  }
}
