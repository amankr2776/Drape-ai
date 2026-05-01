'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('drape_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: 'all' | 'essential' | 'reject') => {
    localStorage.setItem('drape_cookie_consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      type
    }));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[110]"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-foreground/40 hover:text-primary transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-headline text-xl text-primary">Atelier Privacy</h4>
                <p className="text-sm text-foreground/60 leading-relaxed mt-1">
                  We use essential cookies to maintain your style profile and anonymous analytics to improve your experience.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => handleConsent('all')}
                className="w-full font-headline text-lg"
              >
                Accept All
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConsent('essential')}
                  className="border-primary/10 hover:bg-primary/5 text-xs"
                >
                  Essential Only
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConsent('reject')}
                  className="border-primary/10 hover:bg-primary/5 text-xs"
                >
                  Reject
                </Button>
              </div>
            </div>

            <p className="text-[10px] text-center mt-4 text-foreground/30 uppercase tracking-widest">
              Read our <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
