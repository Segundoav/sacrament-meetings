import { NextResponse } from 'next/server';
import { getAllMeetings } from '@/lib/meetings-db';

export const dynamic = 'force-dynamic';

// GET /api/meetings -> arreglo JSON con todas las reuniones
export async function GET() {
  try {
    const meetings = await getAllMeetings();
    return NextResponse.json(meetings);
  } catch (error) {
    console.error('GET /api/meetings failed:', error);
    return NextResponse.json({ error: 'Could not load meetings.' }, { status: 500 });
  }
}