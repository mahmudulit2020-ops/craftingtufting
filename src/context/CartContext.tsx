import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../lib/types';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  advance: number;
  remaining: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'ct_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (item.type === 'product') {
        const existing = prev.find(
          (p) => p.id === item.id && p.size === item.size
        );
        if (existing) {
          return prev.map((p) =>
            p.id === item.id && p.size === item.size
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          );
        }
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.type === 'custom' ? item.customConfig?.totalPrice ?? 0 : item.price;
    return sum + price * (item.type === 'custom' ? 1 : item.quantity);
  }, 0);

  const total = subtotal;
  const advance = total * 0.5;
  const remaining = total - advance;
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        total,
        advance,
        remaining,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
