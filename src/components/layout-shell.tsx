'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { MobileTabBar } from '@/components/mobile-tab-bar';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { CustomCursor } from '@/components/custom-cursor';
import { AppLoader } from '@/components/app-loader';
import { CookieBanner } from '@/components/legal/cookie-banner';
import { ChatWidget } from '@/components/chat-widget';
import { MandatoryPrivacyGate } from './mandatory-privacy-gate';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isOnboarding = pathname === '/onboarding';

  useEffect(() => {
    document.body.style.overflow = '';
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppLoader />
      <MandatoryPrivacyGate />
      <CustomCursor />
      
      {!isLanding && !isOnboarding && <Header />}
      
      <main className={cn(
        "flex-grow",
        !isLanding && !isOnboarding && "page-wrapper"
      )}>
        {children}
      </main>

      {!isLanding && !isOnboarding && <MobileTabBar />}
      {!isLanding && !isOnboarding && <Footer />}
      
      <CookieBanner />
      <ChatWidget />
    </div>
  );
}
