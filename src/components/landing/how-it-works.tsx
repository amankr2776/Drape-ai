'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, FilePenLine, BrainCircuit, Shirt, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const steps = [
  {
    icon: Camera,
    title: 'Upload Photo',
    description: 'Snap a full-body picture. Our AI needs just one image to define your geometry.',
  },
  {
    icon: FilePenLine,
    title: 'Enter Details',
    description: 'Tell us the occasion, your style preference, and your aspirational vibe.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Analyzes',
    description: 'Our Groq-powered engine correlates your data with 50,000+ fashion permutations.',
  },
  {
    icon: Shirt,
    title: 'Get Styled',
    description: 'Receive a curated editorial report with shoppable links at best-market prices.',
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  const handleStart = () => {
    router.push(isAuthenticated ? '/analyze' : '/login?redirect=/analyze');
  };

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 md:py-40 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="font-headline text-5xl md:text-7xl text-primary mb-4">The Atelier Process</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-[48px] left-[12.5%] right-[12.5%] h-px bg-border z-0">
            <motion.div 
              style={{ scaleX: pathLength, originX: 0 }}
              className="absolute inset-0 bg-primary h-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-10">
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                  <div className="relative w-24 h-24 rounded-full bg-background border border-primary/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:border-primary">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-headline text-[120px] text-primary/5 opacity-50 -z-10 select-none">
                    0{index + 1}
                  </div>
                </div>
                <h3 className="font-headline text-2xl text-foreground mb-4">{step.title}</h3>
                <p className="font-body text-foreground/60 leading-relaxed max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12 md:mt-24"
        >
          <Button 
            onClick={handleStart}
            size="lg"
            className="h-14 px-10 bg-gradient-to-r from-gold to-gold-light text-obsidian font-bold uppercase tracking-widest text-sm rounded-[10px] shadow-[0_8px_24px_rgba(201,168,76,0.3)] hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(201,168,76,0.4)] transition-all group"
          >
            Start For Free
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
