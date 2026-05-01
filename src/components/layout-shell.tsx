'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { MobileTabBar } from '@/components/mobile-tab-bar';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  // Global scroll body locking logic could be integrated here if needed
  useEffect(() => {
    // Reset overflow on navigation
    document.body.style.overflow = '';
  }, [pathname]);

  return (
    <>
      {!isLanding && <Header />}
      <main className={cn(isLanding ? "min-h-screen" : "page-content")}>
        {children}
      </main>
      {!isLanding && <MobileTabBar />}
      {!isLanding && <Footer />}
    </>
  );
}