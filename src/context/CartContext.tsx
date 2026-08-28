"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku: string;
  size?: string;
  gender?: string;
};

type Variant = { size?: string; gender?: string };

function lineKey(id: string, variant?: Variant): string {
  return `${id}::${variant?.size || ""}::${variant?.gender || ""}`;
}

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, variant?: Variant) => void;
  updateQuantity: (id: string, quantity: number, variant?: Variant) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("gmk_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gmk_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const key = lineKey(item.id, item);
      const existing = prev.find(i => lineKey(i.id, i) === key);
      if (existing) {
        return prev.map(i => lineKey(i.id, i) === key ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, variant?: Variant) => {
    const key = lineKey(id, variant);
    setItems(prev => prev.filter(i => lineKey(i.id, i) !== key));
  };

  const updateQuantity = (id: string, quantity: number, variant?: Variant) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }
    const key = lineKey(id, variant);
    setItems(prev => prev.map(i => lineKey(i.id, i) === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
