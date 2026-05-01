import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { CustomCursor } from '@/components/custom-cursor';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import ScrollToTop from '@/components/scroll-to-top';
import { AppLoader } from '@/components/app-loader';
import { CookieBanner } from '@/components/legal/cookie-banner';

export const metadata: Metadata = {
  title: 'DRAPE AI — Your Personal AI Fashion Stylist India',
  description: 'Get personalized outfit recommendations based on your body shape and skin tone. Compare prices on Amazon, Flipkart & Meesho.',
  keywords: ['fashion', 'AI stylist', 'Indian fashion', 'body shape analysis', 'skin tone harmony', 'luxury fashion'],
  authors: [{ name: 'DRAPE AI Team' }],
  openGraph: {
    title: 'DRAPE AI — Luxury AI Fashion Styling',
    description: 'AI that reads your body. Styles your soul.',
    url: 'https://drape.ai',
    siteName: 'DRAPE AI',
    images: [
      {
        url: 'https://picsum.photos/seed/drape-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'DRAPE AI Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRAPE AI — Personal AI Stylist',
    description: 'Breathtaking outfit recommendations powered by body intelligence.',
    images: ['https://picsum.photos/seed/drape-twitter/1200/630'],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary')}>
        <AppLoader />
        <CustomCursor />
        <Header />
        <main className="flex-grow relative z-10">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <Toaster />
        <ScrollToTop />
      </body>
    </html>
  );
}
