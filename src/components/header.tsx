'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
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
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-standard h-[64px] flex items-center px-16 md:px-48',
          isScrolled ? 'bg-obsidian/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
        )}
      >
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <Link href="/">
            <DrapeLogo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-32 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-label transition-standard hover:text-gold relative',
                  pathname === link.href ? 'text-gold' : 'text-ivory-2'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-gold rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-8">
              <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                <Link href="/discover"><Search size={20} /></Link>
              </Button>
              <Link href="/wishlist" className="relative group">
                <Heart size={20} className="group-hover:text-gold transition-standard" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-4 -right-8 w-18 h-18 bg-gold text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative group">
                <ShoppingBag size={20} className="group-hover:text-gold transition-standard" />
                {cart.length > 0 && (
                  <span className="absolute -top-4 -right-8 w-18 h-18 bg-gold text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
              <Button size="sm" asChild className="hidden sm:flex">
                <Link href="/onboarding">Get Styled</Link>
              </Button>
            </div>
            
            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-obsidian lg:hidden p-32 flex flex-col"
          >
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>
            <nav className="flex flex-col gap-24 mt-48">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-h1 hover:text-gold transition-standard"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-48 border-t border-border flex flex-col gap-16">
              <Button size="lg" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/onboarding">Analyze My Style</Link>
              </Button>
              <p className="text-center text-label text-ivory-3">DRAPE AI © 2024</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
