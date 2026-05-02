'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const MOCK_ARTICLE = {
  title: 'How does body shape detection work?',
  lastUpdated: 'May 12, 2025',
  readTime: '4 min',
  category: 'AI Analysis',
  content: [
    { type: 'text', value: 'DRAPE AI utilizes advanced computer vision algorithms to analyze your silhouette and map it to established fashion geometry. This process involves detecting 33 unique anatomical landmarks across your body.' },
    { type: 'header', value: '1. Landmark Detection' },
    { type: 'text', value: 'Our AI model identifies key points such as the outer edge of your shoulders, the narrowest part of your waist, and the widest point of your hips. This provides a digital frame of your physique.' },
    { type: 'header', value: '2. Proportional Ratios' },
    { type: 'text', value: 'Once the landmarks are identified, the system calculates ratios between your measurements. For instance, if your hip-to-shoulder ratio exceeds 1.05, our system categorizes your shape as "Pear".' },
    { type: 'header', value: '3. Style Translation' },
    { type: 'text', value: 'These ratios are then compared against our 50,000+ item database. For a Pear shape, the AI prioritizes A-line cuts and detailed necklines to draw visual attention upward, balancing your natural proportions.' },
  ],
  related: [
    { id: 'accuracy', title: 'How accurate is the AI?' },
    { id: 'skin-tone', title: 'Understanding skin tone mapping' },
    { id: 'not-loading', title: 'Why suggestions might fail to load' },
  ]
};

export default function HelpArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { toast } = useToast();

  const handleFeedback = (type: 'up' | 'down') => {
    toast({
      title: "Feedback Recorded",
      description: "Thank you for helping us improve our help atelier.",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/help" className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors mb-12">
          <ChevronLeft className="mr-2 w-4 h-4" /> Back to Help Center
        </Link>

        <article className="space-y-12">
          <header className="space-y-6">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {MOCK_ARTICLE.category}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline text-foreground leading-tight">
              {MOCK_ARTICLE.title}
            </h1>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-primary/40" />
                Updated {MOCK_ARTICLE.lastUpdated}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-primary/40" />
                {MOCK_ARTICLE.readTime} reading session
              </div>
            </div>
          </header>

          <Separator className="bg-primary/10" />

          <div className="prose prose-invert prose-gold max-w-none space-y-8">
            {MOCK_ARTICLE.content.map((block, i) => (
              <div key={i}>
                {block.type === 'text' && (
                  <p className="text-lg leading-relaxed text-foreground/60 font-body">
                    {block.value}
                  </p>
                )}
                {block.type === 'header' && (
                  <h2 className="text-3xl font-headline text-primary mt-12 mb-4">
                    {block.value}
                  </h2>
                )}
              </div>
            ))}
          </div>

          <Separator className="bg-primary/10" />

          {/* Feedback Section */}
          <footer className="bg-card/40 border border-primary/10 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-headline text-primary">Was This Helpful?</h3>
              <p className="text-xs text-foreground/40 uppercase tracking-widest">Help us refine our intelligence</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => handleFeedback('up')} variant="outline" className="w-20 h-20 rounded-2xl border-primary/10 hover:bg-primary/5 hover:border-primary group">
                <ThumbsUp className="w-6 h-6 text-foreground/40 group-hover:text-primary" />
              </Button>
              <Button onClick={() => handleFeedback('down')} variant="outline" className="w-20 h-20 rounded-2xl border-primary/10 hover:bg-accent/5 hover:border-accent group">
                <ThumbsDown className="w-6 h-6 text-foreground/40 group-hover:text-accent" />
              </Button>
            </div>
          </footer>

          {/* Related Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-widest text-primary/60 font-bold">Related Documentation</h4>
              <div className="space-y-4">
                {MOCK_ARTICLE.related.map(art => (
                  <Link 
                    key={art.id} 
                    href={`/help/${art.id}`}
                    className="flex items-center justify-between p-6 rounded-2xl bg-card/20 border border-primary/5 hover:border-primary/20 transition-all group"
                  >
                    <span className="text-sm font-headline group-hover:text-primary transition-colors">{art.title}</span>
                    <ArrowRight className="w-4 h-4 text-foreground/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-widest text-primary/60 font-bold">Need Personal Assistance?</h4>
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
                <LifeBuoy className="w-10 h-10 text-primary/40" />
                <p className="text-sm text-foreground/60 leading-relaxed font-body">
                  If our documentation {"didn't"} resolve your inquiry, our human curation team is available for a direct dispatch.
                </p>
                <Button asChild className="w-full h-12 bg-primary text-primary-foreground font-headline tracking-widest">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
