
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DrapeLogo } from '@/components/drape-logo';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function AuthDrawer({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Logic for email sign-in would go here
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[480px] bg-obsidian border-l border-gold/20 p-0 overflow-hidden flex flex-col z-[var(--z-drawer)]">
        <div className="absolute top-0 left-0 w-1 h-full bg-gold z-10" />
        
        <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center gap-8 mb-12">
            <DrapeLogo className="scale-125" />
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-obsidian-2 border border-gold/10 p-1">
                <TabsTrigger value="login" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian font-headline tracking-widest uppercase text-xs">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian font-headline tracking-widest uppercase text-xs">Join</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                onClick={signInWithGoogle}
                className="h-14 bg-white text-black hover:bg-white/90 border-none gap-3 font-bold text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
              <Button 
                variant="outline" 
                onClick={signInWithApple}
                className="h-14 bg-black text-white hover:bg-black/90 border-gold/10 gap-3 font-bold text-sm"
              >
                <svg viewBox="0 0 256 315" className="w-5 h-5 fill-current">
                  <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-22.181 45.317-13.46 19.666-27.428 39.232-49.333 39.632-21.524.397-28.46-12.753-53.04-12.753-24.582 0-32.224 12.355-52.646 13.152-20.023.793-36.216-21.547-49.803-41.222-27.783-40.237-49.034-113.732-20.354-163.454 14.24-24.7 39.633-40.357 67.228-40.754 21.134-.397 41.05 14.237 54.004 14.237 12.955 0 37.19-17.518 62.77-15.02 10.724.444 40.89 4.316 60.25 32.65-1.564 1.01-35.918 20.88-35.918 62.062zM176.24 74.28c11.391-13.801 19.066-32.99 16.966-52.128-16.42.664-36.31 10.936-48.083 24.71-10.562 12.28-19.82 31.76-17.33 50.533 18.312 1.417 37.056-9.313 48.447-23.115z" />
                </svg>
                Continue with Apple
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gold/10" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold"><span className="bg-obsidian px-4 text-ivory-4">Or with Email</span></div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <AnimatePresence mode="wait">
                {tab === 'signup' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-gold">Full Identity</Label>
                      <Input placeholder="Your Name" className="h-12 bg-obsidian-2 border-gold/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-gold">Username</Label>
                      <div className="relative">
                        <Input placeholder="@handle" className="h-12 bg-obsidian-2 border-gold/10 pl-8" required />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold">@</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-gold">Email Address</Label>
                <Input type="email" placeholder="email@example.com" className="h-12 bg-obsidian-2 border-gold/10" required />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] uppercase tracking-widest text-gold">Secret Phrase</Label>
                  {tab === 'login' && <button type="button" className="text-[10px] text-gold font-bold hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    className="h-12 bg-obsidian-2 border-gold/10 pr-10" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {tab === 'signup' && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-[10px] leading-tight text-ivory-3 font-normal">
                      I agree to the <Link href="/privacy-policy" className="text-gold underline">Privacy Policy</Link> and <Link href="/terms" className="text-gold underline">Terms & Conditions</Link>
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="marketing" />
                    <Label htmlFor="marketing" className="text-[10px] leading-tight text-ivory-3 font-normal">
                      Allow notifications for price drops and style updates
                    </Label>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full h-14 mt-6 font-headline text-2xl tracking-widest bg-gold text-obsidian hover:glow-gold">
                {isLoading ? <Loader2 className="animate-spin" /> : tab === 'login' ? 'Login' : 'Begin Journey'}
              </Button>
            </form>
          </div>
        </div>

        <div className="p-4 border-t border-gold/5 text-center">
          <p className="text-[8px] uppercase tracking-[0.4em] text-ivory-4">DRAPE AI • DATA PRIVACY CERTIFIED • ISO 27001</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
