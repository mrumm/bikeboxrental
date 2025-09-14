import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    })
  : null as any;

export const WEEKLY_PRICE = 3000; // $30.00 in cents

export async function createCheckoutSession({
  customerEmail,
  startDate,
  endDate,
  weeks,
}: {
  customerEmail: string;
  startDate: string;
  endDate: string;
  weeks: number;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'B&W International Bike Box II Rental',
            description: `Rental from ${startDate} to ${endDate} (${weeks} week${weeks > 1 ? 's' : ''})`,
            images: process.env.NEXT_PUBLIC_BASE_URL ? [`${process.env.NEXT_PUBLIC_BASE_URL}/bikeboxBW2.jpg`] : [],
          },
          unit_amount: WEEKLY_PRICE,
        },
        quantity: weeks,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking`,
    customer_email: customerEmail,
    metadata: {
      startDate,
      endDate,
      weeks: weeks.toString(),
    },
  });

  return session;
}
