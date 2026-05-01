
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
    <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-obsidian-2/80 backdrop-blur-xl border-t border-border lg:hidden z-[100] flex items-center justify-around px-16 pb-safe">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
        const Icon = tab.icon;

        if (tab.primary) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={handleTap}
              className="relative -top-16 flex flex-col items-center"
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="w-64 h-64 rounded-full bg-gold shadow-gold flex items-center justify-center text-obsidian border-4 border-obsidian"
              >
                <Icon size={32} weight="bold" />
              </motion.div>
              <span className="text-[10px] mt-4 font-bold text-gold uppercase tracking-widest">{tab.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={handleTap}
            className={cn(
              "flex flex-col items-center gap-4 transition-all relative py-8 px-12",
              isActive ? "text-gold" : "text-ivory-3"
            )}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              className="relative"
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
              {tab.label === 'Wishlist' && wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 w-14 h-14 bg-rose text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-obsidian">
                  {wishlist.length}
                </span>
              )}
            </motion.div>
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className="absolute -top-[1px] w-24 h-2 bg-gold rounded-full"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
