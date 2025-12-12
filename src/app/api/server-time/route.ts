import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();

  return NextResponse.json({
    serverTime: now.toISOString(),
    timestamp: now.getTime(),
  });
}

// Disable caching for this endpoint
export const dynamic = 'force-dynamic';
