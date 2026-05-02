'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAction = () => {
    if (isAuthenticated) {
      router.push('/analyze');
    } else {
      router.push('/login?redirect=/analyze');
    }
  };

  const scrollToWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

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

        <div className="flex flex-col items-center gap-4 pointer-events-auto">
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
            <Button 
              onClick={handleAction}
              size="lg" 
              className="h-[56px] flex-1 font-body text-[14px] font-bold tracking-[0.08em] uppercase bg-gradient-to-r from-gold to-gold-light text-obsidian rounded-[10px] border-none shadow-[0_8px_32px_rgba(201,168,76,0.35)] hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(201,168,76,0.45)] transition-all duration-300 group"
            >
              Analyze My Style — It's Free
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-[4px]" />
            </Button>
            <Button 
              onClick={scrollToWorks}
              variant="outline" 
              size="lg" 
              className="h-[56px] flex-1 font-body text-[14px] font-bold tracking-[0.08em] uppercase text-primary border-[rgba(201,168,76,0.35)] rounded-[10px] bg-transparent hover:border-gold hover:bg-[rgba(201,168,76,0.06)] hover:translate-y-[-1px] transition-all duration-300"
            >
              See How It Works
            </Button>
          </motion.div>
          <motion.p variants={itemVariants} className="text-[11px] text-ivory-3 tracking-[0.05em] uppercase font-medium">
            No credit card required · Free forever
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
