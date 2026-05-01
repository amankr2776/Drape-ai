'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X, Settings2, Cookie, Info } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface CookieChoices {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [choices, setChoices] = useState<CookieChoices>({
    essential: true,
    analytics: false,
    personalization: false,
    marketing: false,
  });

  useEffect(() => {
    const rawConsent = localStorage.getItem('drape_cookie_consent');
    if (!rawConsent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }

    try {
      const consent = JSON.parse(rawConsent);
      const consentDate = new Date(consent.timestamp);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // Re-prompt if consent is older than 12 months
      if (consentDate < oneYearAgo) {
        setIsVisible(true);
      }
    } catch (e) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (updatedChoices: CookieChoices) => {
    localStorage.setItem('drape_cookie_consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      choices: updatedChoices
    }));
    setIsVisible(false);
    setShowPreferences(false);
    
    // Logic to initialize approved services would go here
    if (updatedChoices.analytics) {
      console.log('Initializing Analytics...');
    }
  };

  const handleAcceptAll = () => {
    const allApproved = {
      essential: true,
      analytics: true,
      personalization: true,
      marketing: true,
    };
    setChoices(allApproved);
    saveConsent(allApproved);
  };

  const handleRejectNonEssential = () => {
    const minimal = {
      essential: true,
      analytics: false,
      personalization: false,
      marketing: false,
    };
    setChoices(minimal);
    saveConsent(minimal);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-xl z-[110]"
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
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Cookie size={24} />
                </div>
                <div>
                  <h4 className="font-headline text-2xl text-primary">Atelier Privacy</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed mt-1">
                    We use cookies to personalize your style journey and analyze our atelier's reach.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAcceptAll}
                  className="flex-1 font-headline text-lg bg-primary text-primary-foreground hover:glow-gold"
                >
                  Accept All
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 border-primary/20 hover:bg-primary/5 font-headline"
                >
                  <Settings2 className="mr-2 w-4 h-4" /> Manage
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleRejectNonEssential}
                  className="text-foreground/40 hover:text-primary text-xs uppercase tracking-widest"
                >
                  Reject Optional
                </Button>
              </div>

              <p className="text-[10px] text-center mt-4 text-foreground/30 uppercase tracking-widest">
                Compliant with DPDP Act 2023 • <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="bg-background border-primary/20 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline text-primary">Cookie Preferences</DialogTitle>
            <DialogDescription className="text-foreground/60">
              Customize how DRAPE AI handles your data. Essential cookies are required for the atelier to function.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Essential */}
            <div className="flex items-start justify-between space-x-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Essential Cookies</Label>
                <p className="text-xs text-foreground/40 leading-relaxed">
                  Required for secure login, session management, and shopping bag persistence.
                </p>
              </div>
              <Switch checked disabled aria-label="Essential cookies (always on)" />
            </div>

            <Separator className="bg-primary/10" />

            {/* Analytics */}
            <div className="flex items-start justify-between space-x-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Analytics Cookies</Label>
                <p className="text-xs text-foreground/40 leading-relaxed">
                  Helps us understand how users interact with our styling tools (anonymous).
                </p>
              </div>
              <Switch 
                checked={choices.analytics} 
                onCheckedChange={(val) => setChoices(prev => ({ ...prev, analytics: val }))}
              />
            </div>

            <Separator className="bg-primary/10" />

            {/* Personalization */}
            <div className="flex items-start justify-between space-x-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Personalization Cookies</Label>
                <p className="text-xs text-foreground/40 leading-relaxed">
                  Remembers your body shape analysis and skin tone preferences across sessions.
                </p>
              </div>
              <Switch 
                checked={choices.personalization} 
                onCheckedChange={(val) => setChoices(prev => ({ ...prev, personalization: val }))}
              />
            </div>

            <Separator className="bg-primary/10" />

            {/* Marketing */}
            <div className="flex items-start justify-between space-x-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground">Marketing Cookies</Label>
                <p className="text-xs text-foreground/40 leading-relaxed">
                  Used to show you relevant fashion trends and price alerts on external platforms.
                </p>
              </div>
              <Switch 
                checked={choices.marketing} 
                onCheckedChange={(val) => setChoices(prev => ({ ...prev, marketing: val }))}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={handleAcceptAll}
              className="sm:flex-1 border-primary/20"
            >
              Accept All
            </Button>
            <Button 
              onClick={() => saveConsent(choices)}
              className="sm:flex-1 bg-primary text-primary-foreground font-headline text-lg"
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
