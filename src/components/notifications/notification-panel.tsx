'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { NotificationCard } from './notification-card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationPanel() {
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'price') return n.type === 'price_drop';
    return true;
  });

  return (
    <div className="w-80 sm:w-96 flex flex-col bg-background/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-primary/10 flex justify-between items-center">
        <div>
          <h3 className="font-headline text-xl text-primary">Notifications</h3>
          <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{unreadCount} Unread Alerts</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={markAllRead}
          className="text-[10px] uppercase tracking-widest hover:text-primary"
        >
          <CheckCheck size={14} className="mr-2" /> Mark All Read
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-primary/5 bg-transparent h-10 px-4 gap-4">
          {['All', 'Unread', 'Price'].map(t => (
            <TabsTrigger 
              key={t} 
              value={t.toLowerCase()}
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-[10px] uppercase tracking-widest font-bold"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[400px]">
        <div className="divide-y divide-primary/5">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationCard 
                    notification={n} 
                    onRead={markAsRead} 
                    onDelete={deleteNotification}
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 px-12 text-center">
                <div className="p-4 rounded-full bg-primary/5 text-primary/20 mb-4">
                  <Bell size={40} />
                </div>
                <p className="font-headline text-xl text-foreground/40">You're all caught up!</p>
                <p className="text-xs text-foreground/20 mt-2">No new notifications to show right now.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <Link 
        href="/notifications" 
        className="p-4 border-t border-primary/10 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 hover:text-primary transition-colors bg-primary/5"
      >
        See All Notifications
      </Link>
    </div>
  );
}
