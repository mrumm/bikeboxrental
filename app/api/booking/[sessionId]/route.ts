import { NextRequest, NextResponse } from 'next/server';
import { db, bookings } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { sessionId } = params;

    const [booking] = await db
      .select({
        customerName: bookings.customerName,
        customerEmail: bookings.customerEmail,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalPrice: bookings.totalPrice,
        paymentStatus: bookings.paymentStatus,
      })
      .from(bookings)
      .where(eq(bookings.stripeSessionId, sessionId));

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking details' },
      { status: 500 }
    );
  }
}