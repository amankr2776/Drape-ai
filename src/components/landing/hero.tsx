'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative flex h-screen min-h-[700px] w-full flex-col items-center justify-center overflow-hidden text-center text-ivory">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/fabric-gold/1920/1080"
          alt="Flowing golden fabric"
          fill
          priority
          className="object-cover opacity-30"
          data-ai-hint="abstract gold fabric"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-headline text-5xl md:text-7xl lg:text-8xl leading-tight"
          variants={itemVariants}
        >
          Dress Like You Were
          <br />
          Designed For It
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl font-body text-lg md:text-xl bg-muted-gold"
          variants={itemVariants}
        >
          AI that reads your body. Styles your soul.
        </motion.p>
        <motion.div className="mt-8 flex flex-col sm:flex-row gap-4" variants={itemVariants}>
          <Link href="/dashboard" passHref>
            <Button size="lg" className="font-headline text-lg tracking-wider">
              Analyze My Style
            </Button>
          </Link>
          <Link href="/how-it-works" passHref>
            <Button size="lg" variant="outline" className="font-headline text-lg tracking-wider border-gold text-ivory hover:bg-primary/10">
              See How It Works
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="absolute -bottom-20"
          variants={itemVariants}
        >
          <div className="relative mt-8 animate-pulse">
            <span className="font-body text-sm text-foreground/50">Powered by Genkit AI</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
