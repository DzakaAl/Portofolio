import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/server-auth';

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const [rows] = await db.query(`
      SELECT
        session_id,
        user_agent,
        device_type,
        ip_address,
        COUNT(*) as visit_count,
        GROUP_CONCAT(DISTINCT component_name ORDER BY component_name) as components_viewed,
        COUNT(DISTINCT component_name) as total_component_views,
        MAX(created_at) as last_visit
      FROM visitor_stats
      WHERE session_id IS NOT NULL
      GROUP BY session_id, user_agent, device_type, ip_address
      ORDER BY last_visit DESC
      LIMIT 50
    `) as any[];

    const parsedRows = (rows as any[]).map((row: any) => {
      const ua = row.user_agent || '';

      let browser = 'Unknown';
      if (ua.includes('Edg/')) browser = 'Edge';
      else if (ua.includes('Chrome/')) browser = 'Chrome';
      else if (ua.includes('Firefox/')) browser = 'Firefox';
      else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
      else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';

      let os = 'Unknown';
      if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
      else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
      else if (ua.includes('Windows NT 6.2')) os = 'Windows 8';
      else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
      else if (ua.includes('Windows')) os = 'Windows';
      else if (ua.includes('Mac OS X')) os = 'macOS';
      else if (ua.includes('Android')) os = 'Android';
      else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
      else if (ua.includes('Linux')) os = 'Linux';

      let device = row.device_type || 'desktop';
      device = device.charAt(0).toUpperCase() + device.slice(1);

      return {
        id: row.session_id,
        session_id: row.session_id,
        device,
        browser,
        os,
        ipAddress: row.ip_address,
        visitCount: row.visit_count,
        componentsViewed: row.components_viewed ? row.components_viewed.split(',') : [],
        totalComponentViews: row.total_component_views,
        lastVisit: row.last_visit,
        isBot: /bot|crawler|spider|crawling/i.test(ua),
      };
    });

    return NextResponse.json(parsedRows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch visitor stats', message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { component_name, session_id, is_admin } = body;

    if (is_admin === true) {
      return NextResponse.json({ message: 'Admin tracking skipped' });
    }

    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      null;

    const userAgent = req.headers.get('user-agent') || null;

    let deviceType = 'desktop';
    if (userAgent) {
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        deviceType = 'tablet';
      } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        deviceType = 'mobile';
      }
    }

    await db.query(
      'INSERT INTO visitor_stats (component_name, session_id, ip_address, user_agent, device_type) VALUES (?, ?, ?, ?, ?)',
      [component_name || 'unknown', session_id || null, ipAddress, userAgent, deviceType]
    );

    return NextResponse.json({ message: 'Stats recorded successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to record stats', message: error.message }, { status: 500 });
  }
}
