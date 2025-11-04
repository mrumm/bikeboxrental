import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmed | Bike Box Rental Hamilton',
  description: 'Your bike box rental has been confirmed! View your booking details and learn about pickup instructions for your B&W International Bike Box II rental in Hamilton, ON.',
  robots: {
    index: false, // Don't index confirmation pages
    follow: true,
  },
};

export default function BookingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
