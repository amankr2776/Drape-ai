'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Rocket, 
  UserCircle, 
  Scan, 
  Shirt, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  Mail,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  { id: 'start', name: 'Getting Started', icon: Rocket, count: 12 },
  { id: 'profile', name: 'Account & Profile', icon: UserCircle, count: 8 },
  { id: 'analysis', name: 'AI Analysis', icon: Scan, count: 15 },
  { id: 'outfits', name: 'Outfits & Wishlist', icon: Shirt, count: 20 },
  { id: 'billing', name: 'Billing & Pro', icon: CreditCard, count: 10 },
  { id: 'privacy', name: 'Privacy & Safety', icon: ShieldCheck, count: 9 },
];

const POPULAR = [
  { title: "How does DRAPE AI work?", category: "Getting Started" },
  { title: "What kind of photo should I upload?", category: "AI Analysis" },
  { title: "How do I set a price drop alert?", category: "Outfits" },
  { title: "Is my payment information secure?", category: "Billing" },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-obsidian pt-32 pb-40">
      <div className="container mx-auto px-6 max-w-5xl space-y-24">
        {/* Hero */}
        <header className="text-center space-y-12">
          <h1 className="text-5xl md:text-7xl font-headline text-gold leading-tight">
            How can we <br /><span className="italic text-ivory">help you?</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gold/40 group-focus-within:text-gold transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, features, or styling tips..." 
              className="h-20 pl-16 pr-8 bg-obsidian-2 border-gold/10 focus:border-gold text-xl font-headline placeholder:text-ivory-4 rounded-2xl shadow-2xl transition-all"
            />
          </div>
        </header>

        {/* Support Card */}
        <Card className="bg-gold/5 border border-gold/20 rounded-[24px] overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Mail size={32} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-headline text-gold">Need direct help?</h3>
                  <p className="text-ivory-3">Usually reply within <span className="text-gold font-bold">24 hours</span> on business days.</p>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
               <p className="text-xl font-headline text-gold underline underline-offset-8">drapeai78000@gmail.com</p>
               <Button asChild className="mt-4 bg-gold text-obsidian px-10 font-headline text-lg tracking-widest">
                  <a href="mailto:drapeai78000@gmail.com">Send Email</a>
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        <section className="space-y-10">
          <h2 className="text-3xl font-headline text-gold italic border-l-4 border-gold pl-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div 
                key={cat.id}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link href={`/help/${cat.id}`}>
                  <Card className="h-full bg-obsidian-2 border-border group-hover:border-gold/30 transition-all p-8 space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                      <cat.icon size={24} />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-headline text-ivory group-hover:text-gold transition-colors">{cat.name}</CardTitle>
                      <p className="text-[10px] uppercase tracking-widest text-ivory-4 font-bold">{cat.count} Articles Available</p>
                    </div>
                    <ArrowRight className="text-gold/20 group-hover:text-gold transition-colors" />
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-headline text-gold italic border-l-4 border-gold pl-6">Popular Conversations</h2>
            <HelpCircle className="text-gold/20 w-8 h-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {POPULAR.map((art, i) => (
              <Link 
                key={i} 
                href="/help/article"
                className="flex items-center justify-between py-6 border-b border-border hover:border-gold/30 group transition-all"
              >
                <div className="space-y-2">
                   <h3 className="text-xl font-headline text-ivory group-hover:text-gold transition-colors">{art.title}</h3>
                   <Badge variant="secondary" className="bg-obsidian-3 text-ivory-4 text-[8px] uppercase tracking-widest font-bold">
                     {art.category}
                   </Badge>
                </div>
                <ChevronRight size={18} className="text-gold/20 group-hover:text-gold transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="text-center pt-12">
           <p className="text-ivory-4 text-xs uppercase tracking-[0.4em] font-bold animate-pulse">
             ATELIER CURATORS STANDING BY
           </p>
        </div>
      </div>
    </div>
  );
}
