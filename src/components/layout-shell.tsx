'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { MobileTabBar } from '@/components/mobile-tab-bar';
import { cn } from '@/lib/utils';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <>
      {!isLanding && <Header />}
      <main className={cn("flex-grow", !isLanding && "pb-[80px] lg:pb-0")}>
        {children}
      </main>
      {!isLanding && <MobileTabBar />}
      {!isLanding && <Footer />}
    </>
  );
}
