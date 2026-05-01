'use client';

import { useState, useEffect } from 'react';
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
  X,
  Share2,
  MoreHorizontal,
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
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  const [sortOrder, setSortOrder] = useState('Recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { wishlist, cart, toggleWishlist, addToCart, isInWishlist, isInCart } = useStore();
  const { toast } = useToast();

  const handleFilterToggle = (filter: string) => {
    if (filter === 'All') {
      setActiveFilters(['All']);
    } else {
      const next = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== 'All'), filter];
      setActiveFilters(next.length === 0 ? ['All'] : next);
    }
  };

  const handleShare = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} I found on DRAPE AI!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Product link copied to clipboard." });
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsLoadingMore(false);
      toast({ title: "Atelier Synchronized", description: "Loaded 8 more curated styles." });
    }, 1500);
  };

  return (
    <div className="bg-obsidian">
      {/* Sticky Filter Bar */}
      <div 
        className="sticky top-[64px] bg-obsidian-2/80 backdrop-blur-xl border-b border-border py-4 px-16 md:px-24"
        style={{ zIndex: 'var(--z-sticky-bar)' }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12 overflow-x-auto scrollbar-hide">
            <span className="text-[10px] uppercase font-bold text-ivory-3 whitespace-nowrap">24 outfits</span>
            <div className="flex gap-2">
              {['All', 'Wedding', 'Casual', 'Formal', 'Party'].map(f => (
                <button 
                  key={f} 
                  onClick={() => handleFilterToggle(f)}
                  className={cn(
                    "h-8 px-4 rounded-pill text-[10px] uppercase font-bold tracking-wider border transition-all duration-300 whitespace-nowrap",
                    activeFilters.includes(f) ? "bg-gold text-obsidian border-gold shadow-gold" : "border-border text-ivory-3 hover:border-gold/30"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex bg-obsidian-3 rounded-md p-1 border border-border">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded transition-colors", viewMode === 'grid' ? "bg-gold text-obsidian" : "text-ivory-3 hover:text-gold")}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded transition-colors", viewMode === 'list' ? "bg-gold text-obsidian" : "text-ivory-3 hover:text-gold")}
              >
                <LayoutList size={16} />
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <ArrowUpDown size={14} /> {sortOrder}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-obsidian-3 border-border">
                {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Newest'].map(opt => (
                  <DropdownMenuItem 
                    key={opt} 
                    onClick={() => setSortOrder(opt)}
                    className="text-xs uppercase font-bold tracking-widest hover:bg-gold/10 hover:text-gold"
                  >
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto py-12 px-16 md:px-24">
        <div className={cn(
          "grid gap-6 lg:gap-8",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
        )}>
          {MOCK_RESULTS.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer relative"
              onClick={() => setSelectedProduct(product)}
            >
              <Card variant="interactive" className={cn(
                "overflow-hidden border-none bg-obsidian-2 relative h-full",
                viewMode === 'list' && "flex flex-row h-64"
              )}>
                {/* Image */}
                <div className={cn(
                  "overflow-hidden relative",
                  viewMode === 'grid' ? "aspect-[3/4]" : "w-128 h-full flex-shrink-0"
                )}>
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-standard group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Top-Right Action Button Group */}
                  <div 
                    className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-standard translate-x-2 group-hover:translate-x-0"
                    style={{ zIndex: 'var(--z-card-overlay)' }}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={cn(
                        "w-9 h-9 rounded-full bg-obsidian/70 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all",
                        isInWishlist(product.id) ? "text-gold" : "text-white hover:text-gold"
                      )}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={cn(
                        "w-9 h-9 rounded-full bg-obsidian/70 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all",
                        isInCart(product.id) ? "text-gold" : "text-white hover:text-gold"
                      )}
                      aria-label="Toggle Cart"
                    >
                      <ShoppingBag size={20} strokeWidth={1.5} fill={isInCart(product.id) ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={(e) => handleShare(product, e)}
                      className="w-9 h-9 rounded-full bg-obsidian/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-gold transition-all"
                      aria-label="Share"
                    >
                      <Share2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Why Tag (Grid Only) */}
                  {product.aiReason && viewMode === 'grid' && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-gold/90 backdrop-blur-md px-3 py-1 rounded-pill flex items-center gap-2 shadow-gold">
                        <Sparkles size={12} className="text-obsidian flex-shrink-0" />
                        <span className="text-[10px] font-bold text-obsidian uppercase truncate">{product.aiReason}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-wider text-gold font-bold truncate">{product.brand}</p>
                        <h3 className="text-sm font-medium text-ivory truncate">{product.name}</h3>
                      </div>
                      <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter h-5">{product.platform}</Badge>
                    </div>
                    {viewMode === 'list' && (
                      <p className="text-[11px] text-ivory-3 line-clamp-2 italic pt-1 leading-relaxed">"{product.aiReason}"</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-lg font-bold text-gold">₹{product.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-1 text-ivory-3">
                      <Star size={12} className="text-gold fill-gold" />
                      <span className="text-xs font-bold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full max-w-sm h-12 font-headline tracking-[0.2em] border-gold/20 hover:border-gold hover:text-gold transition-all"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? <Loader2 className="animate-spin" /> : "Explore More"}
          </Button>
          <p className="text-[10px] uppercase font-bold tracking-widest text-ivory-4">Showing 24 of 1,240 results</p>
        </div>
      </div>

      {/* Product Detail Drawer */}
      <Sheet open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] bg-obsidian-2 border-l border-gold/10 p-0 overflow-y-auto scrollbar-hide" style={{ zIndex: 'var(--z-drawer)' }}>
          {selectedProduct && (
            <div className="relative pb-24">
              <SheetHeader className="absolute top-3 left-3 z-10">
                <SheetTitle className="sr-only">{selectedProduct.name}</SheetTitle>
              </SheetHeader>
              
              <div className="aspect-square bg-obsidian-3 relative overflow-hidden">
                <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-obsidian/50 backdrop-blur-md flex items-center justify-center text-ivory hover:bg-gold hover:text-obsidian transition-standard shadow-large"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-gold/10 text-gold border-none font-bold">{selectedProduct.brand}</Badge>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={cn(s <= Math.floor(selectedProduct.rating || 0) ? "text-gold fill-gold" : "text-ivory-4")} />
                      ))}
                      <span className="text-[10px] text-ivory-3 ml-2">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                  <h2 className="text-3xl leading-tight font-headline">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-4 pt-2">
                    <p className="text-4xl font-bold text-gold font-headline">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                    {selectedProduct.originalPrice && (
                      <p className="text-lg text-ivory-3 line-through">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                    {selectedProduct.discount && (
                      <Badge variant="destructive" className="bg-rose/20 text-rose border-none font-bold">{selectedProduct.discount}% OFF</Badge>
                    )}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="p-6 rounded-card bg-gold/5 border-l-4 border-gold space-y-4 shadow-gold">
                  <div className="flex items-center gap-2 text-gold">
                    <Sparkles size={16} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Atelier Intelligence</span>
                  </div>
                  <p className="text-lg italic text-ivory-2 font-normal leading-relaxed">"{selectedProduct.aiReason}"</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gold">Select Your Size</p>
                  <div className="grid grid-cols-5 gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <button 
                        key={s} 
                        className={cn(
                          "h-12 rounded-button border font-bold text-xs transition-all",
                          s === 'M' ? "bg-gold text-obsidian border-gold shadow-gold" : "border-border text-ivory-2 hover:border-gold hover:text-gold"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <Button size="lg" className="w-full h-14 text-lg font-headline tracking-[0.2em] shadow-gold group" asChild>
                    <a href={selectedProduct.link} target="_blank">
                      Buy on {selectedProduct.platform} 
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-12 gap-2 group" 
                      onClick={() => toggleWishlist(selectedProduct)}
                    >
                      <Heart 
                        size={18} 
                        className={cn("transition-all duration-300", isInWishlist(selectedProduct.id) ? "text-rose fill-rose" : "group-hover:text-rose")} 
                        strokeWidth={1.5}
                      /> 
                      {isInWishlist(selectedProduct.id) ? 'Saved' : 'Wishlist'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-12 gap-2 group" 
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingBag 
                        size={18} 
                        className={cn("transition-all duration-300", isInCart(selectedProduct.id) ? "text-gold fill-gold" : "group-hover:text-gold")} 
                        strokeWidth={1.5}
                      />
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