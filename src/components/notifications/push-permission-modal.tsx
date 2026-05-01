'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, Tag, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function PushPermissionModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if we already asked
    const hasAsked = localStorage.getItem('drape_push_asked');
    if (!hasAsked) {
      const timer = setTimeout(() => setIsOpen(true), 10000); // Ask after 10s
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('drape_push_asked', 'accepted');
    setIsOpen(false);
    // Trigger native browser prompt
    Notification.requestPermission().then(permission => {
      console.log('Push permission:', permission);
    });
  };

  const handleDecline = () => {
    localStorage.setItem('drape_push_asked', 'declined');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-primary/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <DialogHeader className="flex flex-col items-center text-center space-y-6 pt-6">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="p-5 rounded-full bg-primary/10 text-primary relative"
          >
            <Bell size={40} />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"
            />
          </motion.div>
          
          <div className="space-y-2">
            <DialogTitle className="text-3xl font-headline text-primary">Stay in Harmony</DialogTitle>
            <DialogDescription className="text-foreground/60 leading-relaxed">
              Enable notifications to receive real-time style alerts and exclusive price drops directly from the atelier.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-8">
          {[
            { icon: Tag, text: 'Price Drops' },
            { icon: Sparkles, text: 'New Matches' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <item.icon size={20} className="text-primary" />
              <span className="text-[10px] uppercase tracking-widest font-bold">{item.text}</span>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button 
            variant="ghost" 
            onClick={handleDecline}
            className="flex-1 text-xs uppercase tracking-widest text-foreground/40"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleAccept}
            className="flex-1 font-headline text-lg tracking-widest bg-primary text-primary-foreground hover:glow-gold"
          >
            Accept Alerts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
