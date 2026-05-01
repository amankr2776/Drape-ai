'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationPanel } from './notification-panel';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group hover:text-primary">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 h-4 min-w-4 p-0.5 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full shadow-gold-glow animate-pulse"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 border-none bg-transparent shadow-none w-auto mt-2">
        <NotificationPanel />
      </PopoverContent>
    </Popover>
  );
}
