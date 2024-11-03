// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const contentLength = req.headers.get('content-length') || '0';
  const maxBodySize = 50 * 1024 * 1024; // 50 MB limit

  if (parseInt(contentLength, 10) > maxBodySize) {
    return NextResponse.json(
      { error: 'Payload too large' },
      { status: 413 }
    );
  }

  return NextResponse.next();
}
