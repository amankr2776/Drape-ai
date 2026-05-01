'use client';

import { Notification, NotificationType } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { 
  Tag, 
  Sparkles, 
  Lightbulb, 
  Zap, 
  ShieldAlert, 
  Calendar,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationCardProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  variant?: 'dropdown' | 'page';
}

const TYPE_CONFIG: Record<NotificationType, { icon: any; color: string; label: string }> = {
  price_drop: { icon: Tag, color: 'text-primary', label: 'Price Drop' },
  style_match: { icon: Sparkles, color: 'text-green-500', label: 'Match' },
  style_tip: { icon: Lightbulb, color: 'text-blue-500', label: 'Tip' },
  feature: { icon: Zap, color: 'text-purple-500', label: 'Feature' },
  account: { icon: ShieldAlert, color: 'text-red-500', label: 'Alert' },
  digest: { icon: Calendar, color: 'text-white', label: 'Digest' },
};

export function NotificationCard({ notification, onRead, onDelete, variant = 'dropdown' }: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "group relative flex gap-4 p-4 transition-all duration-300 border-l-2",
        notification.isRead ? "border-transparent opacity-60" : "border-primary bg-primary/5",
        variant === 'page' ? "rounded-xl border border-primary/10 mb-4" : "hover:bg-primary/10"
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className={cn("p-2 rounded-full h-fit", config.color, "bg-current/10")}>
        <Icon size={variant === 'page' ? 24 : 18} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <p className="font-bold text-sm">{notification.title}</p>
          <span className="text-[10px] text-foreground/40 font-body">
            {formatDistanceToNow(notification.timestamp)} ago
          </span>
        </div>
        <p className="text-xs text-foreground/70 leading-relaxed">
          {notification.description}
        </p>

        {notification.metadata?.link && (
          <Button variant="link" className="p-0 h-auto text-[10px] uppercase tracking-widest text-primary mt-2">
            {notification.type === 'price_drop' ? 'Buy Now' : 'View Outfits'} <ChevronRight size={10} className="ml-1" />
          </Button>
        )}
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-accent transition-all"
      >
        <X size={14} />
      </button>
    </div>
  );
}
