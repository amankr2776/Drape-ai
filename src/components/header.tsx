'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { NotificationBell } from './notifications/notification-bell';

const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12',
          isScrolled || isMenuOpen ? 'bg-background/90 backdrop-blur-xl border-b border-primary/10 py-3' : 'bg-transparent'
        )}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Link href="/" className="relative z-[60]">
            <DrapeLogo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-body text-xs uppercase tracking-[0.2em] transition-all hover:text-primary relative group',
                  pathname === item.href ? 'text-primary' : 'text-foreground/60'
                )}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-[1px] bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: pathname === item.href ? 1 : 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4 md:gap-8 relative z-[60]">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:text-primary transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </Button>
              
              <NotificationBell />

              <Button asChild className="hidden sm:flex font-headline text-md tracking-wider px-8 h-12 bg-primary text-primary-foreground hover:glow-gold transition-all duration-500">
                <Link href="/onboarding">Get Styled</Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden relative z-[70] hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 80, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full bg-background border-b border-primary/20 flex items-center px-6 md:px-12 overflow-hidden shadow-2xl"
            >
              <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
                <Search className="w-6 h-6 text-primary" />
                <Input 
                  autoFocus
                  placeholder="Search outfits, brands, or styles..." 
                  className="border-none bg-transparent text-xl font-headline placeholder:text-foreground/20 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-background lg:hidden"
          >
            <div className="flex flex-col h-full pt-32 pb-12 px-8 overflow-y-auto">
              <div className="space-y-8 mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/40 font-body">Main Navigation</p>
                <nav className="flex flex-col gap-6">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'font-headline text-5xl hover:text-primary transition-all duration-300',
                        pathname === item.href ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto pt-12">
                <Button asChild className="w-full h-16 font-headline text-2xl tracking-widest bg-primary text-primary-foreground shadow-2xl">
                  <Link href="/onboarding">Begin Styling Session</Link>
                </Button>
                <p className="text-center mt-6 text-[10px] uppercase tracking-widest text-foreground/20">© 2024 DRAPE AI • DESIGNED IN INDIA</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
