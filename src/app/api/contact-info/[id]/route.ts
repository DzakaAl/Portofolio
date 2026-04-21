import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { email, location, github, linkedin, instagram, twitter, website } = await req.json();

    const [result] = await db.query(
      `UPDATE contact_info
       SET email=?, location=?, github=?, linkedin=?, instagram=?, twitter=?, website=?
       WHERE id=?`,
      [email, location, github || null, linkedin || null, instagram || null, twitter || null, website || null, params.id]
    ) as any[];

    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Contact info not found' }, { status: 404 });
    return NextResponse.json({ message: 'Contact info updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update contact info', message: error.message }, { status: 500 });
  }
}
