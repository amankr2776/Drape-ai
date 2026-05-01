'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RefreshCcw, LifeBuoy } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Track error in analytics
    console.error('Atelier Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md space-y-8"
      >
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
          <LifeBuoy size={128} className="text-accent relative z-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline text-primary">Something Frayed</h1>
          <p className="text-foreground/60 leading-relaxed">
            Even the finest silks have a loose thread. We've been notified of this technical issue and our curators are on it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            className="h-14 px-8 font-headline text-lg tracking-widest bg-primary text-primary-foreground hover:glow-gold"
          >
            <RefreshCcw className="mr-2 w-5 h-5" /> Retry Session
          </Button>
          <Button asChild variant="outline" className="h-14 px-8 border-primary/20 hover:bg-primary/5">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>

        <p className="text-[10px] text-foreground/20 uppercase tracking-[0.3em]">
          Error Hash: {error.digest || 'unknown_at_atelier'}
        </p>
      </motion.div>
    </div>
  );
}
