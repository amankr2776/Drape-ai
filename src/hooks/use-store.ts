'use client';

import { useState, useEffect, useCallback } from 'react';

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
    } else {
      newWishlist = [...wishlist, product];
    }
    setWishlist(newWishlist);
    save(newWishlist, cart);
  };

  const addToCart = (product: Product) => {
    if (!cart.find(p => p.id === product.id)) {
      const newCart = [...cart, product];
      setCart(newCart);
      save(wishlist, newCart);
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
