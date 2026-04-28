import { cn } from '@/lib/utils';

export function DrapeLogo({ className }: { className?: string }) {
  return (
    <div className={cn('inline-block', className)}>
      <h1 className="font-headline text-3xl font-bold tracking-[0.2em] text-primary">
        DRAPE
        <span className="ml-1 text-xs font-body tracking-widest text-foreground/70">AI</span>
      </h1>
    </div>
  );
}
