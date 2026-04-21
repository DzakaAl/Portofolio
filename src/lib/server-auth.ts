import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

export interface AdminPayload {
  username: string;
  role: string;
}

/**
 * Verify JWT from Authorization header (Bearer <token>)
 * Returns the decoded payload or null if invalid
 */
export function verifyJWT(req: NextRequest): AdminPayload | null {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminPayload;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Middleware helper: returns a 401 response if the JWT is missing/invalid.
 * Usage:
 *   const authError = requireAuth(req);
 *   if (authError) return authError;
 */
export function requireAuth(req: NextRequest): NextResponse | null {
  const payload = verifyJWT(req);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/**
 * Sign a new JWT for admin login
 */
export function signJWT(payload: AdminPayload): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '24h') as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, JWT_SECRET, options);
}
