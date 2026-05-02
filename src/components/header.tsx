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

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useStore();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 lg:left-72 h-16 flex items-center px-6 transition-all duration-300 z-30',
          isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="h-10 px-4 bg-white/5 border-white/10 text-foreground/40 hover:text-foreground transition-standard gap-3"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={16} />
              <span className="text-xs font-medium">Search the atelier...</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-foreground/20">
                <Command size={10} />K
              </kbd>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="md" className="hidden sm:flex h-10 px-6 gap-2 bg-primary text-obsidian hover:glow-gold">
              <Link href="/analyze">
                <Plus size={16} />
                <span>New Analysis</span>
              </Link>
            </Button>

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
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    AS
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
                <DropdownMenuItem className="gap-2 text-rose cursor-pointer">
                  <LogOut size={16} /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}