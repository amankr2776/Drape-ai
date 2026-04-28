'use client';

import { Check, Heart, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WardrobePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-primary">My Wardrobe</h1>
          <p className="mt-4 text-lg text-foreground/70">
            The future of your personal style archive is under construction. Get ready for a seamless experience to manage, combine, and share your favorite looks.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              <h3 className="flex items-center gap-3 text-xl font-headline text-primary">
                <Heart />
                Save & Organize
              </h3>
              <ul className="mt-4 space-y-2 text-foreground/80">
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> Save favorite outfits from recommendations.</li>
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> Create custom collections like "Work" or "Vacation".</li>
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> View items in a beautiful masonry grid.</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              <h3 className="flex items-center gap-3 text-xl font-headline text-primary">
                <Sparkles />
                Build & Share Looks
              </h3>
              <ul className="mt-4 space-y-2 text-foreground/80">
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> Mix & match items to create complete looks.</li>
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> Get total pricing for your custom-built outfits.</li>
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> Share your style with a personal wardrobe link.</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border sm:col-span-2 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              <h3 className="flex items-center gap-3 text-xl font-headline text-primary">
                <Tag />
                Smart Features
              </h3>
              <ul className="mt-4 space-y-2 text-foreground/80">
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> Set price drop alerts for your saved items.</li>
                <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4 shrink-0" /> View stats on your wardrobe's value and most-worn styles.</li>
              </ul>
            </div>
          </div>

          <p className="mt-16 text-3xl font-headline text-primary animate-pulse">
            Coming Soon!
          </p>
           <Button asChild className="mt-4 font-headline text-lg tracking-wider">
            <Link href="/dashboard">
                Back to Dashboard
            </Link>
           </Button>
        </div>
      </div>
    </div>
  );
}
