'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Ethnic Wear', count: 1240, img: 'https://picsum.photos/seed/ethnic/400/500' },
  { name: 'Western Fusion', count: 850, img: 'https://picsum.photos/seed/western/400/500' },
  { name: 'Formal Attire', count: 620, img: 'https://picsum.photos/seed/formal/400/500' },
  { name: 'Festive Look', count: 2100, img: 'https://picsum.photos/seed/festive/400/500' },
];

const TRENDING = [
  { id: 't1', name: 'Zari Silk Set', price: '₹4,500', img: 'https://picsum.photos/seed/t1/300/400' },
  { id: 't2', name: 'Linen Blazer', price: '₹2,800', img: 'https://picsum.photos/seed/t2/300/400' },
  { id: 't3', name: 'Bandhani Gown', price: '₹12,400', img: 'https://picsum.photos/seed/t3/300/400' },
  { id: 't4', name: 'Modern Jutti', price: '₹1,200', img: 'https://picsum.photos/seed/t4/300/400' },
];

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-obsidian pb-96">
      {/* Hero */}
      <section className="h-[40vh] relative flex flex-col items-center justify-center overflow-hidden px-24">
        <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-32 text-center relative z-10"
        >
          <h1 className="text-h1 text-gold">Discover Your Next Look</h1>
          <div className="relative">
            <Search className="absolute left-16 top-1/2 -translate-y-1/2 text-gold/50" />
            <Input 
              placeholder="Search sarees, kurtas, formal wear..." 
              className="pl-48 h-56 bg-obsidian-2/50 backdrop-blur-md border-gold/20 text-lg"
            />
          </div>
        </motion.div>
      </section>

      <div className="max-w-[1440px] mx-auto px-16 md:px-48 space-y-64">
        {/* Category Grid */}
        <section className="space-y-24">
          <div className="flex justify-between items-end">
            <h2 className="text-h2">Curated Collections</h2>
            <Link href="#" className="text-label text-gold hover:text-gold-light transition-standard flex items-center gap-8">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-[4/5] rounded-card overflow-hidden cursor-pointer"
              >
                <img src={cat.img} className="w-full h-full object-cover transition-standard group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0" alt={cat.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-24 left-24 right-24 space-y-4">
                  <p className="text-h3 leading-tight">{cat.name}</p>
                  <p className="text-label text-gold/70">{cat.count} items</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="space-y-24">
          <div className="flex items-center gap-12">
            <Sparkles className="text-gold" />
            <h2 className="text-h2">Trending This Week</h2>
          </div>
          <div className="flex gap-16 overflow-x-auto scrollbar-hide pb-16">
            {TRENDING.map((item) => (
              <Card key={item.id} variant="interactive" className="min-w-[240px] border-none bg-obsidian-2 group">
                <div className="aspect-[3/4] overflow-hidden rounded-t-card">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-standard" alt={item.name} />
                </div>
                <div className="p-16 space-y-4">
                  <h3 className="text-body font-medium">{item.name}</h3>
                  <p className="text-h3 text-gold">{item.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Body Type Filter Teaser */}
        <section className="p-48 rounded-card bg-gold/5 border border-gold/10 flex flex-col lg:flex-row items-center justify-between gap-32">
          <div className="space-y-8 max-w-xl">
            <h2 className="text-h2 text-gold">Styled for your silhouette</h2>
            <p className="text-body-large text-ivory-2 leading-relaxed">
              We've analyzed 50,000+ data points to understand which silhouettes flatter each Indian body type. Upload your photo for a bespoke styling report.
            </p>
            <Button size="lg" className="mt-16" asChild>
              <Link href="/onboarding">Get Bespoke Analysis</Link>
            </Button>
          </div>
          <div className="flex gap-16 items-end">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={cn("w-32 h-96 bg-gold/10 rounded-pill border border-gold/20 flex items-center justify-center", i === 3 && "h-[128px] bg-gold/20 border-gold/40")}>
                <div className="w-8 h-8 rounded-full bg-gold/40" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
