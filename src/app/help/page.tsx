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
  ChevronDown,
  Sparkles,
  ArrowRight,
  LifeBuoy
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
  { id: 'outfits', name: 'Outfits & Styles', icon: Shirt, count: 20 },
  { id: 'billing', name: 'Billing & Pro', icon: CreditCard, count: 10 },
  { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheck, count: 9 },
];

const POPULAR_ARTICLES = [
  { id: 'body-shape', title: 'How does body shape detection work?', time: '4 min' },
  { id: 'not-loading', title: 'Why are my outfit suggestions not loading?', time: '2 min' },
  { id: 'cancel-pro', title: 'How to manage or cancel my Pro subscription', time: '3 min' },
  { id: 'delete-data', title: 'How to permanently delete my account and data', time: '5 min' },
  { id: 'platforms', title: 'Which Indian marketplaces does DRAPE AI support?', time: '2 min' },
  { id: 'accuracy', title: 'How accurate is the skin tone matching?', time: '4 min' },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredArticles = searchQuery.length > 2 
    ? POPULAR_ARTICLES.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <header className="text-center mb-16 space-y-8">
           <Badge variant="outline" className="py-1 px-4 border-primary/20 text-primary tracking-[0.2em] uppercase text-[10px]">
             Atelier Support
           </Badge>
           <h1 className="text-6xl md:text-8xl font-headline text-primary leading-tight">
             How Can We <br /><span className="italic text-foreground">Help You?</span>
           </h1>
           
           <div className="max-w-2xl mx-auto relative group mt-12">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40 group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearching(true)}
                placeholder="Search for articles, features, or troubleshooting..." 
                className="h-20 pl-16 pr-8 bg-card/60 backdrop-blur-xl border-primary/10 focus:border-primary text-xl font-headline placeholder:text-foreground/20 rounded-2xl shadow-2xl transition-all"
              />
              
              <AnimatePresence>
                {searchQuery.length > 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-4 bg-card border border-primary/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {filteredArticles.length > 0 ? (
                      <div className="divide-y divide-primary/5">
                        {filteredArticles.map(a => (
                          <Link 
                            key={a.id} 
                            href={`/help/${a.id}`}
                            className="flex items-center justify-between p-6 hover:bg-primary/5 transition-colors group"
                          >
                            <span className="text-lg font-headline text-foreground/80 group-hover:text-primary">{a.title}</span>
                            <ChevronRight size={16} className="text-primary/40" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center text-foreground/20 italic">
                        No articles matching your inquiry found.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </header>

        {/* Categories */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/help/category/${cat.id}`}>
                <Card className="h-full bg-card/40 border-primary/10 hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <cat.icon size={80} />
                  </div>
                  <CardHeader className="pt-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <cat.icon size={24} />
                    </div>
                    <CardTitle className="text-2xl font-headline text-primary">{cat.name}</CardTitle>
                    <p className="text-xs uppercase tracking-widest text-foreground/30 mt-2 font-bold">{cat.count} Articles</p>
                  </CardHeader>
                  <CardContent>
                    <Button variant="link" className="p-0 text-foreground/40 group-hover:text-primary transition-colors text-xs uppercase tracking-widest">
                      Explore Collection <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Popular Articles */}
        <section className="space-y-12">
          <div className="flex items-end justify-between border-b border-primary/10 pb-6">
             <div className="space-y-2">
                <h2 className="text-4xl font-headline text-primary">Popular Conversations</h2>
                <p className="text-foreground/40 text-xs uppercase tracking-widest">Most frequently referenced help articles</p>
             </div>
             <Sparkles className="text-primary/20 w-8 h-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {POPULAR_ARTICLES.map((article, i) => (
              <Link 
                key={article.id} 
                href={`/help/${article.id}`}
                className="flex items-center justify-between py-6 border-b border-primary/5 hover:border-primary/20 group transition-all"
              >
                <div className="space-y-1">
                   <h3 className="text-xl font-headline group-hover:text-primary transition-colors">{article.title}</h3>
                   <span className="text-[10px] uppercase tracking-widest text-foreground/20">{article.time} reading session</span>
                </div>
                <ChevronRight size={18} className="text-foreground/10 group-hover:text-primary group-hover:translate-x-2 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <section className="mt-32 p-12 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/10 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <LifeBuoy className="w-16 h-16 text-primary/40 mx-auto animate-spin-slow" />
          <div className="space-y-2">
            <h2 className="text-4xl font-headline">Still Seeking Clarity?</h2>
            <p className="text-foreground/60 max-w-lg mx-auto leading-relaxed">
              If your inquiry is unique, our human curators are standing by to assist you directly in the atelier.
            </p>
          </div>
          <Button asChild size="lg" className="h-16 px-12 font-headline text-xl tracking-widest bg-primary text-primary-foreground">
            <Link href="/contact">Message Support Dispatch</Link>
          </Button>
        </section>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
