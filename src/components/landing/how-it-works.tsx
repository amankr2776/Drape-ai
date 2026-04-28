'use client';

import { motion } from 'framer-motion';
import { Camera, FileText, BrainCircuit, Shirt } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Upload Photo',
    description: 'Snap a full-body picture. Our AI needs just one image to work its magic.',
  },
  {
    icon: FileText,
    title: 'Enter Details',
    description: 'Tell us about the occasion, your style preferences, and any specific needs.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Analyzes',
    description: 'Our advanced algorithm processes your data to find the perfect styles for you.',
  },
  {
    icon: Shirt,
    title: 'Get Styled',
    description: 'Receive a personalized set of outfit recommendations, complete with styling tips.',
  },
];

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-card">
      <div className="container mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-headline text-primary mb-16"
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Desktop view */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2"></div>
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" style={{ transform: 'translateY(-50%) scaleX(0.9)', opacity: 0.7 }}></div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="absolute -inset-2 rounded-full bg-primary/10 blur-xl"></div>
                    <div className="relative z-10 flex items-center justify-center h-24 w-24 rounded-full bg-background border-2 border-primary">
                      <step.icon className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute -bottom-8 -right-4 font-headline text-[120px] text-primary/5 opacity-50 select-none">
                      0{index + 1}
                    </div>
                </div>
                <h3 className="text-xl font-headline font-semibold mt-4 text-ivory">{step.title}</h3>
                <p className="mt-2 text-foreground/70 max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
