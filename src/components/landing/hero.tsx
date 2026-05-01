'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeroCanvas3D } from './hero-canvas-3d';

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
      {/* 3D WebGL Background */}
      <HeroCanvas3D />
      
      {/* Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background z-[1] pointer-events-none"></div>

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
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span className="text-sm font-body tracking-widest text-primary/80 uppercase">Powered by Groq AI</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-headline text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9] mb-6"
        >
          Dress Like You Were
          <br />
          Designed For It
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body text-xl md:text-2xl text-primary/70 mb-12 max-w-2xl mx-auto"
        >
          AI that reads your body. Styles your soul.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button asChild size="lg" className="h-14 px-10 rounded-none font-headline text-xl tracking-widest transition-transform hover:scale-105 bg-primary text-primary-foreground">
            <Link href="/onboarding">Analyze My Style</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-none border-primary text-primary font-headline text-xl tracking-widest hover:bg-primary/10 transition-transform hover:scale-105">
            <Link href="/how-it-works">See How It Works</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
