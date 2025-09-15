import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Box } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bike Box Rental Hamilton - Professional Bike Travel Case Rentals | $30/week",
  description: 'Rent a professional B&W International Bike Box II in Hamilton, Ontario. Secure bike transport for races & vacations. Weekly rentals at $30. Located in L8P 2M3 area. Book online today!',
  keywords: 'bike box rental hamilton, bike travel case rental, bicycle transport hamilton, bike shipping box, B&W bike box, cycling equipment rental hamilton ontario',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://bikeboxrentalhamilton.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bike Box Rental Hamilton - Professional Bike Travel Cases',
    description: 'Rent a B&W International Bike Box II in Hamilton for $30/week. Perfect for races, vacations, and bike transport. Located in L8P 2M3.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://bikeboxrentalhamilton.com',
    siteName: 'Bike Box Rental Hamilton',
    images: [
      {
        url: '/bikeboxBW2.jpg',
        width: 1200,
        height: 630,
        alt: 'B&W International Bike Box II for rent in Hamilton',
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bike Box Rental Hamilton - $30/week',
    description: 'Professional bike travel case rentals in Hamilton, ON. B&W International Bike Box II. Book online for your next cycling adventure!',
    images: ['/bikeboxBW2.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Bike Box Rental Hamilton',
    description: 'Professional bike travel case rentals in Hamilton, Ontario. B&W International Bike Box II available for weekly rentals at $30/week.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://bikeboxrentalhamilton.com',
    telephone: '',
    email: 'rummel.markus@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hamilton',
      addressRegion: 'ON',
      postalCode: 'L8P 2M3',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.259049,
      longitude: -79.875166,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$30/week',
    image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://bikeboxrentalhamilton.com'}/bikeboxBW2.jpg`,
    offers: {
      '@type': 'Offer',
      name: 'B&W International Bike Box II Rental',
      description: 'Weekly rental of professional bike travel case',
      price: '30.00',
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeRegistry>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navigation />
            <Box sx={{ flex: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}