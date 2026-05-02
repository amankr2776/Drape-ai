'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Instagram, 
  Twitter, 
  Send, 
  CheckCircle2, 
  Loader2,
  MessageSquare,
  ArrowUpRight
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast({
      title: "Message Dispatched",
      description: "Our curators will review your style inquiry within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-obsidian pt-32 pb-40 px-6">
      <div className="container mx-auto max-w-5xl space-y-24">
        <header className="text-center space-y-6">
          <h1 className="text-5xl md:text-8xl font-headline text-gold leading-tight">Get in <span className="italic text-ivory">touch.</span></h1>
          <p className="text-ivory-3 max-w-xl mx-auto text-lg">We're here to help you navigate the atelier. Our curators typically reply within 24 hours on business days.</p>
        </header>

        {/* Contact Method Card */}
        <Card className="bg-gold/5 border border-gold/20 rounded-[32px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
          <CardContent className="p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Mail size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-headline text-gold underline underline-offset-8 decoration-gold/30">
                  <a href="mailto:drapeai78000@gmail.com" style={{color:'#C9A84C'}}>drapeai78000@gmail.com</a>
                </p>
                <p className="text-xs uppercase tracking-widest text-ivory-4 font-bold">Official Support Dispatch</p>
              </div>
            </div>
            <Button asChild className="h-16 px-12 bg-gold text-obsidian font-headline text-xl tracking-widest hover:glow-gold">
               <a href="mailto:drapeai78000@gmail.com">Send an email</a>
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-3 space-y-10">
            <h2 className="text-3xl font-headline text-gold italic border-l-4 border-gold pl-6">Dispatch a Message</h2>
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-obsidian-2 border border-gold/10 rounded-[24px] p-12 text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-gold/10 text-gold mx-auto flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-headline text-gold">Message Sent</h3>
                  <p className="text-ivory-3 max-w-sm mx-auto">Your inquiry is in the queue. Check your inbox for a reply within 24 hours.</p>
                  <Button onClick={() => setIsSuccess(false)} variant="link" className="text-gold uppercase tracking-widest text-[10px] font-bold">
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 bg-obsidian-2 border border-border p-10 rounded-[24px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-ivory-4">Full Identity</Label>
                      <Input placeholder="Your Name" className="h-12 bg-obsidian-3 border-border focus:border-gold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-ivory-4">Email Address</Label>
                      <Input type="email" placeholder="email@example.com" className="h-12 bg-obsidian-3 border-border focus:border-gold" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-ivory-4">Inquiry Subject</Label>
                    <Select required>
                      <SelectTrigger className="h-12 bg-obsidian-3 border-border focus:border-gold">
                        <SelectValue placeholder="Select a subject..." />
                      </SelectTrigger>
                      <SelectContent className="bg-obsidian-2 border-border">
                        <SelectItem value="general">General Styling Question</SelectItem>
                        <SelectItem value="account">Account & Privacy Issue</SelectItem>
                        <SelectItem value="billing">Billing & Pro Membership</SelectItem>
                        <SelectItem value="bug">Report a Visual Glitch</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="partnership">Atelier Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-[10px] uppercase font-bold text-ivory-4">Your Message</Label>
                      <span className="text-[10px] text-ivory-4">{message.length}/1000</span>
                    </div>
                    <Textarea 
                      placeholder="Describe your inquiry with detail..." 
                      className="min-h-[150px] bg-obsidian-3 border-border focus:border-gold resize-none" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                      required
                    />
                  </div>

                  <Button disabled={isSubmitting} className="w-full h-16 bg-gold text-obsidian font-headline text-xl tracking-widest hover:glow-gold">
                    {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Dispatching...</> : <><Send size={18} className="mr-2" /> Dispatch Message</>}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Social / Quick Links Sidebar */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-8">
              <h2 className="text-3xl font-headline text-gold italic border-l-4 border-gold pl-6">Quick Answers</h2>
              <div className="space-y-4">
                {[
                  "How accurate is the AI analysis?",
                  "Is DRAPE AI free to use?",
                  "Who can see my uploaded photos?",
                  "How do I cancel my Pro plan?"
                ].map((q, i) => (
                  <Link 
                    key={i} 
                    href="/help" 
                    className="flex items-center justify-between p-5 bg-obsidian-2 border border-border rounded-xl hover:border-gold/30 transition-all group"
                  >
                    <span className="text-sm font-bold text-ivory-2 group-hover:text-gold transition-colors">{q}</span>
                    <ArrowUpRight size={16} className="text-gold/20 group-hover:text-gold" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="space-y-8">
               <h2 className="text-3xl font-headline text-gold italic border-l-4 border-gold pl-6">Follow the Atelier</h2>
               <div className="flex gap-4">
                  <a href="https://instagram.com/DrapeAI" target="_blank" className="flex-1 flex items-center justify-center gap-3 h-14 bg-obsidian-2 border border-border rounded-xl hover:border-gold/30 text-ivory-3 hover:text-gold transition-all">
                    <Instagram size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Instagram</span>
                  </a>
                  <a href="https://twitter.com/DrapeAI" target="_blank" className="flex-1 flex items-center justify-center gap-3 h-14 bg-obsidian-2 border border-border rounded-xl hover:border-gold/30 text-ivory-3 hover:text-gold transition-all">
                    <Twitter size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Twitter</span>
                  </a>
               </div>
            </section>

            <Card className="bg-obsidian-2 border-border p-8 rounded-[24px] space-y-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <MessageSquare size={100} />
               </div>
               <h4 className="text-xl font-headline text-gold">Live Concierge</h4>
               <p className="text-xs text-ivory-4 leading-relaxed font-bold uppercase tracking-widest">A real-time style concierge is currently in development for Elite Pro members.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}