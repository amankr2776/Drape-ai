'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Camera, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'occasions', title: 'Life Events', subtitle: 'What occasions do you dress for?' },
  { id: 'budget', title: 'Market Tier', subtitle: 'What is your usual budget range?' },
  { id: 'vibe', title: 'Aesthetic Vibe', subtitle: 'Pick your style resonation' },
  { id: 'details', title: 'Physique Geometry', subtitle: 'This helps our AI map your silhouette' },
  { id: 'photo', title: 'Visual DNA', subtitle: 'One photo defines your geometry' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    occasions: [] as string[],
    budget: [2000, 8000],
    vibe: '',
    height: 165,
    size: 'M',
    photo: null as string | null
  });
  const router = useRouter();

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else router.push('/analyze');
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateData = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
      {/* Fixed Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-border" 
        style={{ zIndex: 'var(--z-navbar)' }}
      >
        <motion.div 
          className="h-full bg-gold shadow-gold-glow"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content Area - Centered & Fixed */}
      <div className="flex-1 flex flex-col items-center justify-center p-24 md:p-48">
        <div className="w-full max-w-[560px] relative">
          {/* Background Step Number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] font-headline text-primary opacity-[0.03] select-none pointer-events-none z-0">
            0{step + 1}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-48 text-center relative z-10"
            >
              <div className="space-y-12">
                <h1 className="text-h1 text-gold leading-tight">{STEPS[step].title}</h1>
                <p className="text-lg text-ivory-3">{STEPS[step].subtitle}</p>
              </div>

              <div className="py-24">
                {step === 0 && (
                  <div className="flex flex-wrap gap-12 justify-center max-w-[640px] mx-auto">
                    {['Wedding', 'Office', 'Date Night', 'Festive', 'Casual', 'Travel'].map(occ => (
                      <button
                        key={occ}
                        onClick={() => {
                          const next = formData.occasions.includes(occ) 
                            ? formData.occasions.filter(o => o !== occ)
                            : [...formData.occasions, occ];
                          updateData('occasions', next);
                        }}
                        className={cn(
                          "h-[48px] px-24 rounded-pill border text-[12px] font-bold tracking-widest transition-all uppercase",
                          formData.occasions.includes(occ) 
                            ? "bg-gold/10 border-gold text-gold" 
                            : "bg-white/5 border-white/10 text-ivory-4 hover:border-white/30"
                        )}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-32">
                    <div className="flex justify-between text-h3 text-gold">
                      <span>₹{formData.budget[0]}</span>
                      <span>₹{formData.budget[1]}+</span>
                    </div>
                    <Slider 
                      min={500} 
                      max={20000} 
                      step={500} 
                      value={formData.budget} 
                      onValueChange={(v) => updateData('budget', v)}
                      className="py-16"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-2 gap-16">
                    {['Minimalist', 'Ethnic Fusion', 'Bohemian', 'Contemporary'].map(v => (
                      <button
                        key={v}
                        onClick={() => updateData('vibe', v)}
                        className={cn(
                          "p-16 rounded-card border transition-all text-left",
                          formData.vibe === v ? "bg-gold/10 border-gold" : "bg-white/5 border-white/10"
                        )}
                      >
                        <div className="aspect-[4/5] bg-obsidian-3 rounded-md mb-12 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${v}/300/400`} className="w-full h-full object-cover grayscale opacity-40" alt={v} />
                        </div>
                        <p className={cn("text-[10px] uppercase font-bold tracking-widest", formData.vibe === v ? "text-gold" : "text-ivory-4")}>{v}</p>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-32 text-left">
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gold">Height (cm)</label>
                        <Input type="number" defaultValue={formData.height} className="h-14 bg-white/5 border-white/10" onChange={e => updateData('height', e.target.value)} />
                    </div>
                    <div className="space-y-8">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gold">Body Size</p>
                      <div className="flex gap-8">
                        {['S', 'M', 'L', 'XL'].map(s => (
                          <button
                            key={s}
                            onClick={() => updateData('size', s)}
                            className={cn(
                              "flex-1 h-14 rounded border font-bold transition-all",
                              formData.size === s ? "bg-gold text-obsidian border-gold" : "border-white/10 text-ivory-4 hover:border-white/30"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-32">
                    <div className="w-full aspect-square rounded-card border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-gold/30 transition-all">
                      <div className="p-24 rounded-full bg-gold/10 mb-16">
                        <Camera size={40} className="text-gold" />
                      </div>
                      <p className="text-h3 text-gold">Upload Portrait</p>
                      <p className="text-sm text-ivory-4 mt-8">Full body, neutral background</p>
                    </div>
                    <div className="flex items-center justify-center gap-16 text-[10px] uppercase font-bold text-ivory-4 tracking-widest">
                      <span className="flex items-center gap-4"><Check size={12} className="text-gold" /> Encrypted</span>
                      <span className="flex items-center gap-4"><Check size={12} className="text-gold" /> Private</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-24 md:p-32 flex justify-between items-center bg-gradient-to-t from-background via-background to-transparent"
        style={{ zIndex: 'var(--z-navbar)' }}
      >
        <div className="max-w-[560px] mx-auto w-full flex justify-between gap-16">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={step === 0}
            className={cn("h-14 px-32 flex-1 sm:flex-none uppercase tracking-widest text-[10px] font-bold border-white/10", step === 0 && "opacity-0 pointer-events-none")}
          >
            <ArrowLeft className="mr-8 w-4 h-4" /> Back
          </Button>
          <Button 
            onClick={handleNext} 
            className="h-14 px-48 flex-1 sm:flex-none uppercase tracking-widest text-[10px] font-bold shadow-gold"
          >
            {step === STEPS.length - 1 ? 'Begin Analysis' : 'Continue'}
            <ArrowRight className="ml-8 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
