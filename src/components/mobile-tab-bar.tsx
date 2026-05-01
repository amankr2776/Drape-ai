'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  House, 
  Sparkle, 
  Camera, 
  Heart, 
  UserCircle 
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';

const tabs = [
  { href: '/', label: 'Home', icon: House },
  { href: '/discover', label: 'Discover', icon: Sparkle },
  { href: '/analyze', label: 'Analyze', icon: Camera, primary: true },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const { wishlist } = useStore();

  const handleTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-[64px] bg-obsidian/80 backdrop-blur-xl border-t border-border lg:hidden flex items-center justify-around px-4 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.4)]"
      style={{ zIndex: 'var(--z-navbar)' }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
        const Icon = tab.icon;

        if (tab.primary) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={handleTap}
              className="relative -top-6 flex flex-col items-center"
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-gold shadow-gold-glow flex items-center justify-center text-obsidian border-4 border-obsidian"
              >
                <Icon size={28} weight="bold" />
              </motion.div>
              <span className="text-[9px] mt-1 font-bold text-gold uppercase tracking-widest">{tab.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={handleTap}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative py-2 px-3",
              isActive ? "text-gold" : "text-ivory-3"
            )}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              className="relative"
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
              {tab.label === 'Wishlist' && wishlist.length > 0 && (
                <span className="badge-standard flex items-center justify-center w-[14px] h-[14px] bg-rose text-white text-[8px] font-bold rounded-full border border-obsidian">
                  {wishlist.length}
                </span>
              )}
            </motion.div>
            <span className="text-[9px] font-medium uppercase tracking-wider">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className="absolute -top-[2px] w-6 h-0.5 bg-gold rounded-full"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}