import { NextRequest, NextResponse } from 'next/server';
import { db, bookings } from '@/lib/db';
import { createCheckoutSession } from '@/lib/stripe';
import { differenceInDays } from 'date-fns';
import { and, or, lte, gte, eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { customerName, customerEmail, customerPhone, startDate, endDate, notes } = body;

    if (!customerName || !customerEmail || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start) + 1;

    if (days < 7) {
      return NextResponse.json(
        { error: 'Minimum rental period is 7 days' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.paymentStatus, 'completed'),
          or(
            // New booking starts during existing booking
            and(
              lte(bookings.startDate, startDate),
              gte(bookings.endDate, startDate)
            ),
            // New booking ends during existing booking
            and(
              lte(bookings.startDate, endDate),
              gte(bookings.endDate, endDate)
            ),
            // New booking encompasses existing booking
            and(
              gte(bookings.startDate, startDate),
              lte(bookings.endDate, endDate)
            )
          )
        )
      );

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Selected dates are not available' },
        { status: 400 }
      );
    }

    // Calculate price: $30 for first 7 days, then $30/7 per additional day
    let totalPrice: number;
    if (days <= 7) {
      totalPrice = 30 * 100; // $30 in cents
    } else {
      const additionalDays = days - 7;
      const dailyRate = 30 / 7;
      totalPrice = Math.round((30 + (additionalDays * dailyRate)) * 100); // Convert to cents
    }

    const [newBooking] = await db
      .insert(bookings)
      .values({
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        startDate,
        endDate,
        totalPrice,
        paymentStatus: 'pending',
        notes: notes || null,
      })
      .returning();

    const session = await createCheckoutSession({
      customerEmail,
      startDate,
      endDate,
      days,
      totalPrice,
    });

    await db
      .update(bookings)
      .set({ stripeSessionId: session.id })
      .where(eq(bookings.id, newBooking.id));

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}