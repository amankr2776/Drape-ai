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
  Scissors
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';
import { NotificationBell } from './notifications/notification-bell';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'Process' },
  { href: '/discover', label: 'Discover' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { wishlist, cart } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 transition-all duration-300 h-[64px] flex items-center px-16 md:px-24',
        isScrolled ? 'bg-obsidian/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      )}
      style={{ zIndex: 'var(--z-navbar)' }}
    >
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between h-full">
        {/* Left Section: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <Scissors size={18} className="text-gold" strokeWidth={1.5} />
            </div>
            <DrapeLogo />
          </Link>
        </div>

        {/* Center Section: Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center flex-1 px-8 h-full">
          <div className="flex items-center gap-32">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[13px] font-body tracking-[0.06em] uppercase transition-colors duration-200 relative py-2',
                  pathname === link.href ? 'text-gold' : 'text-ivory-2 hover:text-gold'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-gold rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right Section: Action Icons */}
        <div className="flex items-center gap-8 flex-shrink-0 h-full">
          <div className="hidden sm:flex items-center gap-4 h-full">
            <Link href="/discover" className="p-8 text-ivory-3 hover:text-gold transition-colors" aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </Link>
            
            <NotificationBell />

            <Link href="/wishlist" className="p-8 text-ivory-3 hover:text-gold transition-colors relative" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.5} fill={wishlist.length > 0 ? "rgba(201,168,76,0.2)" : "none"} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-[16px] h-[16px] bg-gold text-obsidian text-[9px] font-bold rounded-full border border-obsidian">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="p-8 text-ivory-3 hover:text-gold transition-colors relative" aria-label="Shopping Plan">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-[16px] h-[16px] bg-gold text-obsidian text-[9px] font-bold rounded-full border border-obsidian">
                  {cart.length > 9 ? '9+' : cart.length}
                </span>
              )}
            </Link>
          </div>

          <Link href="/dashboard/profile" className="p-8 text-ivory-3 hover:text-gold transition-colors" aria-label="Profile">
            <UserCircle size={20} strokeWidth={1.5} />
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-ivory-3 hover:text-gold p-0 h-10 w-10"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-obsidian p-24 lg:hidden"
            style={{ zIndex: 'var(--z-navbar)' }}
          >
            <div className="flex justify-between items-center mb-48">
              <DrapeLogo />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu">
                <X size={24} strokeWidth={1.5} />
              </Button>
            </div>
            <nav className="flex flex-col gap-8">
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
              <Button variant="primary" size="lg" asChild className="mt-8 h-16 text-xl tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/onboarding">Get Styled</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}