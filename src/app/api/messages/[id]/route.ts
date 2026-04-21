import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const [result] = await db.query('DELETE FROM messages WHERE id = ?', [params.id]) as any[];
    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete message', message: error.message }, { status: 500 });
  }
}
