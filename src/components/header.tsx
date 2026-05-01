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
  Scissors,
  LogOut,
  Settings2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';
import { useNotifications } from '@/hooks/use-notifications';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist, cart } = useStore();
  const { unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="text-ivory-2 hover:text-gold w-10 h-10"
                aria-label="Search outfits"
              >
                <Search size={22} strokeWidth={1.5} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-ivory-2 hover:text-gold w-10 h-10" aria-label="Notifications">
                    <Bell size={22} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-gold text-obsidian text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-obsidian">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-obsidian-3 border-border shadow-large p-0 overflow-hidden">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-obsidian-2">
                    <span className="text-label text-gold">Notifications</span>
                    <button onClick={markAllRead} className="text-[10px] uppercase font-bold text-ivory-3 hover:text-gold">Mark all read</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-12 text-center text-ivory-3 italic text-xs">
                      No new style alerts today.
                    </div>
                  </div>
                  <Link href="/notifications" className="block p-3 text-center text-[10px] uppercase font-bold text-gold bg-obsidian-2 hover:bg-gold/5 border-t border-border">
                    View All Notifications
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/wishlist" className="relative group p-2 text-ivory-2 hover:text-gold transition-colors" aria-label="View wishlist">
                <Heart size={22} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute top-2 right-1 w-4 h-4 bg-gold text-obsidian text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-obsidian">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative group p-2 text-ivory-2 hover:text-gold transition-colors" aria-label="View shopping bag">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cart.length > 0 && (
                  <span className="absolute top-2 right-1 w-4 h-4 bg-gold text-obsidian text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-obsidian">
                    {cart.length > 9 ? '9+' : cart.length}
                  </span>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-ivory-2 hover:text-gold w-10 h-10" aria-label="User profile">
                    <UserCircle size={22} strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-obsidian-3 border-border shadow-large p-4 space-y-2">
                  <DropdownMenuLabel className="text-xs uppercase tracking-widest text-gold mb-2">My Atelier</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-md hover:bg-gold/10 hover:text-gold cursor-pointer">
                      <UserCircle size={18} /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/wardrobe" className="flex items-center gap-3 p-3 rounded-md hover:bg-gold/10 hover:text-gold cursor-pointer">
                      <ShoppingBag size={18} /> My Wardrobe
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/analyze" className="flex items-center gap-3 p-3 rounded-md hover:bg-gold/10 hover:text-gold cursor-pointer">
                      <Scissors size={18} /> New Analysis
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile?tab=settings" className="flex items-center gap-3 p-3 rounded-md hover:bg-gold/10 hover:text-gold cursor-pointer">
                      <Settings2 size={18} /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-md hover:bg-rose/10 hover:text-rose cursor-pointer text-ivory-3">
                    <LogOut size={18} /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="primary" 
                className="hidden sm:flex ml-4 h-[40px] px-6 rounded-[6px] text-[12px] font-semibold tracking-[0.08em] uppercase hover:bg-gold-light hover:translate-y-[-1px] hover:shadow-[0_4px_16px_rgba(201,168,76,0.35)]" 
                asChild
              >
                <Link href="/onboarding">Get Styled</Link>
              </Button>
            </div>
            
            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-ivory-2 hover:text-gold"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-obsidian/95 backdrop-blur-xl flex flex-col items-center justify-center p-24"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-24 right-24 p-12 text-ivory-3 hover:text-gold transition-colors"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
            <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl space-y-32">
              <h2 className="text-h1 text-center text-gold">What are you looking for?</h2>
              <div className="relative group">
                <Search className="absolute left-24 top-1/2 -translate-y-1/2 text-gold/50 group-focus-within:text-gold transition-colors" size={24} />
                <input
                  autoFocus
                  placeholder="Sarees, Kurtas, Workwear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-80 bg-obsidian-2 border-b-2 border-gold/20 focus:border-gold outline-none text-display pl-72 pr-24 transition-all placeholder:text-ivory-4"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[210] bg-obsidian lg:hidden p-32 flex flex-col"
          >
            <div className="flex justify-between items-center">
              <DrapeLogo />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X size={24} strokeWidth={1.5} />
              </Button>
            </div>
            <nav className="flex flex-col gap-32 mt-64">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-h1 hover:text-gold transition-all",
                    pathname === link.href ? "text-gold translate-x-12" : "text-ivory"
                  )}
                >
                  <div className="flex items-center justify-between group">
                    {link.label}
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
