import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { title, issuer, date, description, image, credentialUrl, credential_url, display_order } = await req.json();
    const finalCredentialUrl = credentialUrl || credential_url || '';

    const [result] = await db.query(
      'UPDATE certificates SET title=?, issuer=?, date=?, description=?, image=?, credential_url=?, display_order=? WHERE id=?',
      [title, issuer, date, description || '', image || '', finalCredentialUrl, display_order ?? 0, params.id]
    ) as any[];

    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    return NextResponse.json({ message: 'Certificate updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update certificate', message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const [result] = await db.query('DELETE FROM certificates WHERE id = ?', [params.id]) as any[];
    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    return NextResponse.json({ message: 'Certificate deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete certificate', message: error.message }, { status: 500 });
  }
}
