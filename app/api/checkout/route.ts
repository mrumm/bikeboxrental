import { NextRequest, NextResponse } from 'next/server';
import { db, bookings } from '@/lib/db';
import { createCheckoutSession } from '@/lib/stripe';
import { differenceInDays } from 'date-fns';

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
    const weeks = Math.ceil(days / 7);

    if (weeks < 1) {
      return NextResponse.json(
        { error: 'Minimum rental period is 1 week' },
        { status: 400 }
      );
    }

    const totalPrice = weeks * 30 * 100;

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
      weeks,
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

import { eq } from 'drizzle-orm';