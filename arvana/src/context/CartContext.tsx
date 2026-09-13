import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "../types";
import { getProductById } from "../data/products";
import { useToast } from "./ToastContext";

interface CartContextValue {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number, color?: string, material?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "arvana_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart: CartContextValue["addToCart"] = (productId, quantity = 1, color, material) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.color === color && i.material === material);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.color === color && i.material === material
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity, color, material }];
    });
    const product = getProductById(productId);
    showToast(`${product?.name ?? "Item"} added to cart`, "success");
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const product = getProductById(i.productId);
        return sum + (product?.price ?? 0) * i.quantity;
      }, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
