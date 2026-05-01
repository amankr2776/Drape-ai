
'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import SocialProof from '@/components/landing/social-proof';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
      </motion.div>

      <main className="flex-grow">
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
      </main>
    </div>
  );
}
