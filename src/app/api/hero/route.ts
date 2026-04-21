import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM hero_content LIMIT 1') as any[];
    if (!rows.length) {
      return NextResponse.json({
        name: '', title: '', bio: '', email: '',
        github: '', linkedin: '', instagram: '', avatar: '', cv_url: ''
      });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch hero content', message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { name, title, bio, email, github, linkedin, instagram, avatar, cv_url } = await req.json();
    const [existing] = await db.query('SELECT id FROM hero_content LIMIT 1') as any[];

    if (!(existing as any[]).length) {
      await db.query(
        `INSERT INTO hero_content (name, title, bio, email, github, linkedin, instagram, avatar, cv_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, title, bio, email, github, linkedin, instagram, avatar, cv_url]
      );
    } else {
      await db.query(
        `UPDATE hero_content SET name=?, title=?, bio=?, email=?, github=?, linkedin=?, instagram=?, avatar=?, cv_url=?
         WHERE id=?`,
        [name, title, bio, email, github, linkedin, instagram, avatar, cv_url, (existing as any[])[0].id]
      );
    }
    return NextResponse.json({ message: 'Hero content updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update hero content', message: error.message }, { status: 500 });
  }
}
