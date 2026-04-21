import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT component_name, COUNT(*) as views FROM visitor_stats GROUP BY component_name ORDER BY views DESC'
    ) as any[];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch component views', message: error.message }, { status: 500 });
  }
}
