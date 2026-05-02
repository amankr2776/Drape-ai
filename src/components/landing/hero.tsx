'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * @fileOverview Refined hero section for DRAPE AI.
 * Now features a clean, static high-fashion background for a distraction-free entry.
 */

export default function Hero() {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
      <motion.div
        className="relative z-10 text-center px-4 max-w-6xl pointer-events-none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-body tracking-widest text-primary/80 uppercase">Intelligent Silhouette Geometry</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-headline text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9] mb-6 drop-shadow-2xl"
        >
          AI Reads Your Body.
          <br />
          <span className="italic text-primary">Styles Your Soul.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto"
        >
          Precision aesthetic meets intelligent silhouette mapping for the modern Indian wardrobe.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center pointer-events-auto">
          <Button asChild size="lg" className="h-[56px] px-[40px] min-w-[220px] max-w-[280px] font-body text-[14px] font-semibold tracking-[0.05em] bg-primary text-obsidian rounded-[8px] border-none shadow-none hover:bg-gold-light hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(201,168,76,0.3)] transition-all duration-[250ms] group">
            <Link href={isAuthenticated ? "/analyze" : "/login?redirect=/analyze"} className="flex items-center justify-center gap-2">
              Analyze My Style
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[4px]" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-[56px] px-[40px] min-w-[220px] max-w-[280px] font-body text-[14px] font-semibold tracking-[0.05em] text-primary border-[rgba(201,168,76,0.4)] rounded-[8px] bg-transparent hover:border-primary hover:bg-[rgba(201,168,76,0.06)] hover:translate-y-[-1px] transition-all duration-[250ms]">
            <Link href="/how-it-works">See The Process</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
