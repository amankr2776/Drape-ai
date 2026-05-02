'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  ShoppingBag, 
  UserCircle,
  Command,
  Plus,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';
import { NotificationBell } from './notifications/notification-bell';
import { SearchOverlay } from './search/search-overlay';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useStore();
  const { signOut, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLanding = pathname === '/';
  const isOnboarding = pathname === '/onboarding';
  const showSidebar = !isLanding && !isOnboarding;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleActionClick = () => {
    if (isAuthenticated) {
      router.push('/analyze');
    } else {
      router.push('/login?redirect=/analyze');
    }
  };

  const handleNavClick = (id: string) => {
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 flex items-center px-6 transition-all duration-300 h-16',
          showSidebar ? 'lg:left-72' : 'left-0',
          isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'
        )}
        style={{ zIndex: 'var(--z-navbar)' }}
      >
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="font-headline text-2xl font-bold tracking-[0.2em] text-gold cursor-pointer">
                DRAPE<span className="text-xs font-body tracking-[0.3em] text-ivory/50 ml-1">AI</span>
              </h1>
            </Link>
            
            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <button 
                onClick={() => router.push('/')}
                className="text-[10px] uppercase font-bold tracking-[0.2em] text-ivory-4 hover:text-gold transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('how-it-works')}
                className="text-[10px] uppercase font-bold tracking-[0.2em] text-ivory-4 hover:text-gold transition-colors"
              >
                Process
              </button>
              <button 
                onClick={() => router.push('/discover')}
                className="text-[10px] uppercase font-bold tracking-[0.2em] text-ivory-4 hover:text-gold transition-colors"
              >
                Discover
              </button>
              <button 
                onClick={() => router.push('/pricing')}
                className="text-[10px] uppercase font-bold tracking-[0.2em] text-ivory-4 hover:text-gold transition-colors"
              >
                Pricing
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="hidden md:flex h-10 px-4 bg-white/5 border-white/10 text-foreground/40 hover:text-foreground transition-standard gap-3"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={16} />
              <span className="text-xs font-medium">Search...</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-foreground/20">
                <Command size={10} />K
              </kbd>
            </Button>

            <Button 
              onClick={handleActionClick}
              size="md" 
              className="h-10 px-6 gap-2 bg-primary text-obsidian font-bold uppercase tracking-widest text-[10px] hover:glow-gold"
            >
              <Plus size={14} strokeWidth={3} />
              <span>{isAuthenticated ? 'New Analysis' : 'Get Styled'}</span>
            </Button>

            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative w-10 h-10">
                    <ShoppingBag size={20} className="text-foreground/60 hover:text-primary transition-colors" />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0.5 flex items-center justify-center text-[10px] bg-primary text-obsidian border-2 border-background">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 pl-2 border-l border-white/10 ml-2 group outline-none">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user?.displayName?.charAt(0) || 'U'
                        )}
                      </div>
                      <ChevronDown size={14} className="text-foreground/40 group-hover:text-primary transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="gap-2 cursor-pointer">
                      <UserCircle size={16} /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')} className="gap-2 cursor-pointer">
                      <Settings size={16} /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-rose cursor-pointer" onClick={() => signOut()}>
                      <LogOut size={16} /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => router.push('/login')}
                className="text-[10px] uppercase font-bold tracking-widest text-gold ml-2"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
