'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Filter, 
  SlidersHorizontal,
  ArrowRight,
  Star,
  CheckCircle2,
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore, type Product } from '@/hooks/use-store';
import { cn } from '@/lib/utils';

const MOCK_RESULTS: Product[] = [
  {
    id: '1',
    name: 'Royal Heritage Silk Sari',
    brand: 'Kala Sanskruti',
    price: 8499,
    originalPrice: 11999,
    discount: 30,
    platform: 'Myntra',
    imageUrl: 'https://picsum.photos/seed/outfit1/800/1200',
    aiReason: 'The vertical weave elongates your silhouette, balancing your frame perfectly.',
    rating: 4.8,
    reviews: 842,
    link: '#'
  },
  {
    id: '2',
    name: 'Modern Anarkali Set',
    brand: 'Vibe India',
    price: 4200,
    platform: 'Amazon',
    imageUrl: 'https://picsum.photos/seed/outfit2/800/1200',
    aiReason: 'A-line cut flares from the waist, ideal for a balanced pear-shaped look.',
    rating: 4.5,
    reviews: 1205,
    link: '#'
  },
  {
    id: '3',
    name: 'Linen Fusion Kurta',
    brand: 'Minimalist',
    price: 1899,
    platform: 'Flipkart',
    imageUrl: 'https://picsum.photos/seed/outfit3/800/1200',
    aiReason: 'Breathable fabric with a structured shoulder to broaden your upper body.',
    rating: 4.2,
    reviews: 320,
    link: '#'
  },
  {
    id: '4',
    name: 'Velvet Evening Gown',
    brand: 'Luxe Wear',
    price: 12500,
    originalPrice: 15000,
    discount: 15,
    platform: 'Meesho',
    imageUrl: 'https://picsum.photos/seed/outfit4/800/1200',
    aiReason: 'The deep neckline draws attention upward, highlighting your neck and face.',
    rating: 4.9,
    reviews: 58,
    link: '#'
  }
];

export default function ResultsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { wishlist, cart, toggleWishlist, addToCart, isInWishlist, isInCart } = useStore();

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-50 bg-obsidian-2/80 backdrop-blur-xl border-b border-border py-12 px-16 md:px-48">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-16 overflow-x-auto scrollbar-hide">
            <span className="text-label text-ivory-3 whitespace-nowrap">24 outfits for you</span>
            <div className="flex gap-8">
              {['All', 'Wedding', 'Casual', 'Formal', 'Party', 'Under ₹2000'].map(f => (
                <button 
                  key={f} 
                  className={cn(
                    "h-32 px-12 rounded-pill text-[10px] uppercase font-bold tracking-wider border transition-standard",
                    f === 'All' ? "bg-gold text-obsidian border-gold" : "border-border text-ivory-3 hover:border-gold/30"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-12">
            <Button variant="outline" size="sm" className="h-32">
              <SlidersHorizontal size={14} className="mr-8" /> Sort
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto py-48 px-16 md:px-48">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-24 lg:gap-32">
          {MOCK_RESULTS.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <Card variant="interactive" className="h-full overflow-hidden border-none bg-obsidian-2 relative">
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-standard group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-12 right-12 flex flex-col gap-8 opacity-0 group-hover:opacity-100 transition-standard translate-y-4 group-hover:translate-y-0">
                    <Button 
                      variant="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={cn(
                        "w-40 h-40 bg-obsidian-2/80 backdrop-blur-md border border-gold/20",
                        isInWishlist(product.id) && "text-gold"
                      )}
                    >
                      <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </Button>
                    <Button 
                      variant="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={cn(
                        "w-40 h-40 bg-obsidian-2/80 backdrop-blur-md border border-gold/20",
                        isInCart(product.id) && "text-gold"
                      )}
                    >
                      <ShoppingBag size={18} fill={isInCart(product.id) ? "currentColor" : "none"} />
                    </Button>
                  </div>

                  {/* Why Tag */}
                  {product.aiReason && (
                    <div className="absolute bottom-12 left-12 right-12">
                      <div className="bg-gold/90 backdrop-blur-md px-12 py-4 rounded-pill flex items-center gap-8">
                        <Sparkles size={12} className="text-obsidian" />
                        <span className="text-[10px] font-bold text-obsidian uppercase truncate">{product.aiReason}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-16 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-label text-gold truncate">{product.brand}</p>
                      <h3 className="text-body font-medium text-ivory truncate">{product.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{product.platform}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-h3 text-gold">₹{product.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-4 text-ivory-3">
                      <Star size={12} className="text-gold fill-gold" />
                      <span className="text-caption font-bold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Detail Drawer */}
      <Sheet open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] bg-obsidian-2 border-l border-gold/10 p-0 overflow-y-auto scrollbar-hide">
          {selectedProduct && (
            <div className="relative pb-96">
              <SheetHeader className="absolute top-12 left-12 z-10">
                <SheetTitle className="sr-only">{selectedProduct.name}</SheetTitle>
              </SheetHeader>
              
              <div className="aspect-square bg-obsidian-3 relative">
                <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-16 right-16 w-40 h-40 rounded-full bg-obsidian/50 backdrop-blur-md flex items-center justify-center text-ivory hover:bg-gold hover:text-obsidian transition-standard">
                  <X size={20} />
                </button>
              </div>

              <div className="p-32 space-y-32">
                <div className="space-y-8">
                  <Badge variant="secondary" className="bg-gold/10 text-gold border-none">{selectedProduct.brand}</Badge>
                  <h2 className="text-h2 leading-tight">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-12">
                    <p className="text-h1 text-gold">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                    {selectedProduct.originalPrice && (
                      <p className="text-h3 text-ivory-3 line-through">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                    {selectedProduct.discount && (
                      <Badge variant="destructive" className="bg-rose/20 text-rose border-none">{selectedProduct.discount}% OFF</Badge>
                    )}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="p-24 rounded-card bg-gold/5 border-l-4 border-gold space-y-12">
                  <div className="flex items-center gap-8 text-gold">
                    <Sparkles size={16} />
                    <span className="text-label">Atelier Intelligence</span>
                  </div>
                  <p className="text-body italic text-ivory-2">"{selectedProduct.aiReason}"</p>
                </div>

                <div className="space-y-12">
                  <p className="text-label text-gold">Size Availability</p>
                  <div className="flex gap-8">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <button key={s} className="w-48 h-48 rounded-button border border-border text-ivory-2 hover:border-gold hover:text-gold transition-standard font-bold text-xs">{s}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-16 pt-16">
                  <Button size="lg" className="w-full h-56 text-lg font-headline tracking-widest" asChild>
                    <a href={selectedProduct.link} target="_blank">Buy on {selectedProduct.platform}</a>
                  </Button>
                  <div className="grid grid-cols-2 gap-12">
                    <Button variant="outline" size="lg" className="h-56" onClick={() => toggleWishlist(selectedProduct)}>
                      <Heart size={20} className={cn("mr-8", isInWishlist(selectedProduct.id) && "text-gold fill-gold")} /> 
                      {isInWishlist(selectedProduct.id) ? 'Saved' : 'Wishlist'}
                    </Button>
                    <Button variant="outline" size="lg" className="h-56" onClick={() => addToCart(selectedProduct)}>
                      <ShoppingBag size={20} className={cn("mr-8", isInCart(selectedProduct.id) && "text-gold fill-gold")} />
                      {isInCart(selectedProduct.id) ? 'In Plan' : 'Add to Plan'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
