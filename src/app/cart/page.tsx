'use client';

import { useState } from 'react';
import { useStore, type Product } from '@/hooks/use-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ExternalLink, 
  ChevronRight, 
  X,
  ShieldCheck,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, isLoaded } = useStore();
  const [isClearing, setIsClearing] = useState(false);

  if (!isLoaded) return null;

  const platforms = Array.from(new Set(cart.map(p => p.platform)));
  const totalItems = cart.length;
  const estimatedTotal = cart.reduce((acc, p) => acc + p.price, 0);

  const getPlatformUrl = (platform: string) => {
    switch (platform) {
      case 'Amazon': return 'https://amazon.in';
      case 'Flipkart': return 'https://flipkart.com';
      case 'Meesho': return 'https://meesho.com';
      default: return '#';
    }
  };

  return (
    <div className="min-h-screen bg-obsidian pt-[120px] pb-96 px-16 md:px-48">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-48">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-48">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-24">
            <div className="space-y-8">
              <h1 className="text-h1">Shopping Plan</h1>
              <p className="text-body-large text-ivory-3">We've organized your picks by store for effortless checkout.</p>
            </div>
            {cart.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-ivory-3 hover:text-rose gap-8">
                    <Trash2 size={16} /> Clear Entire Plan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-obsidian-2 border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gold font-headline text-2xl">Clear your shopping plan?</AlertDialogTitle>
                    <AlertDialogDescription className="text-ivory-3">
                      This will remove all {totalItems} items from your staging area. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-border text-ivory hover:bg-gold/5">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCart} className="bg-rose text-white hover:bg-rose-dim border-none">Clear Plan</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {cart.length > 0 ? (
            <div className="space-y-48">
              {platforms.map(platform => (
                <section key={platform} className="space-y-24 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="flex items-center justify-between pb-12 border-b border-border">
                    <div className="flex items-center gap-12">
                      <div className={cn("w-12 h-12 rounded-full", platform === 'Amazon' ? 'bg-[#FF9900]' : platform === 'Flipkart' ? 'bg-[#2874F0]' : 'bg-[#F43397]')} />
                      <h3 className="text-h3 font-normal">{platform} Items</h3>
                      <span className="text-label text-ivory-4 ml-8">{cart.filter(p => p.platform === platform).length} items</span>
                    </div>
                    <div className="text-label text-gold font-bold">
                      Subtotal: ₹{cart.filter(p => p.platform === platform).reduce((acc, curr) => acc + curr.price, 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="space-y-12">
                    <AnimatePresence mode="popLayout">
                      {cart.filter(p => p.platform === platform).map(item => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          className="flex gap-24 p-16 rounded-card bg-obsidian-2 border border-border group relative overflow-hidden"
                        >
                          <div className="w-80 h-80 rounded-md overflow-hidden bg-obsidian-3 shrink-0">
                            <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">{item.brand}</p>
                                <h4 className="text-body font-medium text-ivory group-hover:text-gold transition-colors">{item.name}</h4>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-8 text-ivory-4 hover:text-rose hover:bg-rose/10 rounded-full transition-all"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <p className="text-h3 text-gold">₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-end pt-12">
                    <Button 
                      variant="primary" 
                      className={cn("h-14 px-32 font-headline tracking-[0.2em] shadow-medium group", platform === 'Amazon' ? 'bg-[#FF9900] text-white hover:bg-[#FF9900]/90' : platform === 'Flipkart' ? 'bg-[#2874F0] text-white hover:bg-[#2874F0]/90' : 'bg-[#F43397] text-white hover:bg-[#F43397]/90')} 
                      asChild
                    >
                      <a href={getPlatformUrl(platform)} target="_blank" rel="noopener noreferrer">
                        Shop all on {platform} 
                        <ChevronRight size={18} className="ml-12 group-hover:translate-x-4 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="py-128 flex flex-col items-center text-center space-y-32">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-128 h-128 rounded-full bg-obsidian-3 flex items-center justify-center text-gold/20"
              >
                <ShoppingBag size={64} strokeWidth={1} />
              </motion.div>
              <div className="space-y-8">
                <h2 className="text-h2">Your shopping plan is empty</h2>
                <p className="text-body-large text-ivory-3 max-w-sm">Items in your cart are grouped by store for easier purchasing. Use our AI stylist to find your next look.</p>
              </div>
              <Button size="lg" asChild className="h-14 px-32 font-headline tracking-widest shadow-gold">
                <Link href="/results">Discover Outfits <ArrowRight className="ml-8" /></Link>
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-4 lg:sticky lg:top-[120px] h-fit">
          <Card variant="elevated" className="p-32 space-y-32 border-gold/10">
            <h3 className="text-h3 font-normal">Plan Summary</h3>
            <div className="space-y-16">
              <div className="flex justify-between text-body text-ivory-2">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="space-y-12 py-16 border-y border-border">
                {platforms.map(p => (
                  <div key={p} className="flex justify-between text-caption text-ivory-3">
                    <span className="flex items-center gap-8">
                      <div className={cn("w-2 h-2 rounded-full", p === 'Amazon' ? 'bg-[#FF9900]' : p === 'Flipkart' ? 'bg-[#2874F0]' : 'bg-[#F43397]')} />
                      {p} Items ({cart.filter(item => item.platform === p).length})
                    </span>
                    <span className="font-bold">₹{cart.filter(item => item.platform === p).reduce((acc, curr) => acc + curr.price, 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 flex justify-between items-end">
                <span className="text-label text-gold font-bold">Estimated Total</span>
                <span className="text-display text-gold">₹{estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-16">
              <div className="p-16 rounded-md bg-gold/5 border border-gold/10 flex items-start gap-12">
                <ShieldCheck size={18} className="text-gold mt-2 shrink-0" />
                <p className="text-[10px] text-ivory-3 uppercase leading-relaxed font-medium">
                  Atelier Security: We only use official marketplace links to ensure your security and best pricing.
                </p>
              </div>
              <div className="space-y-8 pt-16">
                <p className="text-label text-ivory-3 text-center mb-8">Checkout individually at each store</p>
                {platforms.map(p => (
                  <Button 
                    key={p} 
                    className={cn("w-full h-56 justify-between group", p === 'Amazon' ? 'bg-[#FF9900] hover:bg-[#FF9900]/90' : p === 'Flipkart' ? 'bg-[#2874F0] hover:bg-[#2874F0]/90' : 'bg-[#F43397] hover:bg-[#F43397]/90')} 
                    asChild
                  >
                    <a href={getPlatformUrl(p)} target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center gap-12 font-bold uppercase tracking-widest text-[10px]">
                        <Package size={16} /> Shop {p} Items
                      </span>
                      <ArrowRight size={16} className="group-hover:translate-x-8 transition-transform" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
          
          <div className="mt-24 p-24 text-center space-y-12">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-4">Secure Dispatch • Official Links • No Markup</p>
          </div>
        </aside>
      </div>
    </div>
  );
}