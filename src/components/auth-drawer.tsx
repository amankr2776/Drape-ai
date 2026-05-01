'use client';

import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthDrawer({ children }: { children: React.ReactNode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-primary/20 p-8">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6"
            >
              <CheckCircle2 className="w-20 h-20 text-primary animate-pulse" />
              <h2 className="text-4xl font-headline text-primary">Welcome to the Atelier</h2>
              <p className="text-foreground/60">Your style profile is now synchronized.</p>
              <Button className="w-full" onClick={() => window.location.reload()}>Enter</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <SheetHeader className="mb-8">
                <SheetTitle className="text-4xl font-headline text-primary tracking-wide">
                  Style Profile
                </SheetTitle>
              </SheetHeader>

              <Tabs defaultValue="login" className="space-y-8">
                <TabsList className="grid w-full grid-cols-2 bg-card border border-primary/10">
                  <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Join</TabsTrigger>
                </TabsList>

                <div className="space-y-6">
                  <Button variant="outline" className="w-full h-12 border-primary/20 hover:bg-primary/5 gap-3">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-primary/10" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-foreground/40">Or with Email</span></div>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-foreground/50">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                        <Input type="email" placeholder="email@example.com" className="pl-10 h-12 bg-card/50 border-primary/10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs uppercase tracking-widest text-foreground/50">Password</Label>
                        <Button variant="link" className="text-xs text-primary p-0 h-auto">Forgot?</Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          className="pl-10 h-12 bg-card/50 border-primary/10" 
                          required 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <Button className="w-full h-12 mt-4 font-headline text-lg tracking-wider" disabled={isLoading}>
                      {isLoading ? "Authenticating..." : "Synchronize Profile"}
                    </Button>
                  </form>
                </div>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
