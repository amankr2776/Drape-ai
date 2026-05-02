'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrapeLogo } from './drape-logo';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ShieldCheck, ArrowRight, Info } from 'lucide-react';

const CURRENT_POLICY_VERSION = '1.0';

export function MandatoryPrivacyGate() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    age: false,
    cookies: null as 'all' | 'essential' | null,
    notifications: false
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('drape_compliance_consent');
    if (!saved || JSON.parse(saved).version !== CURRENT_POLICY_VERSION) {
      setIsVisible(true);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    const consentData = {
      ...consents,
      acceptedAt: new Date().toISOString(),
      version: CURRENT_POLICY_VERSION
    };
    localStorage.setItem('drape_compliance_consent', JSON.stringify(consentData));
    setIsVisible(false);
  };

  const canProceed = consents.terms && consents.privacy && consents.age && consents.cookies !== null && hasScrolledToBottom;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-obsidian flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[520px] bg-obsidian-2 border border-gold/20 rounded-[24px] p-8 md:p-10 shadow-2xl relative"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <DrapeLogo className="scale-125 mb-6" />
          <h2 className="text-3xl md:text-4xl font-headline text-gold mb-2">Before You Begin</h2>
          <p className="text-sm text-ivory-3 leading-relaxed">
            Please review and accept our policies to continue. We take your privacy and silhouette data seriously.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div 
              onScroll={handleScroll}
              className="h-[200px] overflow-y-auto bg-obsidian-3 border border-border rounded-xl p-4 text-xs text-ivory-3 leading-loose"
            >
              <h3 className="font-bold text-gold uppercase tracking-widest mb-4">Terms of Service Summary</h3>
              <p className="mb-4">1. ELIGIBILITY: You must be at least 13 years old to access the DRAPE AI atelier. Users under 18 require parental supervision.</p>
              <p className="mb-4">2. AI ANALYSIS: By uploading photos, you consent to our AI engine processing your physical landmarks to generate silhouettes.</p>
              <p className="mb-4">3. DATA PRIVACY: Your photos are encrypted and never shared with third-party advertisers. We comply with the DPDP Act 2023.</p>
              <p className="mb-4">4. AFFILIATES: We provide shoppable links to Amazon, Flipkart, and Meesho. Purchases are governed by their respective terms.</p>
              <p className="mb-4">5. SUBSCRIPTIONS: Pro memberships billed via Razorpay are non-refundable for partial months.</p>
              <p>Full legal text is available in the help center.</p>
            </div>
            {!hasScrolledToBottom && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-gold/90 text-obsidian text-[10px] font-bold px-3 py-1 rounded-full animate-bounce">
                  SCROLL TO READ
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={consents.terms} 
                onCheckedChange={(v) => setConsents({...consents, terms: !!v})}
              />
              <Label htmlFor="terms" className="text-xs leading-tight text-ivory-3">
                I agree to the <span className="text-gold underline cursor-pointer">Terms & Conditions</span>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="privacy" 
                checked={consents.privacy} 
                onCheckedChange={(v) => setConsents({...consents, privacy: !!v})}
              />
              <Label htmlFor="privacy" className="text-xs leading-tight text-ivory-3">
                I agree to the <span className="text-gold underline cursor-pointer">Privacy Policy</span>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="age" 
                checked={consents.age} 
                onCheckedChange={(v) => setConsents({...consents, age: !!v})}
              />
              <Label htmlFor="age" className="text-xs leading-tight text-ivory-3">
                I am 13 years of age or older
              </Label>
            </div>
          </div>

          <div className="space-y-3 py-4 border-y border-border">
            <p className="text-[10px] uppercase font-bold tracking-widest text-gold">Cookie Preferences</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConsents({...consents, cookies: 'all'})}
                className={cn(
                  "flex-1 py-2 rounded-full border text-[10px] font-bold uppercase transition-all",
                  consents.cookies === 'all' ? "bg-gold text-obsidian border-gold" : "border-border text-ivory-4 hover:border-gold/30"
                )}
              >
                Accept All
              </button>
              <button 
                onClick={() => setConsents({...consents, cookies: 'essential'})}
                className={cn(
                  "flex-1 py-2 rounded-full border text-[10px] font-bold uppercase transition-all",
                  consents.cookies === 'essential' ? "bg-gold/10 text-gold border-gold" : "border-border text-ivory-4 hover:border-gold/30"
                )}
              >
                Essential Only
              </button>
            </div>
            <p className="text-[9px] text-ivory-4 leading-relaxed flex items-center gap-2">
              <Info size={12} className="shrink-0" />
              All includes analytics. Essential is login only.
            </p>
          </div>

          <div className="flex items-center justify-between pb-4">
            <div className="space-y-0.5">
              <Label className="text-xs text-ivory-2">Style & Price Notifications</Label>
              <p className="text-[10px] text-ivory-4">Get alerts when your favorites drop in price.</p>
            </div>
            <Switch 
              checked={consents.notifications}
              onCheckedChange={(v) => setConsents({...consents, notifications: v})}
            />
          </div>

          <Button 
            disabled={!canProceed}
            onClick={handleAccept}
            className="w-full h-14 font-headline text-2xl tracking-widest bg-gold text-obsidian hover:bg-gold-light disabled:opacity-30"
          >
            Enter DRAPE AI <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <p className="text-[8px] text-center mt-6 text-ivory-4 uppercase tracking-[0.3em]">
          Certified DPDP Act Compliance • Made in India
        </p>
      </motion.div>
    </div>
  );
}
