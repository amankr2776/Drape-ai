'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Sparkles, Camera, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Sparkles },
  { href: '/analyze', label: 'Analyze', icon: Camera, primary: true },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-obsidian-2/80 backdrop-blur-xl border-t border-border lg:hidden z-[100] flex items-center justify-around px-16">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.primary) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative -top-12 flex flex-col items-center"
            >
              <div className="w-56 h-56 rounded-full bg-gold shadow-gold flex items-center justify-center text-obsidian">
                <Icon size={28} />
              </div>
              <span className="text-[10px] mt-4 font-bold text-gold uppercase tracking-widest">{tab.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-4 transition-standard relative py-8",
              isActive ? "text-gold" : "text-ivory-3"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className="absolute -top-[1px] w-24 h-2 bg-gold rounded-full"
              />
            )}
            <Icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
