import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp|svg|pdf/;

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase().replace('.', '');
    const mime = file.type;

    const extValid = ALLOWED_TYPES.test(ext);
    const mimeValid = ALLOWED_TYPES.test(mime) || mime === 'application/pdf';

    if (!extValid || !mimeValid) {
      return NextResponse.json({ error: 'Only image files (jpeg, jpg, png, gif, webp, svg) and PDF files are allowed' }, { status: 400 });
    }

    const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Build URL: /uploads/<filename> served as a static path via next.config or backend
    const fileUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      url: fileUrl,
      filename: uniqueName,
      message: 'File uploaded successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to upload file', message: error.message }, { status: 500 });
  }
}
