import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [params.id]) as any[];
    if (!(rows as any[]).length) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json((rows as any[])[0]);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch project', message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const {
      title, description, category, image, technologies,
      github, github_url, demo, live_url, featured, display_order,
      show_github, show_demo
    } = await req.json();

    const techString = Array.isArray(technologies) ? technologies.join(',') : technologies;

    const [result] = await db.query(
      `UPDATE projects
       SET title=?, description=?, category=?, image=?, technologies=?,
           github=?, github_url=?, demo=?, live_url=?, featured=?, display_order=?,
           show_github=?, show_demo=?
       WHERE id=?`,
      [
        title, description, category || null, image, techString,
        github ?? null, github_url ?? null, demo ?? null, live_url ?? null,
        featured ?? false, display_order ?? 0,
        show_github !== false ? 1 : 0, show_demo !== false ? 1 : 0,
        params.id
      ]
    ) as any[];

    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update project', message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [params.id]) as any[];
    if ((result as any).affectedRows === 0) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete project', message: error.message }, { status: 500 });
  }
}
