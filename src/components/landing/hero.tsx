'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UltraHeroCanvas } from './ultra-hero-canvas';

/**
 * @fileOverview Refined hero section for DRAPE AI.
 * Now featuring the Ultra Cinematic physics-based Canvas experience.
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
      {/* High-performance physics-based Canvas */}
      <UltraHeroCanvas />
      
      <motion.div
        className="relative z-10 text-center px-4 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-body tracking-widest text-primary/80 uppercase">Intelligent Fabric Simulation</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-headline text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9] mb-6 drop-shadow-2xl"
        >
          Fashion That
          <br />
          <span className="italic text-primary">Breathes With You</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto"
        >
          Experience the intersection of liquid luxury and intelligent silhouette geometry.
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

      {/* Loading Progress Visual */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 h-0.5 bg-primary/50 z-20"
      />
    </section>
  );
}
