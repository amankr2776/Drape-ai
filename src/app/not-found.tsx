import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <div className="relative w-64 h-96 mb-8">
        <Image 
          src="https://picsum.photos/seed/404-fashion/400/600" 
          alt="Fashion figure looking lost" 
          fill
          className="object-cover rounded-lg"
          data-ai-hint="fashion editorial sad"
        />
      </div>
      <h1 className="text-5xl md:text-7xl font-headline text-primary">Lost in the Wardrobe?</h1>
      <p className="mt-4 text-lg text-foreground/70 max-w-md">
        It seems the page you're looking for has been misplaced amongst the silks and satins.
      </p>
      <Button asChild className="mt-8 font-headline text-lg tracking-wider">
        <Link href="/">Take Me Home</Link>
      </Button>
    </div>
  );
}
