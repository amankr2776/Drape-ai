'use client';

import { Button } from '@/components/ui/button';
import { DrapeLogo } from '@/components/drape-logo';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <Image
        src="https://picsum.photos/seed/drape-bg/1920/1080"
        alt="Abstract fashion background"
        fill
        className="object-cover object-center opacity-20"
        priority
        data-ai-hint="abstract background"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <DrapeLogo className="text-5xl md:text-7xl" />
        </div>
        <p
          className="mt-6 max-w-2xl font-body text-lg text-foreground/80 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          Experience the future of fashion. Personalized, AI-powered styling from
          a new perspective. Your personal haute couture stylist awaits.
        </p>
        <Button
          size="lg"
          className="mt-10 font-headline text-lg tracking-wider animate-fade-in-up group"
          style={{ animationDelay: '0.6s' }}
          onClick={() => router.push('/dashboard')}
        >
          Enter the Atelier
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
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
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
