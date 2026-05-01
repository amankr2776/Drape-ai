import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { CustomCursor } from '@/components/custom-cursor';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import ScrollToTop from '@/components/scroll-to-top';
import { AppLoader } from '@/components/app-loader';

export const metadata: Metadata = {
  title: 'DRAPE AI | Luxury Personalized Fashion',
  description: 'Experience high-fashion editorial styling powered by advanced AI body intelligence and skin tone harmony.',
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
        <Toaster />
        <ScrollToTop />
      </body>
    </html>
  );
}
