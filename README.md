# Tommy's Bike Box Rental

Professional bike travel case rental service in Hamilton, ON. Built with Next.js 14, TypeScript, Material UI, Stripe, and Neon Postgres.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: Neon Postgres connection string
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret
- `NEXT_PUBLIC_BASE_URL`: Your app URL (http://localhost:3000 for development)

Optional:
- `RESEND_API_KEY`: For sending confirmation emails
- `ADMIN_SECRET_KEY`: For accessing the admin dashboard

### 3. Set Up Database

1. Create a Neon Postgres database at [neon.tech](https://neon.tech)
2. Add the connection string to `.env.local`
3. Push the schema to your database:
```bash
npm run db:push
```

### 4. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up a webhook endpoint:
   - URL: `https://yourdomain.com/api/webhook/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
4. Add the webhook signing secret to `.env.local`

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Post-Deployment

1. Update `NEXT_PUBLIC_BASE_URL` to your production URL
2. Update Stripe webhook URL to production endpoint
3. Test the complete booking flow

## Features

- Homepage with Tommy's story and bike box information
- Availability calendar with date picker
- Stripe Checkout integration for secure payments
- Booking confirmation page and email
- FAQ page with detailed specifications
- Admin dashboard for viewing bookings
- Mobile-responsive design

## Database Management

- View database: `npm run db:studio`
- Generate migrations: `npm run db:generate`
- Push schema changes: `npm run db:push`

## Support

For issues or questions, contact: rummel.markus@gmail.com