'use client';

import { useUser } from '@/firebase';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { AuthDrawer } from './auth-drawer';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-headline text-[300px] text-primary/10 select-none whitespace-nowrap">
            MEMBER ONLY
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                opacity: 0 
              }}
              animate={{ 
                y: [null, '-20%'],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-md space-y-12"
        >
          <DrapeLogo className="scale-150" />
          
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-5xl font-headline text-primary">This Look Requires An Account</h1>
            <p className="text-foreground/60 leading-relaxed font-body">
              Create a free account to unlock personalized outfit recommendations, 
              silhouette mapping, and real-time price alerts from the atelier.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <AuthDrawer>
              <Button size="lg" className="h-16 font-headline text-2xl tracking-widest bg-primary text-primary-foreground hover:glow-gold">
                Sign Up Free
              </Button>
            </AuthDrawer>
            <AuthDrawer>
              <Button variant="ghost" className="text-xs uppercase tracking-[0.3em] font-bold text-primary/60 hover:text-primary">
                Already a member? Login
              </Button>
            </AuthDrawer>
          </div>

          <div className="pt-12 flex items-center justify-center gap-8 opacity-20 grayscale">
            {['AMAZON', 'FLIPKART', 'MEESHO'].map(p => (
              <span key={p} className="text-[10px] font-bold tracking-[0.5em]">{p}</span>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
