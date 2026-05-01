'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Search, 
  Heart, 
  ShoppingBag, 
  Bell, 
  UserCircle,
  Scissors
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';

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
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 h-[64px] flex items-center px-16 md:px-48',
        isScrolled ? 'bg-obsidian/80 backdrop-blur-xl border-b border-border shadow-medium' : 'bg-transparent'
      )}
    >
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Scissors size={18} className="text-gold" />
          </div>
          <DrapeLogo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-[40px] absolute left-1/2 -translate-x-1/2">
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
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-4">
            <Link href="/discover" className="p-2 text-ivory-2 hover:text-gold transition-colors">
              <Search size={22} strokeWidth={1.5} />
            </Link>
            <Link href="/wishlist" className="relative group p-2 text-ivory-2 hover:text-gold transition-colors">
              <Heart size={22} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute top-2 right-1 w-4 h-4 bg-gold text-obsidian text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-obsidian">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative group p-2 text-ivory-2 hover:text-gold transition-colors">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute top-2 right-1 w-4 h-4 bg-gold text-obsidian text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-obsidian">
                  {cart.length}
                </span>
              )}
            </Link>
            <Button variant="primary" className="hidden sm:flex ml-4 h-[40px] px-6 rounded-[6px] text-[12px] font-semibold tracking-[0.08em] uppercase hover:bg-gold-light hover:translate-y-[-1px] hover:shadow-[0_4px_16px_rgba(201,168,76,0.35)]" asChild>
              <Link href="/onboarding">Get Styled</Link>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-ivory-2 hover:text-gold"
            onClick={() => setIsMobileMenuOpen(true)}
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
            className="fixed inset-0 bg-obsidian z-[200] lg:hidden p-24"
          >
            <div className="flex justify-between items-center mb-48">
              <DrapeLogo />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} strokeWidth={1.5} />
              </Button>
            </div>
            <nav className="flex flex-col gap-32">
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
              <Button variant="primary" size="lg" asChild className="mt-24 h-16 text-xl tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/onboarding">Get Styled</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}