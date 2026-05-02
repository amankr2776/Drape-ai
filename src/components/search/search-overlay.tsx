'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, Sparkles, ShoppingBag, History, FileText, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // Toggle behavior logic should be in parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    router.push(`/results?q=${encodeURIComponent(q)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-32 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-obsidian-2 border border-gold/20 rounded-[24px] shadow-2xl overflow-hidden relative"
          >
            <div className="p-6 border-b border-border flex items-center gap-4">
              <Search className="text-gold w-6 h-6" />
              <input 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Search outfits, trends, or settings..." 
                className="flex-1 bg-transparent border-none outline-none text-xl font-headline text-ivory placeholder:text-foreground/20"
              />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-obsidian-3 border border-border rounded-md text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                <Command size={10} /> Enter
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-6 scrollbar-hide">
              {!query ? (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-2">
                      <History size={12} /> Recent Explorations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Silk Saris', 'Office Wear for Men', 'Traditional Wedding', 'Minimalist'].map(s => (
                        <button key={s} onClick={() => handleSearch(s)} className="px-4 py-2 rounded-full bg-obsidian-3 border border-border text-xs text-foreground/60 hover:border-gold/30 hover:text-gold transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-2">
                         <Sparkles size={12} /> Direct Actions
                       </p>
                       <div className="space-y-1">
                         <button onClick={() => router.push('/analyze')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 text-sm flex justify-between items-center group">
                           <span>Run Analysis</span>
                           <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-gold transition-all" />
                         </button>
                         <button onClick={() => router.push('/settings')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 text-sm flex justify-between items-center group">
                           <span>Atelier Settings</span>
                           <Settings size={14} className="opacity-40" />
                         </button>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-2">
                         <FileText size={12} /> Help Resources
                       </p>
                       <div className="space-y-1">
                         <button onClick={() => router.push('/help')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 text-sm flex justify-between items-center group">
                           <span>How AI Works</span>
                           <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-gold transition-all" />
                         </button>
                         <button onClick={() => router.push('/contact')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 text-sm flex justify-between items-center group">
                           <span>Contact Curators</span>
                           <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-gold transition-all" />
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Matching Silhouettes</p>
                    {[1, 2].map(i => (
                      <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-gold/5 border border-transparent hover:border-gold/10 transition-all cursor-pointer">
                        <div className="w-12 h-16 rounded bg-obsidian-3 overflow-hidden border border-border">
                          <img src={`https://picsum.photos/seed/search-${i}/100/150`} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-ivory">Heritage Zari Set</h4>
                          <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Available on Myntra</p>
                        </div>
                        <div className="flex flex-col justify-center items-end">
                           <p className="text-gold font-bold">₹4,899</p>
                           <ShoppingBag size={14} className="text-foreground/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => handleSearch(query)} className="w-full h-12 bg-primary text-primary-foreground font-headline text-lg">
                    Search all Results for "{query}"
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}