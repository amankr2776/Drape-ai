import { cn } from '@/lib/utils';

export function DrapeLogo({ className }: { className?: string }) {
  return (
    <div className={cn('inline-block group cursor-pointer', className)}>
      <h1 className="font-headline text-3xl font-bold tracking-[0.2em] text-primary transition-colors duration-500">
        DRAPE
        <span className="ml-1 text-xs font-body tracking-[0.3em] text-foreground/50 group-hover:text-primary transition-colors">AI</span>
      </h1>
    </div>
  );
}
