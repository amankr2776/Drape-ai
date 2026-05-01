
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  platform: 'Amazon' | 'Flipkart' | 'Meesho' | 'Myntra';
  imageUrl: string;
  aiReason?: string;
  rating?: number;
  reviews?: number;
  link: string;
};

export function useStore() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedWishlist = localStorage.getItem('drape_wishlist');
    const savedCart = localStorage.getItem('drape_cart');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCart) setCart(JSON.parse(savedCart));
    setIsLoaded(true);
  }, []);

  const save = useCallback((w: Product[], c: Product[]) => {
    localStorage.setItem('drape_wishlist', JSON.stringify(w));
    localStorage.setItem('drape_cart', JSON.stringify(c));
  }, []);

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.find(p => p.id === product.id);
    let newWishlist;
    if (exists) {
      newWishlist = wishlist.filter(p => p.id !== product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your atelier collection.`,
      });
    } else {
      newWishlist = [...wishlist, product];
      toast({
        title: "Added to Wishlist",
        description: `${product.name} is now saved in your atelier.`,
      });
      // Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([10, 30, 10]);
      }
    }
    setWishlist(newWishlist);
    save(newWishlist, cart);
  };

  const addToCart = (product: Product) => {
    if (!cart.find(p => p.id === product.id)) {
      const newCart = [...cart, product];
      setCart(newCart);
      save(wishlist, newCart);
      toast({
        title: "Added to Plan",
        description: `${product.name} added to your shopping plan.`,
      });
    } else {
      removeFromCart(product.id);
      toast({
        title: "Removed from Plan",
        description: `${product.name} removed from your shopping plan.`,
      });
    }
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(p => p.id !== id);
    setCart(newCart);
    save(wishlist, newCart);
  };

  const clearCart = () => {
    setCart([]);
    save(wishlist, []);
    toast({
      title: "Plan Cleared",
      description: "All items have been removed from your shopping plan.",
    });
  };

  return {
    wishlist,
    cart,
    isLoaded,
    toggleWishlist,
    addToCart,
    removeFromCart,
    clearCart,
    isInWishlist: (id: string) => !!wishlist.find(p => p.id === id),
    isInCart: (id: string) => !!cart.find(p => p.id === id)
  };
}
