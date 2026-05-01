'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { NotificationCard } from '@/components/notifications/notification-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Filter, 
  ArrowUpDown,
  Archive
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'alerts') return n.type === 'price_drop' || n.type === 'account';
    return true;
  });

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-6xl font-headline text-primary">Atelier Alerts</h1>
            <p className="text-foreground/40 uppercase tracking-[0.3em] text-[10px]">
              Managing {notifications.length} notifications • {unreadCount} unread
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={markAllRead} className="border-primary/20 hover:bg-primary/5 h-12">
              <CheckCheck className="mr-2 h-4 w-4" /> Mark All Read
            </Button>
            <Button variant="ghost" onClick={clearAll} className="text-accent hover:bg-accent/5 h-12">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Filter Stream</p>
              <div className="space-y-2">
                {['All Notifications', 'Unread Only', 'Priority Alerts', 'Style Reports'].map(f => (
                  <button 
                    key={f}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/5 text-sm transition-all border border-transparent hover:border-primary/10 flex justify-between items-center group"
                  >
                    <span>{f}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-primary/10" />

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <Archive className="text-primary w-8 h-8" />
              <h3 className="font-headline text-xl">Archive Old Alerts</h3>
              <p className="text-xs text-foreground/40 leading-relaxed">
                Clean up your feed by moving older style tips and digest entries to your style archive.
              </p>
              <Button variant="outline" className="w-full border-primary/20 h-10 text-xs uppercase tracking-widest">
                Archive Read
              </Button>
            </div>
          </aside>

          {/* Stream */}
          <main className="lg:col-span-3">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent border-b border-primary/10 rounded-none h-12 w-full justify-start gap-8 mb-8">
                {['All', 'Unread', 'Alerts'].map(tab => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab.toLowerCase()}
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 h-12 uppercase tracking-[0.2em] text-[10px] font-bold"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  <div className="space-y-4">
                    {filtered.map((n) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <NotificationCard 
                          notification={n} 
                          onRead={markAsRead} 
                          onDelete={deleteNotification}
                          variant="page"
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32 text-center"
                  >
                    <div className="p-8 rounded-full bg-primary/5 text-primary/10 mb-8 scale-150">
                      <Bell size={48} />
                    </div>
                    <h2 className="text-4xl font-headline text-foreground/40">Feed Synchronized</h2>
                    <p className="text-foreground/20 max-w-sm mt-4">You have reviewed all current style intelligence updates.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
