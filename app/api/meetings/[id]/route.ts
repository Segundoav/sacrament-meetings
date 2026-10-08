import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getMeetingById, updateMeeting } from '@/lib/meetings-db';
import type { Hymn, MeetingType, SacramentMeeting } from '@/lib/types';

export const dynamic = 'force-dynamic';

const MAX_ID = 2147483647; // el máximo de una columna SERIAL en PostgreSQL
const MEETING_TYPES: MeetingType[] = ['testimony', 'regular', 'stake', 'general'];

// Convierte el texto de la URL en un número válido, o devuelve null
function parseId(id: string): number | null {
  const meetingId = Number(id);
  if (!/^\d+$/.test(id) || meetingId < 1 || meetingId > MAX_ID) return null;
  return meetingId;
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

// GET /api/meetings/1 -> una reunión
// GET /api/meetings/abc -> 400 (id inválido)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseId(id);
  if (meetingId === null) {
    return badRequest('Invalid meeting id. It must be a positive whole number.');
  }

  try {
    const meeting = await getMeetingById(meetingId);
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 });
    }
    return NextResponse.json(meeting);
  } catch (error) {
    console.error(`GET /api/meetings/${id} failed:`, error);
    return NextResponse.json({ error: 'Could not load the meeting.' }, { status: 500 });
  }
}

// ---- Validaciones para PUT ----
function isText(value: unknown, max = 255): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

function toHymn(value: unknown): Hymn | null {
  if (typeof value !== 'object' || value === null) return null;
  const { number, title } = value as { number?: unknown; title?: unknown };
  if (typeof number !== 'number' || !Number.isInteger(number) || number < 1) return null;
  if (!isText(title, 200)) return null;
  return { number, title: title.trim() };
}

// PUT /api/meetings/1 -> guarda los cambios de una reunión (requiere sesión)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const meetingId = parseId(id);
  if (meetingId === null) {
    return badRequest('Invalid meeting id. It must be a positive whole number.');
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('The request body must be valid JSON.');
  }

  if (typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    return badRequest('Date must use the format YYYY-MM-DD.');
  }
  if (!MEETING_TYPES.includes(body.meetingType as MeetingType)) {
    return badRequest(`Meeting type must be one of: ${MEETING_TYPES.join(', ')}.`);
  }
  if (!isText(body.presiding)) return badRequest('Presiding is required.');
  if (typeof body.conducting !== 'string' || body.conducting.length > 255) {
    return badRequest('Conducting must be text of up to 255 characters.');
  }
  if (!isText(body.openingPrayer)) return badRequest('Opening prayer is required.');
  if (!isText(body.closingPrayer)) return badRequest('Closing prayer is required.');

  const openingHymn = toHymn(body.openingHymn);
  const sacramentHymn = toHymn(body.sacramentHymn);
  const closingHymn = toHymn(body.closingHymn);
  if (!openingHymn) return badRequest('Opening hymn needs a number and a title.');
  if (!sacramentHymn) return badRequest('Sacrament hymn needs a number and a title.');
  if (!closingHymn) return badRequest('Closing hymn needs a number and a title.');

  const updates: Partial<SacramentMeeting> = {
    date: body.date,
    meetingType: body.meetingType as MeetingType,
    presiding: body.presiding.trim(),
    conducting: body.conducting.trim(),
    openingHymn,
    openingPrayer: body.openingPrayer.trim(),
    sacramentHymn,
    closingHymn,
    closingPrayer: body.closingPrayer.trim(),
  };

  try {
    const updated = await updateMeeting(meetingId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    // 23505 = ya existe otra reunión con esa fecha (la columna date es UNIQUE)
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { error: 'Another meeting already exists on that date.' },
        { status: 409 }
      );
    }
    console.error(`PUT /api/meetings/${id} failed:`, error);
    return NextResponse.json({ error: 'Could not save the meeting.' }, { status: 500 });
  }
}