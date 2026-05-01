'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DrapeLogo } from './drape-logo';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'prompt' | 'form' | 'success'>('prompt');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setStep('success');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary/5 p-6 border-b border-primary/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-primary leading-none">Atelier Concierge</h3>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">Typically replies in 2h</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground/40 hover:text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 flex-grow">
              <AnimatePresence mode="wait">
                {step === 'prompt' && (
                  <motion.div 
                    key="prompt"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <p className="text-sm text-foreground/60 leading-relaxed italic">
                      "Welcome to the DRAPE AI concierge. How may we assist your styling journey today?"
                    </p>
                    <div className="space-y-2">
                       {['Help with my measurements', 'Billing inquiry', 'Styling suggestion feedback'].map(q => (
                         <button 
                          key={q}
                          onClick={() => setStep('form')}
                          className="w-full text-left p-3 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest"
                         >
                           {q}
                         </button>
                       ))}
                    </div>
                  </motion.div>
                )}

                {step === 'form' && (
                  <motion.form 
                    key="form"
                    onSubmit={handleSend}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Input placeholder="Your Name" className="bg-card/50 border-primary/10 h-12" required />
                      <Input type="email" placeholder="Your Email" className="bg-card/50 border-primary/10 h-12" required />
                      <textarea 
                        placeholder="Your inquiry..." 
                        className="w-full min-h-[120px] rounded-md border border-primary/10 bg-card/50 p-3 text-sm focus:border-primary outline-none resize-none"
                        required
                      />
                    </div>
                    <Button disabled={isSending} className="w-full h-12 font-headline tracking-widest bg-primary text-primary-foreground">
                      {isSending ? <Loader2 className="animate-spin" /> : 'DISPATCH MESSAGE'}
                    </Button>
                  </motion.form>
                )}

                {step === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="text-center space-y-6 py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
                      <Send size={24} />
                    </div>
                    <div>
                      <h4 className="font-headline text-2xl text-primary">Dispatch Successful</h4>
                      <p className="text-xs text-foreground/40 mt-2 leading-relaxed">Our concierge will contact you via email as soon as possible.</p>
                    </div>
                    <Button variant="ghost" onClick={() => setStep('prompt')} className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">
                      Close Atelier
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-primary/5 text-center">
              <p className="text-[8px] uppercase tracking-[0.5em] text-foreground/20">DRAPE AI • POWERED BY AI • CURATED BY HUMANS</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 90 } : {}}
        className="w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center group relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X key="x" /> : <MessageSquare key="msg" />}
        </AnimatePresence>
        {!isOpen && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-primary rounded-full -z-10"
          />
        )}
      </motion.button>
    </div>
  );
}
