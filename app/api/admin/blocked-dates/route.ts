import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, blockedDates } from '@/lib/db';
import { asc } from 'drizzle-orm';
import { eachDayOfInterval, format, parseISO, isValid } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isAuthenticated() {
  const sessionCookie = cookies().get('admin_session');
  return sessionCookie?.value === 'authenticated';
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ blockedDates: [] });
  }

  const rows = await db
    .select()
    .from(blockedDates)
    .orderBy(asc(blockedDates.date));

  return NextResponse.json({ blockedDates: rows });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { startDate, endDate, reason } = await request.json();

    if (!startDate || typeof startDate !== 'string') {
      return NextResponse.json({ error: 'startDate is required' }, { status: 400 });
    }

    const start = parseISO(startDate);
    const end = endDate ? parseISO(endDate) : start;

    if (!isValid(start) || !isValid(end)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (end < start) {
      return NextResponse.json({ error: 'endDate must be on or after startDate' }, { status: 400 });
    }

    const days = eachDayOfInterval({ start, end });
    const values = days.map((d) => ({
      date: format(d, 'yyyy-MM-dd'),
      reason: reason && typeof reason === 'string' ? reason : null,
    }));

    await db.insert(blockedDates).values(values).onConflictDoNothing();

    return NextResponse.json({ success: true, count: values.length });
  } catch (error) {
    console.error('Failed to create blocked dates:', error);
    return NextResponse.json({ error: 'Failed to create blocked dates' }, { status: 500 });
  }
}
