import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM about_content LIMIT 1') as any[];
    if (!(rows as any[]).length) {
      return NextResponse.json({
        id: 1, title: '', description: '', bio: '', skills: [], experience: [],
        education: [], strengths: [], stats: [], image: '', profile_image: '',
        name: '', role: '', subtitle: '', location: '', certification: '',
        availability: '', summary1: '', summary2: '', summary3: ''
      });
    }

    const data = { ...(rows as any[])[0] };
    const jsonFields = ['skills', 'experience', 'education', 'strengths', 'stats'];
    for (const field of jsonFields) {
      if (data[field] && typeof data[field] === 'string') {
        try { data[field] = JSON.parse(data[field]); } catch { data[field] = []; }
      }
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch about content', message: error.message }, { status: 500 });
  }
}
