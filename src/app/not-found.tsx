'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-center p-4 pt-24 overflow-hidden">
      {/* Editorial Decor Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-headline text-[300px] text-primary/10 select-none whitespace-nowrap">
          STYLE MISPLACED
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <div className="relative w-72 h-[450px] mx-auto mb-12 rounded-2xl overflow-hidden border border-primary/20 shadow-2xl group">
          <Image 
            src="https://picsum.photos/seed/404-fashion/600/900" 
            alt="Lost fashion silhouette" 
            fill
            className="object-cover transition-transform duration-2000 group-hover:scale-110"
            data-ai-hint="fashion model silhouette"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-8 right-8 text-primary font-headline text-8xl opacity-30 select-none"
          >
            404
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-headline text-primary mb-6">
          Lost in the Wardrobe
        </h1>
        <p className="text-lg text-foreground/60 font-body max-w-md mx-auto mb-10 leading-relaxed">
          Oops! It seems the aesthetic you seek has been misplaced amongst the silks and satins. Let{"'"}s return to the collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-16 px-12 font-headline text-xl tracking-[0.2em] group relative overflow-hidden bg-primary text-primary-foreground hover:glow-gold">
            <Link href="/" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 px-12 font-headline text-xl tracking-[0.2em] border-primary/20 hover:bg-primary/5">
            <Link href="/results" className="flex items-center gap-3">
              <Search className="w-5 h-5" />
              Browse Outfits
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
