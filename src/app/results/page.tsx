
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
                  onClick={() => handleFilterToggle(f)}
                  className={cn(
                    "h-32 px-16 rounded-pill text-[10px] uppercase font-bold tracking-wider border transition-all duration-300",
                    activeFilters.includes(f) ? "bg-gold text-obsidian border-gold shadow-gold" : "border-border text-ivory-3 hover:border-gold/30"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-12">
            <div className="flex bg-obsidian-3 rounded-md p-2 border border-border">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-4 rounded transition-colors", viewMode === 'grid' ? "bg-gold text-obsidian" : "text-ivory-3 hover:text-gold")}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-4 rounded transition-colors", viewMode === 'list' ? "bg-gold text-obsidian" : "text-ivory-3 hover:text-gold")}
              >
                <LayoutList size={16} />
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-32 gap-8">
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

      <div className="max-w-[1440px] mx-auto py-48 px-16 md:px-48">
        <div className={cn(
          "grid gap-24 lg:gap-32",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
        )}>
          {MOCK_RESULTS.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <Card variant="interactive" className={cn(
                "overflow-hidden border-none bg-obsidian-2 relative",
                viewMode === 'list' && "flex flex-row h-64"
              )}>
                {/* Image */}
                <div className={cn(
                  "overflow-hidden relative",
                  viewMode === 'grid' ? "aspect-[3/4]" : "w-128 h-full"
                )}>
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
                      aria-label="Save to wishlist"
                    >
                      <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={1.5} />
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
                      aria-label="Add to shopping plan"
                    >
                      <ShoppingBag size={18} fill={isInCart(product.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                    </Button>
                    <Button 
                      variant="icon" 
                      onClick={(e) => handleShare(product, e)}
                      className="w-40 h-40 bg-obsidian-2/80 backdrop-blur-md border border-gold/20 text-ivory-2 hover:text-gold"
                      aria-label="Share product"
                    >
                      <Share2 size={18} strokeWidth={1.5} />
                    </Button>
                  </div>

                  {/* Why Tag */}
                  {product.aiReason && viewMode === 'grid' && (
                    <div className="absolute bottom-12 left-12 right-12">
                      <div className="bg-gold/90 backdrop-blur-md px-12 py-4 rounded-pill flex items-center gap-8 shadow-gold">
                        <Sparkles size={12} className="text-obsidian" />
                        <span className="text-[10px] font-bold text-obsidian uppercase truncate">{product.aiReason}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-16 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-label text-gold truncate">{product.brand}</p>
                        <h3 className="text-body font-medium text-ivory truncate">{product.name}</h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">{product.platform}</Badge>
                    </div>
                    {viewMode === 'list' && (
                      <p className="text-xs text-ivory-3 line-clamp-2 italic">"{product.aiReason}"</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-8">
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

        {/* Load More */}
        <div className="mt-64 flex flex-col items-center gap-16">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full max-w-sm h-14 font-headline tracking-[0.2em] border-gold/20 hover:border-gold hover:text-gold transition-all"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? <Loader2 className="animate-spin" /> : "Load More Collections"}
          </Button>
          <p className="text-label text-ivory-4">Showing 24 of 1,240 results</p>
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
              
              <div className="aspect-square bg-obsidian-3 relative overflow-hidden">
                <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-16 right-16 w-40 h-40 rounded-full bg-obsidian/50 backdrop-blur-md flex items-center justify-center text-ivory hover:bg-gold hover:text-obsidian transition-standard shadow-large">
                  <X size={20} />
                </button>
              </div>

              <div className="p-32 space-y-32">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-gold/10 text-gold border-none font-bold">{selectedProduct.brand}</Badge>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={cn(s <= Math.floor(selectedProduct.rating || 0) ? "text-gold fill-gold" : "text-ivory-4")} />
                      ))}
                      <span className="text-[10px] text-ivory-3 ml-2">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                  <h2 className="text-h1 leading-tight">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-12 pt-4">
                    <p className="text-display text-gold">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                    {selectedProduct.originalPrice && (
                      <p className="text-h3 text-ivory-3 line-through">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                    {selectedProduct.discount && (
                      <Badge variant="destructive" className="bg-rose/20 text-rose border-none font-bold">{selectedProduct.discount}% OFF</Badge>
                    )}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="p-24 rounded-card bg-gold/5 border-l-4 border-gold space-y-12 shadow-gold">
                  <div className="flex items-center gap-8 text-gold">
                    <Sparkles size={16} />
                    <span className="text-label">Atelier Intelligence</span>
                  </div>
                  <p className="text-h3 italic text-ivory-2 font-normal leading-relaxed">"{selectedProduct.aiReason}"</p>
                </div>

                <div className="space-y-16">
                  <p className="text-label text-gold">Select Your Size</p>
                  <div className="grid grid-cols-5 gap-8">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <button 
                        key={s} 
                        className={cn(
                          "h-56 rounded-button border font-bold text-xs transition-all",
                          s === 'M' ? "bg-gold text-obsidian border-gold shadow-gold" : "border-border text-ivory-2 hover:border-gold hover:text-gold"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-16 pt-32">
                  <Button size="lg" className="w-full h-64 text-xl font-headline tracking-[0.2em] shadow-gold group" asChild>
                    <a href={selectedProduct.link} target="_blank">
                      Buy on {selectedProduct.platform} 
                      <ArrowRight size={20} className="ml-8 group-hover:translate-x-4 transition-transform" />
                    </a>
                  </Button>
                  <div className="grid grid-cols-2 gap-12">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-56 gap-8 group" 
                      onClick={() => toggleWishlist(selectedProduct)}
                    >
                      <Heart 
                        size={20} 
                        className={cn("transition-all duration-300", isInWishlist(selectedProduct.id) ? "text-rose fill-rose" : "group-hover:text-rose")} 
                        strokeWidth={1.5}
                      /> 
                      {isInWishlist(selectedProduct.id) ? 'Saved' : 'Wishlist'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-56 gap-8 group" 
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingBag 
                        size={20} 
                        className={cn("transition-all duration-300", isInCart(selectedProduct.id) ? "text-gold fill-gold" : "group-hover:text-gold")} 
                        strokeWidth={1.5}
                      />
                      {isInCart(selectedProduct.id) ? 'In Plan' : 'Add to Plan'}
                    </Button>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full text-ivory-3 gap-8">
                      <MoreHorizontal size={20} /> Quick Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[416px] bg-obsidian-3 border-border">
                    <DropdownMenuItem className="p-4 flex items-center gap-4 hover:bg-gold/10 hover:text-gold cursor-pointer">
                      <Share2 size={18} /> Share with a Stylist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-4 flex items-center gap-4 hover:bg-gold/10 hover:text-gold cursor-pointer">
                      <TrendingDown size={18} /> Enable Price Alerts
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-4 flex items-center gap-4 hover:bg-rose/10 hover:text-rose cursor-pointer text-ivory-3">
                      <X size={18} /> Not Interested in this Look
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
