'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  Shirt, 
  Heart, 
  History, 
  Settings, 
  HelpCircle,
  ShoppingBag,
  User,
  ChevronRight,
  LogOut,
  Scissors
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DrapeLogo } from './drape-logo';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/discover', label: 'Discover', icon: Sparkles },
    ]
  },
  {
    label: 'Discovery',
    items: [
      { href: '/analyze', label: 'Run Analysis', icon: Scissors },
      { href: '/results', label: 'Recommendations', icon: Shirt },
    ]
  },
  {
    label: 'My Atelier',
    items: [
      { href: '/wishlist', label: 'Wishlist', icon: Heart },
      { href: '/cart', label: 'Shopping Plan', icon: ShoppingBag },
      { href: '/dashboard/wardrobe', label: 'Wardrobe', icon: History },
    ]
  },
  {
    label: 'System',
    items: [
      { href: '/dashboard/profile', label: 'Profile', icon: User },
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: '/help', label: 'Help Centre', icon: HelpCircle },
    ]
  }
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <aside className={cn("bg-card/40 backdrop-blur-2xl flex flex-col p-6 space-y-8 overflow-y-auto", className)}>
      <div className="px-4 py-2">
        <DrapeLogo className="scale-110" />
      </div>

      <nav className="flex-1 space-y-8">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-2">
            <button 
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 hover:text-primary transition-colors group"
            >
              {group.label}
              <ChevronRight className={cn(
                "w-3 h-3 transition-transform duration-200",
                !collapsedGroups.includes(group.label) && "rotate-90"
              )} />
            </button>
            
            <AnimatePresence initial={false}>
              {!collapsedGroups.includes(group.label) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "nav-item group relative",
                          active ? "nav-item-active" : "text-foreground/60 hover:text-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "w-5 h-5 transition-standard",
                          active ? "text-primary" : "text-foreground/30 group-hover:text-primary"
                        )} />
                        {item.label}
                        {active && (
                          <motion.div 
                            layoutId="sidebar-indicator"
                            className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                          />
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      <div className="pt-6 border-t border-border">
        <button className="nav-item w-full text-foreground/40 hover:text-rose transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}