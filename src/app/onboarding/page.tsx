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
  { id: 'occasions', title: 'What occasions do you dress for?', subtitle: 'We\'ll tailor our suggestions to your lifestyle.' },
  { id: 'budget', title: 'What\'s your usual budget?', subtitle: 'We track prices across Amazon, Flipkart, and Meesho.' },
  { id: 'vibe', title: 'Pick your style vibe', subtitle: 'Choose the aesthetic that resonates with you.' },
  { id: 'details', title: 'A few final details', subtitle: 'This helps our AI map your geometry.' },
  { id: 'photo', title: 'Show us you', subtitle: 'One photo is all we need to define your silhouette.' },
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Onboarding Progress Bar (Fixed at top) */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-border" 
        style={{ zIndex: 'var(--z-sticky-bar)' }}
      >
        <motion.div 
          className="h-full bg-gold"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-16 md:px-24 pt-24 pb-32">
        <div className="w-full max-w-xl">
          {/* Progress Dots (FIX 5) */}
          <div className="flex gap-[6px] mb-48 justify-center items-center">
            {STEPS.map((_, i) => (
              <motion.div 
                key={i} 
                initial={false}
                animate={{ 
                  width: i === step ? 24 : 6,
                  backgroundColor: i === step ? '#C9A84C' : i < step ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.25)'
                }}
                className="h-[6px] rounded-full transition-all duration-300" 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-32 text-center"
            >
              <div className="space-y-8">
                <h1 className="text-h1 text-gold">{STEPS[step].title}</h1>
                <p className="text-body-large text-ivory-3">{STEPS[step].subtitle}</p>
              </div>

              <div className="py-24">
                {step === 0 && (
                  <div className="flex flex-wrap gap-12 justify-center max-w-[640px] mx-auto">
                    {['Wedding', 'Office', 'Date Night', 'Festive', 'Gym', 'Casual', 'Travel'].map(occ => (
                      <button
                        key={occ}
                        onClick={() => {
                          const next = formData.occasions.includes(occ) 
                            ? formData.occasions.filter(o => o !== occ)
                            : [...formData.occasions, occ];
                          updateData('occasions', next);
                        }}
                        className={cn(
                          "h-[48px] px-28 rounded-[100px] border text-[13px] font-body tracking-[0.04em] transition-all duration-200 active:scale-[0.97] appearance-none outline-none cursor-pointer",
                          formData.occasions.includes(occ) 
                            ? "bg-[rgba(201,168,76,0.15)] border-gold text-gold font-semibold shadow-[0_0_12px_rgba(201,168,76,0.15)_inset]" 
                            : "bg-[rgba(201,168,76,0.04)] border-[rgba(201,168,76,0.2)] text-ivory-2 hover:border-[rgba(201,168,76,0.45)] hover:bg-[rgba(201,168,76,0.08)] hover:text-ivory hover:translate-y-[-1px]",
                          !formData.occasions.includes(occ) && "font-medium"
                        )}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-24">
                    <div className="flex justify-between text-h3 font-normal text-gold">
                      <span>₹{formData.budget[0]}</span>
                      <span>₹{formData.budget[1]}+</span>
                    </div>
                    <Slider 
                      min={500} 
                      max={20000} 
                      step={500} 
                      value={formData.budget} 
                      onValueChange={(v) => updateData('budget', v)}
                      className="py-12"
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
                          "p-24 rounded-card border transition-all duration-300 text-left group active:scale-[0.97] appearance-none outline-none cursor-pointer",
                          formData.vibe === v ? "bg-gold/10 border-gold shadow-gold" : "bg-obsidian-2 border-border"
                        )}
                      >
                        <div className="w-full aspect-[4/5] bg-obsidian-3 rounded-card mb-12 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${v}/300/400`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={v} />
                        </div>
                        <p className={cn("text-label", formData.vibe === v ? "text-gold" : "text-ivory-2")}>{v}</p>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-24 text-left">
                    <Input label="Height (cm)" type="number" defaultValue={formData.height} onChange={e => updateData('height', e.target.value)} />
                    <div className="space-y-8">
                      <p className="text-label text-gold">Body Size</p>
                      <div className="flex gap-8">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                          <button
                            key={s}
                            onClick={() => updateData('size', s)}
                            className={cn(
                              "flex-1 h-48 rounded-[8px] border font-semibold transition-all duration-200 active:scale-[0.97] appearance-none outline-none cursor-pointer",
                              formData.size === s ? "bg-gold text-obsidian border-gold" : "border-border text-ivory-2 hover:border-gold/30 hover:bg-gold/5"
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
                  <div className="space-y-24">
                    <div className="w-full aspect-square rounded-card border-2 border-dashed border-gold/30 bg-gold/5 flex flex-col items-center justify-center cursor-pointer hover:bg-gold/10 transition-all group">
                      <div className="p-24 rounded-full bg-gold/20 mb-12 group-hover:scale-110 transition-all">
                        <Camera size={32} className="text-gold" />
                      </div>
                      <p className="text-h3 text-gold">Upload your photo</p>
                      <p className="text-caption text-ivory-3 mt-4">Full body, natural lighting works best</p>
                    </div>
                    <div className="flex items-center justify-center gap-8 text-caption text-ivory-3">
                      <span className="flex items-center gap-4"><Check size={12} className="text-success" /> Encrypted</span>
                      <span className="flex items-center gap-4"><Check size={12} className="text-success" /> Private</span>
                      <span className="flex items-center gap-4"><Check size={12} className="text-success" /> Ephemeral</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnPresence>
        </div>
      </div>

      {/* Bottom Navigation Bar (PART 12 FIX) */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-obsidian border-t border-border px-16 md:px-24 py-16 flex items-center justify-center"
        style={{ zIndex: 'var(--z-navbar)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}
      >
        <div className="w-full max-w-xl flex items-center justify-between gap-12">
          {step > 0 ? (
            <>
              <Button 
                variant="secondary" 
                onClick={handleBack} 
                className="flex-1 sm:flex-none h-12 px-8 min-w-[120px]"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 sm:min-w-[200px] sm:max-w-[260px] h-12 group"
              >
                {step === STEPS.length - 1 ? 'Start Analysis' : 'Continue'} 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-[4px]" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleNext} 
              className="w-full sm:w-auto sm:min-w-[240px] sm:max-w-[260px] h-12 mx-auto group"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-[4px]" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
