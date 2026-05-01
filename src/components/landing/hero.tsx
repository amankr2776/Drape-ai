'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeroCanvas3D } from './hero-canvas-3d';

/**
 * @fileOverview Refined hero section for DRAPE AI.
 * Combines a 3D WebGL background with an editorial typography overlay.
 */

export default function Hero() {
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
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 3D WebGL Background - Behind UI */}
      <HeroCanvas3D />
      
      {/* Editorial Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/40 to-background z-[1] pointer-events-none" />

      <motion.div
        className="relative z-10 text-center px-4 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-pulse"
        >
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm font-body tracking-widest text-primary/80 uppercase">Powered by Groq AI Intelligence</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-headline text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9] mb-6 drop-shadow-2xl"
        >
          Dress Like You Were
          <br />
          <span className="italic text-primary">Designed For It</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto"
        >
          AI that reads your body. Styles your soul.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button asChild size="lg" className="h-16 px-12 font-headline text-xl tracking-[0.2em] bg-primary text-primary-foreground hover:glow-gold transition-all duration-500">
            <Link href="/onboarding">Analyze My Style</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 px-12 border-primary/40 text-primary font-headline text-xl tracking-[0.2em] hover:bg-primary/5 transition-all duration-500">
            <Link href="/how-it-works">See The Process</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Background Micro-interaction Particles or Glows */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-[2]" />
    </section>
  );
}
