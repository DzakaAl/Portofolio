import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [[totalVisitors], [totalViews], [todayVisitors], [weekVisitors]] = await Promise.all([
      db.query('SELECT COUNT(DISTINCT session_id) as count FROM visitor_stats WHERE session_id IS NOT NULL'),
      db.query('SELECT COUNT(*) as count FROM visitor_stats'),
      db.query(`SELECT COUNT(DISTINCT session_id) as count FROM visitor_stats WHERE DATE(created_at) = CURDATE() AND session_id IS NOT NULL`),
      db.query(`SELECT COUNT(DISTINCT session_id) as count FROM visitor_stats WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) AND session_id IS NOT NULL`),
    ]) as any[];

    return NextResponse.json({
      totalVisitors: (totalVisitors as any[])[0]?.count || 0,
      totalViews: (totalViews as any[])[0]?.count || 0,
      todayVisitors: (todayVisitors as any[])[0]?.count || 0,
      weekVisitors: (weekVisitors as any[])[0]?.count || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch visitor stats summary', message: error.message }, { status: 500 });
  }
}
