'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Twitter, 
  Instagram, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
    toast({
      title: "Message Dispatched",
      description: "Our curators will review your inquiry within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-20 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-headline text-primary"
          >
            Let's Talk Style
          </motion.h1>
          <p className="text-foreground/40 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            Whether you have a query about your silhouette analysis or a partnership proposal, 
            our atelier is always open for conversation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
          {/* Contact Info Sidebar */}
          <aside className="lg:col-span-2 space-y-12">
            <div className="space-y-8">
              {[
                { 
                  icon: Mail, 
                  label: 'Email Dispatch', 
                  val: 'hello@drapeai.in', 
                  desc: 'Average response: 24 hours' 
                },
                { 
                  icon: Twitter, 
                  label: 'Twitter Atelier', 
                  val: '@DrapeAI', 
                  desc: 'Direct Message for quick tips' 
                },
                { 
                  icon: MapPin, 
                  label: 'Registered Office', 
                  val: 'Indiranagar, Bangalore', 
                  desc: 'Karnataka, India 🇮🇳' 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">{item.label}</p>
                    <p className="text-xl font-headline text-primary">{item.val}</p>
                    <p className="text-xs text-foreground/20 mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/10 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MessageSquare size={120} />
              </div>
              <h3 className="font-headline text-3xl text-primary mb-4 relative z-10">Quick Answers?</h3>
              <p className="text-sm text-foreground/60 mb-8 relative z-10">
                Our help center contains detailed guides on body shape detection, billing, and privacy.
              </p>
              <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-primary-foreground relative z-10 font-headline tracking-widest">
                <Link href="/help">Visit Help Center <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </Card>
          </aside>

          {/* Contact Form */}
          <main className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card/40 border border-primary/10 rounded-3xl p-12 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 size={48} className="animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-headline text-primary">Message Dispatched</h2>
                  <p className="text-foreground/60 leading-relaxed max-w-sm">
                    Your inquiry has been successfully transmitted to our curation team. 
                    Expect a response in your inbox shortly.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} variant="ghost" className="text-primary uppercase tracking-widest text-xs">
                    Send Another Inquiry
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card/40 border border-primary/10 rounded-3xl p-8 md:p-12"
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-widest text-foreground/50">Full Name</Label>
                        <Input 
                          placeholder="Your identity..." 
                          className="h-14 bg-background/50 border-primary/10 focus:border-primary"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-widest text-foreground/50">Email Address</Label>
                        <Input 
                          type="email" 
                          placeholder="email@example.com" 
                          className="h-14 bg-background/50 border-primary/10 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-foreground/50">Inquiry Subject</Label>
                      <Select required>
                        <SelectTrigger className="h-14 bg-background/50 border-primary/10 focus:border-primary">
                          <SelectValue placeholder="Select a reason..." />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-primary/10">
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="partnership">Partnership Proposal</SelectItem>
                          <SelectItem value="press">Press & Media</SelectItem>
                          <SelectItem value="feedback">Product Feedback</SelectItem>
                          <SelectItem value="account">Account Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs uppercase tracking-widest text-foreground/50">Your Message</Label>
                        <span className={`text-[10px] tracking-widest ${message.length > 450 ? 'text-accent' : 'text-foreground/20'}`}>
                          {message.length} / 500
                        </span>
                      </div>
                      <Textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        placeholder="Tell us what's on your mind..." 
                        className="min-h-[200px] bg-background/50 border-primary/10 focus:border-primary resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <Button 
                      disabled={isSubmitting}
                      className="w-full h-16 font-headline text-xl tracking-[0.2em] bg-primary text-primary-foreground hover:glow-gold transition-all duration-500"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 animate-spin" /> DISPATCHING...</>
                      ) : (
                        <><Send className="mr-2 w-5 h-5" /> DISPATCH MESSAGE</>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
