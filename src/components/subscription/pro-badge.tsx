'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProBadge({ className, size = 'sm' }: ProBadgeProps) {
  const sizeClasses = {
    sm: 'text-[8px] px-1.5 py-0',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-3 py-1',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-block"
    >
      <Badge 
        className={cn(
          "bg-primary text-primary-foreground font-bold tracking-widest border-none shadow-gold-glow",
          sizeClasses[size],
          "relative overflow-hidden group",
          className
        )}
      >
        <span className="relative z-10">PRO</span>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
      </Badge>
    </motion.div>
  );
}
