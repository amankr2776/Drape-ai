
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Sidebar } from '@/components/sidebar';
import { cn } from '@/lib/utils';
import { CustomCursor } from '@/components/custom-cursor';
import { AppLoader } from '@/components/app-loader';
import { CookieBanner } from '@/components/legal/cookie-banner';
import { ChatWidget } from '@/components/chat-widget';
import { MandatoryPrivacyGate } from './mandatory-privacy-gate';
import { AuthProvider } from '@/context/AuthContext';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isOnboarding = pathname === '/onboarding';
  const isAuthPage = pathname?.startsWith('/auth');
  
  const showSidebar = !isLanding && !isOnboarding && !isAuthPage;

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <AppLoader />
        <MandatoryPrivacyGate />
        <CustomCursor />
        
        {showSidebar && <Sidebar className="hidden lg:flex w-72 fixed left-0 top-0 bottom-0 z-40 border-r border-border" />}
        
        <div className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          showSidebar && "lg:pl-72"
        )}>
          {!isLanding && !isOnboarding && <Header />}
          
          <main className={cn(
            "flex-grow flex flex-col",
            !isLanding && !isOnboarding && "pt-16 pb-24 lg:pb-0"
          )}>
            {children}
          </main>

          {!isLanding && !isOnboarding && <Footer />}
        </div>
        
        <CookieBanner />
        <ChatWidget />
      </div>
    </AuthProvider>
  );
}
