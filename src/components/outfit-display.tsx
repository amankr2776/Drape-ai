'use client';

import type { AiOutfitRecommendationOutput } from '@/ai/flows/ai-outfit-recommendation-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { submitFeedback } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

type OutfitDisplayProps = {
  recommendation: AiOutfitRecommendationOutput;
};

export function OutfitDisplay({ recommendation }: OutfitDisplayProps) {
  const { toast } = useToast();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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
            description: "Thank you! Your feedback helps us improve.",
        });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start animate-fade-in-up">
      <Card className="bg-transparent border-0 shadow-none sticky top-8">
        <CardContent className="p-0">
          <Image
            src="https://picsum.photos/seed/outfit1/800/1200"
            alt={recommendation.outfitName}
            width={800}
            height={1200}
            className="rounded-lg object-cover w-full"
            data-ai-hint="fashion editorial"
          />
        </CardContent>
      </Card>
      <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-4xl lg:text-6xl font-headline font-bold text-primary leading-tight">
                {recommendation.outfitName}
            </h1>
            <p className="font-body text-lg text-foreground/80">
                {recommendation.description}
            </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {recommendation.items.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="font-headline text-xl hover:no-underline hover:text-primary">
                    {item.type}
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2 text-foreground/70">
                    <p>{item.description}</p>
                    <p className="font-semibold text-foreground/80">Styling: <span className="font-normal">{item.stylingTips}</span></p>
                </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        
        <div>
            <h3 className="font-headline text-2xl mb-2">Overall Styling</h3>
            <p className="text-foreground/70">{recommendation.overallStylingTips}</p>
        </div>

        <div>
            <h3 className="font-headline text-2xl mb-3">Mood Board</h3>
            <div className="flex flex-wrap gap-2">
            {recommendation.moodBoardKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="font-body text-sm bg-muted/80 border-border">
                {keyword}
                </Badge>
            ))}
            </div>
        </div>

        <div>
            <h3 className="font-headline text-2xl mb-3">Was this helpful?</h3>
            <div className="flex gap-4">
                <Button variant="outline" size="icon" onClick={() => handleFeedback('liked')} disabled={feedbackSubmitted}>
                    <ThumbsUp />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleFeedback('disliked')} disabled={feedbackSubmitted}>
                    <ThumbsDown />
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
