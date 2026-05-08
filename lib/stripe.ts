import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    })
  : null as any;

export const WEEKLY_PRICE = 5000; // $50.00 in cents
export const DAILY_PRICE = 500; // $5.00 in cents

export async function createCheckoutSession({
  customerEmail,
  startDate,
  endDate,
  days,
  totalPrice,
}: {
  customerEmail: string;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'B&W International Bike Box II Rental',
            description: `Rental from ${startDate} to ${endDate} (${days} day${days > 1 ? 's' : ''})`,
            images: process.env.NEXT_PUBLIC_BASE_URL ? [`${process.env.NEXT_PUBLIC_BASE_URL}/bikeboxBW2.jpg`] : [],
          },
          unit_amount: totalPrice,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking`,
    customer_email: customerEmail,
    metadata: {
      startDate,
      endDate,
      days: days.toString(),
      totalPrice: totalPrice.toString(),
    },
  });

  return session;
}
