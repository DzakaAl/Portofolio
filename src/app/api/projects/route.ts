import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC') as any[];
    // Normalize MySQL TINYINT(1) to boolean for show_github / show_demo
    const normalized = (rows as any[]).map((r: any) => ({
      ...r,
      show_github: r.show_github === 1 || r.show_github === true,
      show_demo: r.show_demo === 1 || r.show_demo === true,
    }));
    return NextResponse.json(normalized);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch projects', message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
      `INSERT INTO projects
       (title, description, category, image, technologies, github, github_url, demo, live_url, featured, display_order, show_github, show_demo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, category || null, image, techString,
        github ?? null, github_url ?? null, demo ?? null, live_url ?? null,
        featured ?? false, display_order ?? 0,
        show_github !== false ? 1 : 0, show_demo !== false ? 1 : 0
      ]
    ) as any[];

    return NextResponse.json({ id: (result as any).insertId, message: 'Project created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create project', message: error.message }, { status: 500 });
  }
}
