# PRD – BikeBox Rental Web App (Next.js)

## Objective
Lightweight booking + payment site for Tommy’s Bike Box in Hamilton, ON (B&W International Bike Box II). Weekly pricing, Stripe Hosted Checkout, and a simple admin flow via Stripe + DB. (Google Calendar moved to “Future”).  
This is Tommy Rummel’s project (5 years old).

## Tech Stack
- Frontend: Next.js 14 (TypeScript, App Router)
- UI Library: Material UI (MUI)
- Payments: Stripe Hosted Checkout Pages
- DB: Neon Postgres on Vercel with Drizzle ORM
- Hosting: Vercel

## Core Features
- Homepage (story + CTA, with Tommy’s image and bike box photo)
- Availability & Booking (weekly pricing)
- Stripe Checkout flow
- Confirmation page + email
- FAQ (dimensions in cm + inches)
- Minimal admin (Stripe dashboard + DB list page)

## Success Criteria
- Book & pay in under 3 minutes
- No double-bookings
- Clear specs in metric and imperial
- Tommy’s photo + actual case image on homepage

## Product Specs – B&W International Bike Box II
- External: 119 × 89 × 29.5 cm ≈ 46.9 × 35 × 11.6 in
- Internal: 115 × 81 × 28 cm ≈ 45.3 × 31.9 × 11 in
- Weight (empty): ~11.7 kg official (~13 kg measured) ≈ 25–28 lb
- Shell: ABS with aluminum frame
- Wheels: 4 fixed casters
- Locks/closures: 4 latches + center strap
- Fits: Road bikes up to ~62 cm
- Brand/Model: B&W International Bike Box II (Red Cycling Products Bike Box II, art. no. 3000080)

## Future Enhancements
Google Calendar Integration (via Rummel.markus@gmail.com). After Stripe confirmation, automatically mirror bookings into a dedicated sub-calendar. Purpose: quick visibility on mobile, optional public embed. Implementation: OAuth 2.0 refresh token, scope calendar.events, all-day events in America/Toronto. Not required for initial launch.

## Assets
Images to be included on homepage and booking site:
- Tommy.jpeg (photo of Tommy)
- bikeboxBW2.jpg (photo of the bike case)
