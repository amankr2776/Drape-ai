'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Search, ShoppingBag, LogOut, Settings, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthDrawer } from './auth-drawer';
import { Input } from './ui/input';
import { NotificationBell } from './notifications/notification-bell';

const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

const userNav = [
    { href: '/dashboard/wardrobe', label: 'My Wardrobe', icon: ShoppingBag },
    { href: '/dashboard/history', label: 'Style History', icon: History },
    { href: '/dashboard/profile', label: 'Settings', icon: Settings },
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

              <Link href="/dashboard/wardrobe" className="hidden sm:flex">
                <Button variant="ghost" size="icon" className="relative group hover:text-primary">
                  <ShoppingBag className="w-5 h-5" />
                  <Badge variant="default" className="absolute -top-1 -right-1 h-4 min-w-4 p-0.5 justify-center text-[10px] bg-primary text-primary-foreground">3</Badge>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/10 p-0 overflow-hidden hover:border-primary/40 transition-all">
                    <Avatar className="h-full w-full">
                      <AvatarImage src="https://picsum.photos/seed/avatar-user/100/100" alt="User" />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-xl border-primary/10 mt-2" align="end">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-headline text-primary tracking-wide">Ananya Sharma</p>
                      <p className="text-xs text-foreground/40 font-body">Elite Member</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  {userNav.map(item => (
                    <DropdownMenuItem key={item.href} asChild className="p-3 cursor-pointer hover:bg-primary/5 focus:bg-primary/5">
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <item.icon className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase tracking-widest">{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem className="p-3 text-accent cursor-pointer hover:bg-accent/5 focus:bg-accent/5">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="text-xs uppercase tracking-widest">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <AuthDrawer>
              <Button className="hidden sm:flex font-headline text-md tracking-wider px-8 h-12 bg-primary text-primary-foreground hover:glow-gold transition-all duration-500">
                Get Styled
              </Button>
            </AuthDrawer>

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

              <div className="space-y-8">
                <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/40 font-body">Your Atelier</p>
                <nav className="flex flex-col gap-4">
                  {userNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-4 text-xl font-body text-foreground/80 hover:text-primary transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-primary" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto pt-12">
                <AuthDrawer>
                  <Button className="w-full h-16 font-headline text-2xl tracking-widest bg-primary text-primary-foreground shadow-2xl">
                    Begin Styling Session
                  </Button>
                </AuthDrawer>
                <p className="text-center mt-6 text-[10px] uppercase tracking-widest text-foreground/20">© 2024 DRAPE AI • DESIGNED IN INDIA</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
