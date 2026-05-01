'use client';

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type SubscriptionPlan = 'FREE' | 'PRO';

export function useSubscription() {
  const [plan, setPlan] = useState<SubscriptionPlan>('FREE');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load plan from localStorage for prototype persistence
  useEffect(() => {
    const savedPlan = localStorage.getItem('drape_plan') as SubscriptionPlan;
    if (savedPlan) setPlan(savedPlan);
  }, []);

  const upgradeToPro = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPlan('PRO');
    localStorage.setItem('drape_plan', 'PRO');
    setIsLoading(false);
    
    return true;
  }, []);

  const cancelSubscription = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPlan('FREE');
    localStorage.setItem('drape_plan', 'FREE');
    setIsLoading(false);
    
    toast({
      title: "Subscription Cancelled",
      description: "You have been moved back to the Free plan.",
    });
  }, [toast]);

  return {
    plan,
    isPro: plan === 'PRO',
    isLoading,
    upgradeToPro,
    cancelSubscription,
  };
}
