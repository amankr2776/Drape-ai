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
  ArrowRight,
  Star,
  X,
  Share2,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  Loader2
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore, type Product } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
    aiReason: 'Vertical weave elongates your silhouette.',
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
    aiReason: 'A-line cut flares from the waist, ideal for pear shapes.',
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
    aiReason: 'Structured shoulder broadens your upper body.',
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
    aiReason: 'Deep neckline highlights your neck and face.',
    rating: 4.9,
    reviews: 58,
    link: '#'
  }
];

export default function ResultsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  const [sortOrder, setSortOrder] = useState('Recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toggleWishlist, addToCart, isInWishlist, isInCart } = useStore();
  const { toast } = useToast();

  const handleFilterToggle = (filter: string) => {
    if (filter === 'All') setActiveFilters(['All']);
    else {
      const next = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== 'All'), filter];
      setActiveFilters(next.length === 0 ? ['All'] : next);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Sticky Filter Bar */}
      <div 
        className="sticky top-[64px] bg-obsidian/95 backdrop-blur-xl border-b border-border py-8 px-16 md:px-24"
        style={{ zIndex: 'var(--z-sticky)' }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12 overflow-x-auto scrollbar-hide flex-1">
            <span className="text-[10px] uppercase font-bold text-ivory-4 whitespace-nowrap">24 styles</span>
            <div className="flex gap-4">
              {['All', 'Wedding', 'Casual', 'Formal', 'Party'].map(f => (
                <button 
                  key={f} 
                  onClick={() => handleFilterToggle(f)}
                  className={cn(
                    "h-8 px-12 rounded-pill text-[10px] uppercase font-bold tracking-wider border transition-all whitespace-nowrap",
                    activeFilters.includes(f) ? "bg-gold text-obsidian border-gold" : "border-border text-ivory-3 hover:border-gold/30"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8 ml-16">
            <div className="flex bg-obsidian-3 rounded-md p-1 border border-border">
              <button onClick={() => setViewMode('grid')} className={cn("p-4 rounded transition-colors", viewMode === 'grid' ? "bg-gold text-obsidian" : "text-ivory-3")}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={cn("p-4 rounded transition-colors", viewMode === 'list' ? "bg-gold text-obsidian" : "text-ivory-3")}>
                <LayoutList size={16} />
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-8 uppercase text-[10px] font-bold">
                  <ArrowUpDown size={12} /> {sortOrder}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-obsidian-3 border-border">
                {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Newest'].map(opt => (
                  <DropdownMenuItem key={opt} onClick={() => setSortOrder(opt)} className="text-[10px] uppercase font-bold">
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="page-content py-24">
        <div className={cn(
          "grid gap-24 items-stretch",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {MOCK_RESULTS.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer h-full"
              onClick={() => setSelectedProduct(product)}
            >
              <Card variant="interactive" className={cn(
                "overflow-hidden border-none bg-obsidian-2 relative h-full flex flex-col",
                viewMode === 'list' && "sm:flex-row sm:h-[200px]"
              )}>
                {/* Image */}
                <div className={cn(
                  "overflow-hidden relative flex-shrink-0",
                  viewMode === 'grid' ? "aspect-product" : "h-full w-full sm:w-[150px]"
                )}>
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-standard group-hover:scale-105 object-top" />
                  
                  <div className="absolute top-8 right-8 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-standard translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                      className={cn("w-10 h-10 rounded-full bg-obsidian/70 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all", isInWishlist(product.id) ? "text-gold" : "text-white hover:text-gold")}
                    >
                      <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className={cn("w-10 h-10 rounded-full bg-obsidian/70 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all", isInCart(product.id) ? "text-gold" : "text-white hover:text-gold")}
                    >
                      <ShoppingBag size={18} strokeWidth={1.5} fill={isInCart(product.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {product.aiReason && viewMode === 'grid' && (
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="bg-gold/90 backdrop-blur-md px-12 py-4 rounded-pill flex items-center gap-8 shadow-gold">
                        <Sparkles size={10} className="text-obsidian flex-shrink-0" />
                        <span className="text-[9px] font-bold text-obsidian uppercase truncate">{product.aiReason}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-16 flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="overflow-hidden">
                        <p className="text-[10px] uppercase tracking-wider text-gold font-bold truncate">{product.brand}</p>
                        <h3 className="text-sm font-medium text-ivory truncate-2 mt-2 leading-tight">{product.name}</h3>
                      </div>
                      <Badge variant="outline" className="text-[8px] uppercase font-bold px-4 h-5 flex-shrink-0">{product.platform}</Badge>
                    </div>
                    {viewMode === 'list' && (
                      <p className="text-[11px] text-ivory-3 italic line-clamp-2">"{product.aiReason}"</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-16">
                    <p className="text-lg font-bold text-gold">₹{product.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-4 text-ivory-4">
                      <Star size={10} className="text-gold fill-gold" />
                      <span className="text-[10px] font-bold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-48 flex flex-col items-center gap-8">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full max-w-sm h-12 font-headline tracking-[0.2em] border-gold/20 hover:border-gold hover:text-gold transition-all"
            onClick={() => setIsLoadingMore(true)}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? <Loader2 className="animate-spin" /> : "Explore More"}
          </Button>
          <p className="text-[10px] uppercase font-bold tracking-widest text-ivory-4">Showing 24 of 1,240 results</p>
        </div>
      </div>

      {/* Product Detail Drawer */}
      <Sheet open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-[480px] bg-obsidian-2 border-l border-gold/10 p-0 overflow-y-auto scrollbar-hide pt-[64px]"
          style={{ zIndex: 'var(--z-drawer)' }}
        >
          {selectedProduct && (
            <div className="relative pb-48">
              <div className="aspect-product bg-obsidian-3 relative overflow-hidden">
                <img src={selectedProduct.imageUrl} className="w-full h-full object-cover object-top" alt={selectedProduct.name} />
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-16 right-16 w-10 h-10 rounded-full bg-obsidian/50 backdrop-blur-md flex items-center justify-center text-ivory hover:bg-gold hover:text-obsidian transition-standard"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-24 space-y-32">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-gold/10 text-gold border-none font-bold uppercase text-[10px]">{selectedProduct.brand}</Badge>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-gold fill-gold" />
                      <span className="text-[10px] text-ivory-3 font-bold">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                  <h2 className="text-3xl leading-tight font-headline">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-12 pt-8">
                    <p className="text-4xl font-bold text-gold font-headline">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                    {selectedProduct.originalPrice && (
                      <p className="text-lg text-ivory-4 line-through">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                </div>

                <div className="p-16 rounded-card bg-gold/5 border-l-4 border-gold space-y-8">
                  <div className="flex items-center gap-8 text-gold">
                    <Sparkles size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Atelier Insight</span>
                  </div>
                  <p className="text-lg italic text-ivory-2 leading-relaxed">"{selectedProduct.aiReason}"</p>
                </div>

                <div className="space-y-16">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gold">Standard Sizing</p>
                  <div className="grid grid-cols-5 gap-8">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <button key={s} className={cn("h-12 rounded border font-bold text-xs transition-all", s === 'M' ? "bg-gold text-obsidian border-gold" : "border-border text-ivory-3 hover:border-gold hover:text-gold")}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-12 pt-16">
                  <Button size="lg" className="w-full h-14 text-lg font-headline tracking-[0.2em] shadow-gold group" asChild>
                    <a href={selectedProduct.link} target="_blank">
                      Buy on {selectedProduct.platform} 
                      <ArrowRight size={20} className="ml-8 group-hover:translate-x-8 transition-transform" />
                    </a>
                  </Button>
                  <div className="grid grid-cols-2 gap-12">
                    <Button variant="outline" size="lg" className="h-12 gap-8" onClick={() => toggleWishlist(selectedProduct)}>
                      <Heart size={18} className={cn(isInWishlist(selectedProduct.id) && "text-gold fill-gold")} /> 
                      {isInWishlist(selectedProduct.id) ? 'Saved' : 'Wishlist'}
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 gap-8" onClick={() => addToCart(selectedProduct)}>
                      <ShoppingBag size={18} className={cn(isInCart(selectedProduct.id) && "text-gold fill-gold")} />
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