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

  try {
    await resend.emails.send({
      from: 'Bike Box Rental Hamilton <noreply@bikeboxrentalhamilton.com>',
      to: booking.customerEmail,
      subject: 'Booking Confirmation - Bike Box Rental Hamilton',
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Dear ${booking.customerName},</p>
        <p>Thank you for booking with Bike Box Rental Hamilton! Your rental has been confirmed.</p>

        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Rental Period:</strong> ${booking.startDate} to ${booking.endDate}</li>
          <li><strong>Total Amount Paid:</strong> $${(booking.totalPrice / 100).toFixed(2)} CAD</li>
        </ul>

        <h3>Pick-up Information:</h3>
        <p>Location: Hamilton, ON (exact address will be provided via email 24 hours before pick-up)</p>
        <p>Please bring a valid ID for verification.</p>

        <p>If you have any questions, please reply to this email.</p>

        <p>Best regards,<br>Bike Box Rental Hamilton</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}