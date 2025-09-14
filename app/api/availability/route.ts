import { NextResponse } from 'next/server';
import { db, bookings, blockedDates } from '@/lib/db';
import { eq, and, or, gte, lte } from 'drizzle-orm';
import { format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        bookedRanges: [],
        blockedDates: [],
      });
    }

    const allBookings = await db
      .select({
        startDate: bookings.startDate,
        endDate: bookings.endDate,
      })
      .from(bookings)
      .where(eq(bookings.paymentStatus, 'completed'));

    const allBlockedDates = await db
      .select({
        date: blockedDates.date,
      })
      .from(blockedDates);

    const bookedRanges = allBookings.map((booking: any) => ({
      start: booking.startDate,
      end: booking.endDate,
    }));

    const blocked = allBlockedDates.map((blocked: any) => blocked.date);

    return NextResponse.json({
      bookedRanges,
      blockedDates: blocked,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}