import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { LayoutShell } from '@/components/layout-shell';

export const metadata: Metadata = {
  title: 'DRAPE AI | Luxury Personal AI Stylist',
  description: 'Precision aesthetic meets intelligent silhouette mapping for the modern Indian wardrobe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
