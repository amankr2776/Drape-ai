'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/hooks/use-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ArrowRight, ShoppingBag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, isInCart, isLoaded } = useStore();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-obsidian pt-[120px] pb-96 px-16 md:px-48">
      <div className="max-w-[1440px] mx-auto space-y-48">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-24 border-b border-border pb-32">
          <div className="space-y-8">
            <h1 className="text-h1">My Wishlist</h1>
            <p className="text-body-large text-ivory-3">Saved looks from your atelier sessions.</p>
          </div>
          <div className="flex gap-12">
            <span className="text-label text-gold bg-gold/10 px-16 py-8 rounded-pill border border-gold/20">
              {wishlist.length} Items
            </span>
          </div>
        </header>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-24">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card variant="default" className="overflow-hidden bg-obsidian-2 group h-full">
                  <div className="aspect-square relative overflow-hidden">
                    <img src={item.imageUrl} className="w-full h-full object-cover transition-standard group-hover:scale-105" alt={item.name} />
                    <button 
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-12 right-12 w-32 h-32 rounded-full bg-obsidian/50 backdrop-blur-md flex items-center justify-center text-gold hover:bg-rose hover:text-ivory transition-standard"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-24 space-y-16">
                    <div className="space-y-4">
                      <p className="text-label text-gold">{item.brand}</p>
                      <h3 className="text-body font-medium truncate">{item.name}</h3>
                      <p className="text-h3 text-gold">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="pt-16 border-t border-border space-y-8">
                      <Button variant="primary" className="w-full" onClick={() => addToCart(item)}>
                        {isInCart(item.id) ? 'Added to Plan' : 'Move to Plan'}
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <a href={item.link} target="_blank">View on {item.platform} <ExternalLink size={12} className="ml-8" /></a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-128 flex flex-col items-center text-center space-y-24">
            <div className="w-96 h-96 rounded-full bg-obsidian-3 flex items-center justify-center text-gold/30">
              <Heart size={48} />
            </div>
            <div className="space-y-8">
              <h2 className="text-h2">Your wishlist is empty</h2>
              <p className="text-body text-ivory-3 max-w-sm">Heart any outfit during your discovery to save it here for later.</p>
            </div>
            <Button size="lg" asChild className="mt-16">
              <Link href="/discover">Start Discovering</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
