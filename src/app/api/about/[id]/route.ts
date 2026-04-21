import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const {
      title, description, bio, skills, experience, education,
      strengths, stats, image, profile_image, name, role,
      subtitle, location, certification, availability,
      summary1, summary2, summary3
    } = await req.json();

    const [existing] = await db.query('SELECT id FROM about_content WHERE id = ?', [params.id]) as any[];

    const values = [
      title, description, bio,
      JSON.stringify(skills || []),
      JSON.stringify(experience || []),
      JSON.stringify(education || []),
      JSON.stringify(strengths || []),
      JSON.stringify(stats || []),
      image, profile_image, name, role,
      subtitle, location, certification, availability,
      summary1, summary2, summary3
    ];

    if (!(existing as any[]).length) {
      await db.query(
        `INSERT INTO about_content (
          title, description, bio, skills, experience, education,
          strengths, stats, image, profile_image, name, role,
          subtitle, location, certification, availability,
          summary1, summary2, summary3
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values
      );
    } else {
      await db.query(
        `UPDATE about_content SET
          title=?, description=?, bio=?, skills=?, experience=?, education=?,
          strengths=?, stats=?, image=?, profile_image=?, name=?, role=?,
          subtitle=?, location=?, certification=?, availability=?,
          summary1=?, summary2=?, summary3=?
        WHERE id=?`,
        [...values, params.id]
      );
    }

    return NextResponse.json({ message: 'About content updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update about content', message: error.message }, { status: 500 });
  }
}
