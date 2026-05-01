'use client';

import { useState, useCallback, useMemo } from 'react';

export type NotificationType = 'price_drop' | 'style_match' | 'style_tip' | 'feature' | 'account' | 'digest';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: {
    currentPrice?: string;
    oldPrice?: string;
    platform?: string;
    link?: string;
  };
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'price_drop',
    title: 'Price Drop Alert',
    description: 'Nike Air Max is now ₹1,299 (was ₹1,899) on Flipkart',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
    isRead: false,
    metadata: { currentPrice: '₹1,299', oldPrice: '₹1,899', platform: 'Flipkart', link: '#' }
  },
  {
    id: '2',
    type: 'style_match',
    title: 'New Outfit Match',
    description: 'We found 12 new outfits matching your Pear body type',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    metadata: { link: '/results' }
  },
  {
    id: '3',
    type: 'style_tip',
    title: 'Style Tip',
    description: 'Tip: A-line skirts elongate your silhouette perfectly',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    isRead: true,
  },
  {
    id: '4',
    type: 'feature',
    title: 'New Feature',
    description: 'New: Compare outfits side by side is now available',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: true,
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Note: Automation alerts (price drops, matches, etc.) should only be added to state here.
  // No toast triggers for these automated events as per new requirements.

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length
  , [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    deleteNotification,
    clearAll
  };
}
