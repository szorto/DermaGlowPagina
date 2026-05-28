'use client';

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from 'react';
import { type Product, displayPrice } from '@/data/products';

export interface CartItem {
  product:       Product;
  quantity:      number;
  // Prices snapshotted at add time — never change even if product is edited
  snapshotPrice: number;   // displayPrice at time of adding (discounted if on sale)
  snapshotOrig?: number;   // original price if on sale, for display
}

interface CartContextValue {
  items:          CartItem[];
  totalCount:     number;
  totalPrice:     number;
  addItem:        (product: Product) => void;
  removeItem:     (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart:      () => void;
}

const STORAGE_KEY = 'dermaglow_cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    // Backfill snapshotPrice for old cart items that didn't have it
    return parsed.map((i) => ({
      ...i,
      snapshotPrice: i.snapshotPrice ?? displayPrice(i.product),
      snapshotOrig:  i.snapshotOrig  ?? (i.product.precioNuevo != null ? i.product.precio : undefined),
    }));
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,    setItems]    = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setItems(loadCart()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveCart(items); }, [items, hydrated]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Snapshot price at add time
      const snapshotPrice = displayPrice(product);
      const snapshotOrig  = product.precioNuevo != null ? product.precio : undefined;
      return [...prev, { product, quantity: 1, snapshotPrice, snapshotOrig }];
    });
  }, []);

  const removeItem = useCallback((id: string) =>
    setItems((p) => p.filter((i) => i.product._id !== id)), []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) setItems((p) => p.filter((i) => i.product._id !== id));
    else          setItems((p) => p.map((i) => i.product._id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  // Use snapshotPrice so total never changes after adding to cart
  const totalPrice = items.reduce((sum, i) => sum + i.snapshotPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalCount, totalPrice, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
