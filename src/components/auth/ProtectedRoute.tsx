
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DrapeLogo } from '@/components/drape-logo';
import { Button } from '@/components/ui/button';
import { AuthDrawer } from './AuthDrawer';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md space-y-12"
        >
          <DrapeLogo className="scale-150" />
          
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-gold/10 mx-auto flex items-center justify-center text-gold">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-headline text-ivory">Atelier Membership Required</h1>
            <p className="text-ivory-3 leading-relaxed">
              Create a free account to unlock silhouette mapping, 
              personalized AI styling, and real-time price tracking.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <AuthDrawer>
              <Button size="lg" className="h-16 font-headline text-2xl tracking-widest bg-gold text-obsidian hover:glow-gold">
                Join the Atelier
              </Button>
            </AuthDrawer>
            <AuthDrawer>
              <Button variant="ghost" className="text-xs uppercase tracking-[0.3em] font-bold text-gold/60 hover:text-gold">
                Already a member? Login
              </Button>
            </AuthDrawer>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
