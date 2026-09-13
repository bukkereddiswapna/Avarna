import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useToast } from "./ToastContext";
import { getProductById } from "../data/products";

interface WishlistContextValue {
  items: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = "arvana_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
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

  const toggleWishlist = (productId: string) => {
    // Decide the action first, then apply the state update and fire the
    // toast as two separate, single-fire steps. Calling showToast() (a side
    // effect) from inside the setItems updater is unsafe: React 18 Strict
    // Mode intentionally invokes updater functions twice in development to
    // surface impure updaters, which was causing the toast to appear twice.
    const product = getProductById(productId);
    const alreadyWishlisted = items.includes(productId);

    setItems((prev) =>
      alreadyWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    if (alreadyWishlisted) {
      showToast(`${product?.name ?? "Item"} removed from wishlist`, "info");
    } else {
      showToast(`${product?.name ?? "Item"} added to wishlist`, "success");
    }
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  };

  const isWishlisted = (productId: string) => items.includes(productId);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
