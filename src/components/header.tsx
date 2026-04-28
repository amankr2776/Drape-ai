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
import { Menu, X, Search, ShoppingBag, UserCircle, LogOut, Settings, History } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled || isMenuOpen ? 'bg-background/80 backdrop-blur-sm border-b border-border' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/">
              <DrapeLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-body text-sm hover:text-primary transition-colors relative',
                  pathname === item.href ? 'text-primary' : 'text-foreground/80'
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="underline"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon"><Search /></Button>
            
            <Link href="/dashboard/wardrobe" passHref>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">3</Badge>
                </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/avatar-user/100/100" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Ananya Sharma</p>
                    <p className="text-xs leading-none text-muted-foreground">ananya@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userNav.map(item => (
                    <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {!isDashboard && (
                 <Link href="/onboarding" passHref>
                    <Button className="font-headline tracking-wider">Get Styled</Button>
                 </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="pt-20"
            >
              <nav className="flex flex-col items-center gap-8 py-8">
                {[...mainNav, ...userNav].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'font-headline text-3xl hover:text-primary transition-colors',
                      pathname === item.href ? 'text-primary' : 'text-foreground'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-8">
                    <Link href="/onboarding" passHref>
                        <Button size="lg" className="font-headline text-xl tracking-wider" onClick={() => setIsMenuOpen(false)}>Get Styled</Button>
                    </Link>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
