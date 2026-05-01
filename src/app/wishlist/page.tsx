
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore, type Product } from '@/hooks/use-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  ExternalLink,
  BellRing,
  TrendingDown,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, isInCart, isLoaded } = useStore();
  const [filter, setFilter] = useState('All');

  if (!isLoaded) return null;

  const filteredItems = filter === 'All' 
    ? wishlist 
    : wishlist.filter(item => item.platform === filter);

  return (
    <div className="min-h-screen bg-obsidian pt-[120px] pb-96 px-16 md:px-48">
      <div className="max-w-[1440px] mx-auto space-y-48">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-24 border-b border-border pb-32">
          <div className="space-y-8">
            <h1 className="text-h1">My Wishlist</h1>
            <p className="text-body-large text-ivory-3">Saved looks from your atelier sessions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-12">
            <span className="text-label text-gold bg-gold/10 px-16 py-8 rounded-pill border border-gold/20 mr-12">
              {wishlist.length} Items
            </span>
            <div className="flex gap-8 p-4 bg-obsidian-2 rounded-pill border border-border">
              {['All', 'Amazon', 'Flipkart', 'Meesho'].map(p => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={cn(
                    "px-12 py-4 rounded-pill text-[10px] uppercase font-bold tracking-widest transition-all",
                    filter === p ? "bg-gold text-obsidian shadow-gold" : "text-ivory-3 hover:text-gold"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </header>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-24">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card variant="default" className="overflow-hidden bg-obsidian-2 group h-full flex flex-col relative">
                    {/* Price Drop Indicator (Mock) */}
                    {item.price > 5000 && (
                      <div className="absolute top-12 left-12 z-10 animate-in fade-in slide-in-from-left">
                        <Badge className="bg-success text-white border-none shadow-medium gap-2 px-12 py-4">
                          <TrendingDown size={12} />
                          <span className="text-[10px] font-bold">₹500 CHEAPER</span>
                        </Badge>
                      </div>
                    )}

                    <div className="aspect-square relative overflow-hidden">
                      <img src={item.imageUrl} className="w-full h-full object-cover transition-standard group-hover:scale-105" alt={item.name} />
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="absolute top-12 right-12 w-40 h-40 rounded-full bg-obsidian/50 backdrop-blur-md flex items-center justify-center text-gold hover:bg-rose hover:text-ivory transition-all shadow-large group/btn"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={18} strokeWidth={1.5} className="group-hover/btn:scale-110" />
                      </button>
                    </div>
                    <div className="p-24 space-y-16 flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-label text-gold">{item.brand}</p>
                          <Badge variant="outline" className="text-[8px] uppercase tracking-tighter">{item.platform}</Badge>
                        </div>
                        <h3 className="text-body font-medium truncate">{item.name}</h3>
                        <div className="flex items-baseline gap-8">
                          <p className="text-h3 text-gold">₹{item.price.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] text-ivory-3 uppercase font-bold">Free Delivery</span>
                        </div>
                      </div>

                      <div className="space-y-8 pt-16 border-t border-border">
                        <div className="flex items-center justify-between mb-8">
                          <span className="text-[10px] uppercase font-bold text-ivory-3 flex items-center gap-2">
                            <BellRing size={10} className="text-gold" /> Price Alerts
                          </span>
                          <div className="w-32 h-16 bg-gold/20 rounded-full relative p-2 cursor-pointer border border-gold/10">
                            <div className="w-12 h-12 bg-gold rounded-full absolute right-2 top-1 shadow-gold" />
                          </div>
                        </div>
                        <Button variant="primary" className="w-full h-12 shadow-gold" onClick={() => addToCart(item)}>
                          {isInCart(item.id) ? (
                            <><ShoppingBag size={14} className="mr-8 fill-obsidian" /> In Shopping Plan</>
                          ) : (
                            <><ShoppingBag size={14} className="mr-8" /> Move to Plan</>
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full h-10 group" asChild>
                          <a href={item.link} target="_blank">
                            Buy Now <ChevronRight size={14} className="ml-4 group-hover:translate-x-4 transition-transform" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-128 flex flex-col items-center text-center space-y-32">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-128 h-128 rounded-full bg-obsidian-3 flex items-center justify-center text-gold/20 relative"
            >
              <Heart size={64} strokeWidth={1} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-gold/10 rounded-full"
              />
            </motion.div>
            <div className="space-y-8">
              <h2 className="text-h2">Your wishlist is empty</h2>
              <p className="text-body-large text-ivory-3 max-w-sm">Heart any outfit during your discovery to save it here for later. We'll track prices and notify you of drops.</p>
            </div>
            <Button size="lg" asChild className="mt-16 h-14 px-32 font-headline tracking-widest shadow-gold">
              <Link href="/discover">Start Discovering <ArrowRight className="ml-8" /></Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
