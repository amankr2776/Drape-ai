'use client';

import { useStore, type Product } from '@/hooks/use-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Trash2, ArrowRight, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, isLoaded } = useStore();

  if (!isLoaded) return null;

  const platforms = Array.from(new Set(cart.map(p => p.platform)));
  const total = cart.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="min-h-screen bg-obsidian pt-[120px] pb-96 px-16 md:px-48">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-48">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-48">
          <div className="space-y-8">
            <h1 className="text-h1">Shopping Plan</h1>
            <p className="text-body-large text-ivory-3">We've organized your picks by store for effortless checkout.</p>
          </div>

          {cart.length > 0 ? (
            <div className="space-y-32">
              {platforms.map(platform => (
                <section key={platform} className="space-y-16">
                  <div className="flex items-center gap-12 pb-8 border-b border-gold/10">
                    <div className="w-8 h-8 rounded-full bg-gold" />
                    <h3 className="text-label text-gold">{platform} Picks</h3>
                  </div>
                  <div className="space-y-12">
                    {cart.filter(p => p.platform === platform).map(item => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-24 p-16 rounded-card bg-obsidian-2 border border-border group"
                      >
                        <div className="w-80 h-80 rounded-button overflow-hidden bg-obsidian-3">
                          <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-label text-gold/60">{item.brand}</p>
                              <h4 className="text-body font-medium">{item.name}</h4>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-ivory-4 hover:text-rose transition-standard"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-h3 text-gold">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-8">
                    <Button variant="secondary" size="sm" asChild>
                      <a href="#" target="_blank">Shop all on {platform} <ArrowRight size={14} className="ml-8" /></a>
                    </Button>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="py-128 flex flex-col items-center text-center space-y-24">
              <div className="w-96 h-96 rounded-full bg-obsidian-3 flex items-center justify-center text-gold/30">
                <ShoppingBag size={48} />
              </div>
              <div className="space-y-8">
                <h2 className="text-h2">Your plan is empty</h2>
                <p className="text-body text-ivory-3 max-w-sm">Items in your cart will be grouped by store for easier purchasing.</p>
              </div>
              <Button size="lg" asChild className="mt-16">
                <Link href="/results">Discover Outfits</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-4 lg:sticky lg:top-[120px] h-fit">
          <Card variant="elevated" className="p-32 space-y-32">
            <h3 className="text-h3">Plan Summary</h3>
            <div className="space-y-16">
              <div className="flex justify-between text-body text-ivory-2">
                <span>Total Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="space-y-8">
                {platforms.map(p => (
                  <div key={p} className="flex justify-between text-caption text-ivory-3">
                    <span>{p} items</span>
                    <span>₹{cart.filter(item => item.platform === p).reduce((acc, curr) => acc + curr.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="pt-16 border-t border-border flex justify-between items-end">
                <span className="text-label text-gold">Estimated Total</span>
                <span className="text-h1 text-gold">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-12">
              <p className="text-[10px] text-ivory-3 uppercase tracking-wider text-center px-24">
                Note: Prices are determined by each platform and may vary.
              </p>
              <div className="space-y-8">
                {platforms.map(p => (
                  <Button key={p} className="w-full h-48 justify-between group" variant="primary">
                    Shop {p} Items <ChevronRight size={16} className="group-hover:translate-x-4 transition-standard" />
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
