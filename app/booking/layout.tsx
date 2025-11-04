import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Bike Box Rental | Hamilton, ON - B&W International Bike Box II',
  description: 'Book your professional B&W bike travel case rental in Hamilton, Ontario. Check availability, select dates, and secure your bike box for $30/week (7-day minimum). Easy online booking with Stripe payment.',
  keywords: 'book bike box Hamilton, rent bike travel case, bike box availability Hamilton, bike shipping case rental Ontario, professional bike box booking',
  openGraph: {
    title: 'Book Your Bike Box Rental - Hamilton, ON',
    description: 'Reserve your professional B&W bike travel case. Check real-time availability and book online. $30 for 7 days, then $4.29/day.',
    url: '/booking',
  },
  twitter: {
    title: 'Book Your Bike Box Rental - Hamilton, ON',
    description: 'Reserve your professional B&W bike travel case. Check real-time availability and book online. $30 for 7 days, then $4.29/day.',
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
