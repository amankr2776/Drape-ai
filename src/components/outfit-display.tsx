
'use client';

import type { AiOutfitRecommendationOutput } from '@/ai/flows/ai-outfit-recommendation-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ThumbsDown, ThumbsUp, Heart, ShoppingBag, Share2, Sparkles } from 'lucide-react';
import { submitFeedback } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useStore } from '@/hooks/use-store';

type OutfitDisplayProps = {
  recommendation: AiOutfitRecommendationOutput;
};

export function OutfitDisplay({ recommendation }: OutfitDisplayProps) {
  const { toast } = useToast();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { toggleWishlist, addToCart, isInWishlist, isInCart } = useStore();

  const handleFeedback = async (feedbackType: 'liked' | 'disliked') => {
    setFeedbackSubmitted(true);
    const result = await submitFeedback({
        feedbackType: feedbackType,
        recommendedOutfitDescription: recommendation.description,
        comments: `User ${feedbackType} the outfit.`,
    });

    if ('error' in result) {
        toast({
            variant: "destructive",
            title: "Feedback Error",
            description: result.error,
        });
        setFeedbackSubmitted(false);
    } else {
        toast({
            title: "Feedback Received",
            description: "Thank you! Your feedback helps us improve your personal atelier.",
        });
    }
  };

  // Transformation for useStore Product type
  const mockProduct = {
    id: `rec-${Date.now()}`,
    name: recommendation.outfitName,
    brand: 'DRAPE AI Exclusive',
    price: 4999, // Mock price for UI
    platform: 'Myntra' as const,
    imageUrl: "https://picsum.photos/seed/outfit1/800/1200",
    aiReason: recommendation.description,
    link: '#'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-48 items-start animate-fade-in-up">
      <Card className="bg-transparent border-0 shadow-none sticky top-24">
        <CardContent className="p-0">
          <div className="relative group">
            <Image
              src="https://picsum.photos/seed/outfit1/800/1200"
              alt={recommendation.outfitName}
              width={800}
              height={1200}
              className="rounded-lg object-cover w-full shadow-large"
              data-ai-hint="fashion editorial"
              priority
            />
            <div className="absolute top-24 right-24 flex flex-col gap-12">
               <Button 
                variant="icon" 
                className="bg-obsidian/40 backdrop-blur-xl border border-white/10 w-48 h-48"
                onClick={() => toggleWishlist(mockProduct)}
               >
                 <Heart size={24} className={isInWishlist(mockProduct.id) ? "text-rose fill-rose" : "text-white"} strokeWidth={1.5} />
               </Button>
               <Button 
                variant="icon" 
                className="bg-obsidian/40 backdrop-blur-xl border border-white/10 w-48 h-48"
                onClick={() => addToCart(mockProduct)}
               >
                 <ShoppingBag size={24} className={isInCart(mockProduct.id) ? "text-gold fill-gold" : "text-white"} strokeWidth={1.5} />
               </Button>
            </div>
            <div className="absolute bottom-24 left-24 right-24">
               <div className="p-24 bg-obsidian-2/60 backdrop-blur-xl border border-white/5 rounded-card space-y-8">
                  <div className="flex items-center gap-8 text-gold">
                    <Sparkles size={16} />
                    <span className="text-label">Style Intelligence</span>
                  </div>
                  <p className="text-body italic text-ivory-2">"{recommendation.description}"</p>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-48">
        <div className="space-y-12">
            <Badge className="bg-gold/10 text-gold border-none font-bold tracking-[0.2em] px-16 py-4">CURATED FOR YOU</Badge>
            <h1 className="text-h1 lg:text-display text-gold leading-tight">
                {recommendation.outfitName}
            </h1>
        </div>
        
        <div className="space-y-24">
          <h3 className="text-label text-gold font-bold">Atelier Breakdown</h3>
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
              {recommendation.items.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border-border/50">
                  <AccordionTrigger className="text-h3 font-normal hover:no-underline hover:text-gold transition-colors py-16">
                      {item.type}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-16 pt-8 text-ivory-2 pb-24">
                      <p className="text-body-large leading-relaxed">{item.description}</p>
                      <div className="p-16 rounded bg-gold/5 border-l-2 border-gold">
                        <p className="text-xs uppercase font-bold tracking-widest text-gold mb-4">Styling Instruction</p>
                        <p className="text-body italic">{item.stylingTips}</p>
                      </div>
                  </AccordionContent>
                  </AccordionItem>
              ))}
          </Accordion>
        </div>
        
        <div className="p-32 rounded-card bg-obsidian-2 border border-border space-y-16">
            <h3 className="text-label text-gold font-bold">Overall Styling</h3>
            <p className="text-body-large text-ivory-2 leading-relaxed">{recommendation.overallStylingTips}</p>
        </div>

        <div className="space-y-16">
            <h3 className="text-label text-gold font-bold">Mood Board keywords</h3>
            <div className="flex flex-wrap gap-8">
            {recommendation.moodBoardKeywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="font-body text-xs py-8 px-16 border-border text-ivory-3 hover:border-gold hover:text-gold transition-all">
                {keyword}
                </Badge>
            ))}
            </div>
        </div>

        <div className="pt-32 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-24">
            <div className="space-y-4 text-center sm:text-left">
              <h3 className="text-h3 font-normal">Was this helpful?</h3>
              <p className="text-caption text-ivory-3">Your feedback trains our atelier's intuition.</p>
            </div>
            <div className="flex gap-12">
                <Button 
                  variant="outline" 
                  className={cn("w-56 h-56 rounded-full border-border hover:border-gold hover:text-gold", feedbackSubmitted && "opacity-50")} 
                  onClick={() => handleFeedback('liked')} 
                  disabled={feedbackSubmitted}
                  aria-label="Like this recommendation"
                >
                    <ThumbsUp size={24} strokeWidth={1.5} />
                </Button>
                <Button 
                  variant="outline" 
                  className={cn("w-56 h-56 rounded-full border-border hover:border-rose hover:text-rose", feedbackSubmitted && "opacity-50")} 
                  onClick={() => handleFeedback('disliked')} 
                  disabled={feedbackSubmitted}
                  aria-label="Dislike this recommendation"
                >
                    <ThumbsDown size={24} strokeWidth={1.5} />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-56 h-56 rounded-full" 
                  onClick={() => toast({ title: "Shared", description: "Sharing options for this look are now open." })}
                  aria-label="Share recommendation"
                >
                    <Share2 size={24} strokeWidth={1.5} />
                </Button>
            </div>
        </div>
      </div>
       <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
