import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, bookings } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        await db
          .update(bookings)
          .set({
            paymentStatus: 'completed',
            stripePaymentIntentId: session.payment_intent as string,
            updatedAt: new Date(),
          })
          .where(eq(bookings.stripeSessionId, session.id));

        const [booking] = await db
          .select()
          .from(bookings)
          .where(eq(bookings.stripeSessionId, session.id));

        if (booking && process.env.RESEND_API_KEY) {
          await sendConfirmationEmail(booking);
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        await db
          .update(bookings)
          .set({
            paymentStatus: 'expired',
            updatedAt: new Date(),
          })
          .where(eq(bookings.stripeSessionId, session.id));

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(booking: any) {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const firstName = booking.customerName.split(' ')[0];

  try {
    await resend.emails.send({
      from: 'Markus <noreply@bikeboxrentalhamilton.com>',
      reply_to: 'rummel.markus@gmail.com',
      to: booking.customerEmail,
      cc: 'rummel.markus@gmail.com',
      subject: 'Booking Confirmation - Bike Box Rental Hamilton',
      html: `
        <p>Hi ${firstName},</p>

        <p>Thank you for booking a bike box rental!</p>

        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Rental Period:</strong> ${booking.startDate} to ${booking.endDate}</li>
          <li><strong>Total Paid:</strong> $${(booking.totalPrice / 100).toFixed(2)} CAD</li>
        </ul>

        <p>For pick up you can come by before 8:30 AM or after 5 PM on weekdays, or we can find a time on the weekend. I recommend picking up the day before your rental begins.</p>

        <p>The address is 65 Homewood Ave, Hamilton, ON L8P 2M3.</p>

        <p><strong>Let me know what time works for you please by replying to this email.</strong></p>

        <p>Best wishes,<br>Markus<br>365 888 2803</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}