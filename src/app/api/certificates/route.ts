import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM certificates ORDER BY display_order ASC, created_at DESC') as any[];
    const formatted = (rows as any[]).map((cert: any) => ({
      ...cert,
      credentialUrl: cert.credential_url,
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch certificates', message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { title, issuer, date, description, image, credentialUrl, credential_url, display_order } = await req.json();
    const finalCredentialUrl = credentialUrl || credential_url || '';

    const [result] = await db.query(
      'INSERT INTO certificates (title, issuer, date, description, image, credential_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, issuer, date, description || '', image || '', finalCredentialUrl, display_order ?? 0]
    ) as any[];

    return NextResponse.json({ id: (result as any).insertId, message: 'Certificate created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create certificate', message: error.message }, { status: 500 });
  }
}
