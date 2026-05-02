'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Search, 
  Heart, 
  ShoppingBag, 
  UserCircle,
  Scissors,
  Sun,
  Moon,
  Command
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';
import { NotificationBell } from './notifications/notification-bell';
import { SearchOverlay } from './search/search-overlay';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'Process' },
  { href: '/discover', label: 'Discover' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();
  const { wishlist, cart } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const saved = localStorage.getItem('drape_theme') as 'dark' | 'light';
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('drape_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 transition-all duration-300 h-[64px] flex items-center px-6 md:px-12',
          isScrolled ? 'bg-obsidian/80 backdrop-blur-xl border-b border-border shadow-large' : 'bg-transparent'
        )}
        style={{ zIndex: 'var(--z-navbar)' }}
      >
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Scissors size={18} className="text-gold" strokeWidth={1.5} />
              </div>
              <DrapeLogo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-8 h-full">
            <div className="flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-[13px] font-body tracking-[0.1em] uppercase transition-colors duration-200 relative py-2 px-4',
                    pathname === link.href ? 'text-gold' : 'text-ivory-2 hover:text-gold'
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="relative group w-10 h-10 hover:bg-gold/5"
              >
                <Search size={20} className="text-ivory-3 group-hover:text-gold transition-colors" />
                <div className="absolute right-0 bottom-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                   <Command size={8} className="text-gold" />
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="w-10 h-10 hover:bg-gold/5"
              >
                {theme === 'dark' ? <Sun size={20} className="text-gold" /> : <Moon size={20} className="text-gold" />}
              </Button>

              <NotificationBell />

              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative w-10 h-10 hover:bg-gold/5">
                  <Heart size={20} className={cn("text-ivory-3 transition-colors", wishlist.length > 0 && "text-gold fill-gold/20")} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-obsidian">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative w-10 h-10 hover:bg-gold/5">
                  <ShoppingBag size={20} className="text-ivory-3 transition-colors" />
                  {cart.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-obsidian">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gold/5">
                <UserCircle size={22} className="text-ivory-3 hover:text-gold" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-10 h-10"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 bg-obsidian-2 p-8 lg:hidden flex flex-col z-[var(--z-modal)]"
            >
              <div className="flex justify-between items-center mb-16">
                <DrapeLogo />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={28} />
                </Button>
              </div>
              <nav className="flex flex-col gap-8 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'text-4xl font-headline transition-colors',
                      pathname === link.href ? 'text-gold' : 'text-ivory'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="space-y-6 pt-12 border-t border-border">
                <Button variant="primary" size="lg" asChild className="w-full h-16 text-xl tracking-widest">
                  <Link href="/onboarding" onClick={() => setIsMobileMenuOpen(false)}>Get Styled</Link>
                </Button>
                <div className="flex justify-around py-4">
                  <Button variant="ghost" size="icon" onClick={toggleTheme} className="scale-150">
                    {theme === 'dark' ? <Sun /> : <Moon />}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}