'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie, Settings2, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('drape_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('drape_consent', 'all');
    setIsVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-8 lg:max-w-md z-50"
          >
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Cookie size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">Style Personalization</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    We use cookies to remember your silhouette analysis and provide optimized outfit recommendations.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={handleAcceptAll} className="w-full bg-primary text-obsidian font-bold">Accept All</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPreferences(true)} className="flex-1 text-xs gap-2">
                    <Settings2 size={14} /> Preferences
                  </Button>
                  <Button variant="ghost" onClick={() => setIsVisible(false)} className="flex-1 text-xs">Essential Only</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="glass-panel border-border sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>Manage your data privacy within the atelier.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Strictly Necessary</Label>
                <p className="text-xs text-foreground/40">Required for login and security features.</p>
              </div>
              <Switch checked disabled />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics</Label>
                <p className="text-xs text-foreground/40">Anonymously track feature usage to help us improve.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Personalization</Label>
                <p className="text-xs text-foreground/40">Remember your body measurements and style vibe.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowPreferences(false)} className="w-full bg-primary text-obsidian font-bold">Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}