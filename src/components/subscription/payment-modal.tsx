'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard, Smartphone, Zap, ShieldCheck, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/hooks/use-subscription';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'monthly' | 'yearly';
}

export function PaymentModal({ isOpen, onClose, planType }: PaymentModalProps) {
  const [step, setStep] = useState<'summary' | 'processing' | 'success'>('summary');
  const { upgradeToPro } = useSubscription();
  const [promoCode, setPromoCode] = useState('');

  const price = planType === 'monthly' ? 99 : 699;
  const tax = Math.round(price * 0.18);
  const total = price + tax;

  const handlePayment = async () => {
    setStep('processing');
    await upgradeToPro();
    setStep('success');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-primary/20 p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <AnimatePresence mode="wait">
          {step === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="text-3xl font-headline text-primary">Order Summary</DialogTitle>
                <DialogDescription>Review your selection before entering the secure atelier portal.</DialogDescription>
              </DialogHeader>

              <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">Elite Pro Atelier</p>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest">{planType} Billing</p>
                  </div>
                  <p className="font-headline text-2xl text-primary">₹{price}</p>
                </div>
                <Separator className="bg-primary/10" />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-foreground/60">
                    <span>Platform Service Fee</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/60">
                    <span>GST (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-center font-bold text-xl text-primary">
                  <span>Total Due</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Input 
                  placeholder="Promo Code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="h-12 bg-card/20 border-primary/10"
                />
                <Button variant="outline" className="h-12 border-primary/20">Apply</Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-foreground/40">
                  <ShieldCheck size={14} className="text-primary" />
                  <span>Secure 256-bit encrypted payment via Razorpay</span>
                </div>
                <Button onClick={handlePayment} className="w-full h-14 font-headline text-xl tracking-widest bg-primary text-primary-foreground hover:glow-gold">
                  Pay with Razorpay
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary/40" />
                </div>
              </div>
              <h3 className="text-2xl font-headline text-primary">Securing Your Access</h3>
              <p className="text-sm text-foreground/60">We are communicating with the bank to finalize your Elite Pro membership. Do not refresh.</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="p-6 rounded-full bg-primary/20 relative">
                <CheckCircle2 className="w-20 h-20 text-primary" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 rounded-full"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-headline text-primary">Welcome to the Elite</h3>
                <p className="text-foreground/60">Your profile has been upgraded. Every style permutation is now at your fingertips.</p>
              </div>
              <Button onClick={() => window.location.href = '/dashboard'} className="w-full h-14 font-headline text-xl tracking-widest bg-primary text-primary-foreground">
                Enter the Pro Atelier
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
