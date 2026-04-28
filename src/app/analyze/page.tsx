'use client';

import { useState, useEffect, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ScanLine, Bot, Palette, ShoppingCart, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const analysisSteps = [
  { text: 'Scanning your photo...', icon: ScanLine },
  { text: 'Detecting body shape...', icon: User },
  { text: 'Reading your skin tone...', icon: Palette },
  { text: 'Consulting style database...', icon: Bot },
  { text: 'Fetching live prices...', icon: ShoppingCart },
  { text: 'Generating your report...', icon: CheckCircle },
];

const TOTAL_DURATION = 10000; // 10 seconds
const STEP_DURATION = TOTAL_DURATION / analysisSteps.length;

export default function AnalyzePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (currentStep < analysisSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, STEP_DURATION);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        router.push('/results');
      }, STEP_DURATION);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, router]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* User Photo with Scanner */}
        <div className="relative w-full aspect-[3/4] mb-8 rounded-lg overflow-hidden border-2 border-primary/50">
          <Image
            src="https://picsum.photos/seed/user-photo/600/800"
            alt="User for analysis"
            fill
            className="object-cover"
            data-ai-hint="full body portrait"
          />
          <AnimatePresence>
            {currentStep === 0 && (
              <motion.div
                className="absolute top-0 left-0 w-full h-2 bg-primary/70 shadow-[0_0_20px_theme(colors.primary)]"
                initial={{ y: -10 }}
                animate={{ y: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: STEP_DURATION / 1000, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </AnimatePresence>
           {/* Body landmark dots for phase 1 */}
            {currentStep >= 0 && currentStep < 2 && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="absolute top-[20%] left-[48%] w-3 h-3 bg-primary rounded-full animate-pulse" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.4 } }} className="absolute top-[35%] left-[30%] w-3 h-3 bg-primary rounded-full animate-pulse" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} className="absolute top-[35%] left-[66%] w-3 h-3 bg-primary rounded-full animate-pulse" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.8 } }} className="absolute top-[50%] left-[48%] w-3 h-3 bg-primary rounded-full animate-pulse" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.0 } }} className="absolute top-[65%] left-[40%] w-3 h-3 bg-primary rounded-full animate-pulse" />
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.2 } }} className="absolute top-[65%] left-[56%] w-3 h-3 bg-primary rounded-full animate-pulse" />
              </>
            )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-border h-1 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="bg-primary h-1"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
            transition={{ duration: STEP_DURATION / 1000, ease: 'linear' }}
          />
        </div>
        
        {/* Status Text */}
        <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="flex items-center gap-3 text-lg text-foreground/80 font-headline"
                >
                    {createElement(analysisSteps[currentStep].icon, { className: "w-6 h-6 text-primary animate-pulse" })}
                    <span>{analysisSteps[currentStep].text}</span>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Dynamic content for each phase */}
        <div className="h-24 mt-4 flex items-center justify-center">
             <AnimatePresence mode="wait">
                {currentStep === 1 && (
                     <motion.div key="shape" initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}} className="text-center">
                        <p className="text-primary text-xl font-headline">Pear Shape Detected</p>
                    </motion.div>
                )}
                 {currentStep === 2 && (
                     <motion.div key="skin" initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#A67A5B] border-4 border-primary"></div>
                        <p className="text-primary text-xl font-headline">Warm Undertone</p>
                    </motion.div>
                )}
                 {currentStep === 3 && (
                    <motion.div key="db" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-center">
                         <p className="text-foreground/70">Analyzing 50,000+ outfit combinations...</p>
                    </motion.div>
                 )}
                 {currentStep === 4 && (
                     <motion.div key="prices" initial={{opacity: 0, transition: {staggerChildren: 0.3}}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex gap-4 text-foreground/80 font-headline">
                        <motion.span initial={{y:10, opacity:0}} animate={{y:0, opacity:1}}>Amazon</motion.span>
                        <motion.span initial={{y:10, opacity:0}} animate={{y:0, opacity:1}}>Flipkart</motion.span>
                        <motion.span initial={{y:10, opacity:0}} animate={{y:0, opacity:1}}>Meesho</motion.span>
                    </motion.div>
                 )}
             </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
