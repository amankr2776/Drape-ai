'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import SocialProof from '@/components/landing/social-proof';
import HeroCanvas from '@/components/hero/HeroCanvas';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [showFab, setShowFab] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFabClick = () => {
    router.push(isAuthenticated ? '/analyze' : '/login?redirect=/analyze');
  };

  return (
    <div className="overflow-x-hidden relative bg-background">
      {/* ATELIER SINGULARITY ENGINE */}
      <HeroCanvas />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <Hero />
      </motion.div>

      <div className="space-y-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Features />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HowItWorks />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SocialProof />
        </motion.div>
      </div>

      {/* Mobile Floating Action Button */}
      <AnimatePresence>
        {showFab && (
          <motion.div
            initial={{ translateY: 80, opacity: 0, x: '-50%' }}
            animate={{ translateY: 0, opacity: 1, x: '-50%' }}
            exit={{ translateY: 80, opacity: 0, x: '-50%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed bottom-6 left-1/2 z-[var(--z-sticky)] md:hidden pointer-events-none"
          >
            <Button
              onClick={handleFabClick}
              className="h-[52px] px-8 bg-gradient-to-r from-gold to-gold-light text-obsidian font-bold uppercase tracking-widest text-[13px] rounded-full shadow-[0_8px_24px_rgba(201,168,76,0.45)] pointer-events-auto"
            >
              Get Styled Free ✦
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
