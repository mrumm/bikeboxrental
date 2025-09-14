import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bike Box Rental Hamilton",
  description: 'Rent a professional bike travel case for your next cycling adventure. B&W International Bike Box II available for weekly rentals in Hamilton, Ontario.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <Navigation />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}