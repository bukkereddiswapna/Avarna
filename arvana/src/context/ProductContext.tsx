import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product, Category, Offer, StockHistoryEntry } from "../types";
import { products as seedProducts } from "../data/products";

/**
 * DEMO DATA LAYER — frontend only.
 *
 * There is no backend yet, so this context seeds itself from the static
 * catalog in `data/products.ts` on first run, then persists every admin
 * change (products, categories, offers, stock history) to localStorage so
 * it survives page refreshes. Every page that shows products — Shop, Home
 * sections, product details, search, cart, wishlist, checkout — reads from
 * this context instead of importing the static array directly, so admin
 * changes are reflected across the whole site immediately.
 *
 * To move to a real backend later: keep this context's public shape (the
 * functions below) and swap the localStorage reads/writes for API calls.
 */

const PRODUCTS_KEY = "arvana_admin_products";
const CATEGORIES_KEY = "arvana_admin_categories";
const OFFERS_KEY = "arvana_admin_offers";
const STOCK_HISTORY_KEY = "arvana_admin_stock_history";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function seedCategories(): Category[] {
  const names = Array.from(new Set(seedProducts.map((p) => p.category)));
  return names.map((name) => ({
    id: `cat_${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    active: true,
  }));
}

export type StockChangeReason = StockHistoryEntry["reason"];
export type InventoryStatus = "IN STOCK" | "LOW STOCK" | "OUT OF STOCK" | "MADE TO ORDER";

export function getInventoryStatus(product: Product): InventoryStatus {
  if (!product.trackStock) return "MADE TO ORDER";
  if (product.stock <= 0) return "OUT OF STOCK";
  if (product.stock <= product.lowStockThreshold) return "LOW STOCK";
  return "IN STOCK";
}

// Whether a customer can currently add this product to their cart.
export function isPurchasable(product: Product): boolean {
  if (product.status !== "active") return false;
  if (product.trackStock && product.stock <= 0) return false;
  return true;
}

// Whether a product should appear at all on the customer-facing site.
// Out-of-stock items still show (with purchasing disabled, like any real
// storefront) — only drafts and admin-deactivated products are hidden.
export function isVisibleToCustomers(product: Product): boolean {
  return product.status === "active" || product.status === "out_of_stock";
}

interface ProductContextValue {
  products: Product[];
  categories: Category[];
  offers: Offer[];
  stockHistory: StockHistoryEntry[];

  // Filter lists derived from the LIVE product list, same shape the
  // customer Shop page originally consumed from the static data module.
  categoryNames: string[];
  rooms: string[];
  materials: string[];
  collections: string[];

  getProductById: (id: string) => Product | undefined;
  addProduct: (data: Omit<Product, "id" | "updatedAt">) => Product;
  updateProduct: (id: string, data: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;

  setStock: (productId: string, newStock: number, reason: StockChangeReason, note?: string) => void;
  adjustStock: (productId: string, delta: number, reason: StockChangeReason, note?: string) => void;
  setLowStockThreshold: (productId: string, threshold: number) => void;
  stockHistoryFor: (productId: string) => StockHistoryEntry[];

  addCategory: (data: Omit<Category, "id">) => Category;
  updateCategory: (id: string, data: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => { success: boolean; error?: string };

  addOffer: (data: Omit<Offer, "id">) => Offer;
  updateOffer: (id: string, data: Partial<Omit<Offer, "id">>) => void;
  deleteOffer: (id: string) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => load(PRODUCTS_KEY, seedProducts));
  const [categories, setCategories] = useState<Category[]>(() => load(CATEGORIES_KEY, seedCategories()));
  const [offers, setOffers] = useState<Offer[]>(() => load(OFFERS_KEY, [] as Offer[]));
  const [stockHistory, setStockHistory] = useState<StockHistoryEntry[]>(() =>
    load(STOCK_HISTORY_KEY, [] as StockHistoryEntry[])
  );

  useEffect(() => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem(OFFERS_KEY, JSON.stringify(offers)), [offers]);
  useEffect(() => localStorage.setItem(STOCK_HISTORY_KEY, JSON.stringify(stockHistory)), [stockHistory]);

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const addProduct: ProductContextValue["addProduct"] = (data) => {
    const product: Product = { ...data, id: `prod_${Date.now()}`, updatedAt: new Date().toISOString() };
    setProducts((prev) => [product, ...prev]);
    if (product.trackStock && product.stock > 0) {
      logStockChange(product.id, 0, product.stock, "Stock Added", "Initial stock on product creation");
    }
    return product;
  };

  const updateProduct: ProductContextValue["updateProduct"] = (id, data) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)));
  };

  const deleteProduct: ProductContextValue["deleteProduct"] = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const logStockChange = (
    productId: string,
    previousStock: number,
    newStock: number,
    reason: StockChangeReason,
    note?: string
  ) => {
    const entry: StockHistoryEntry = {
      id: `stk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      productId,
      date: new Date().toISOString(),
      previousStock,
      change: newStock - previousStock,
      newStock,
      reason,
      note,
    };
    setStockHistory((prev) => [entry, ...prev]);
  };

  // Central place that actually mutates stock + auto-syncs `status` per the
  // spec: hitting 0 auto-marks a product Out of Stock, and restocking an
  // auto-marked product brings it back to Active automatically. A product
  // an admin manually set to Draft/Inactive is left alone either way.
  //
  // The state update and the stock-history log are computed and dispatched
  // as sibling calls, not nested (calling setStockHistory from inside the
  // setProducts updater would get double-invoked under React Strict Mode,
  // the same bug that caused the wishlist toast to fire twice — see
  // WishlistContext for the full explanation).
  const applyStockChange = (productId: string, newStockRaw: number, reason: StockChangeReason, note?: string) => {
    const current = products.find((p) => p.id === productId);
    if (!current) return;
    const newStock = Math.max(0, newStockRaw);
    let status = current.status;
    if (newStock <= 0 && status === "active") status = "out_of_stock";
    else if (newStock > 0 && status === "out_of_stock") status = "active";

    logStockChange(current.id, current.stock, newStock, reason, note);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock, status, updatedAt: new Date().toISOString() } : p))
    );
  };

  const setStock: ProductContextValue["setStock"] = (productId, newStock, reason, note) =>
    applyStockChange(productId, newStock, reason, note);

  const adjustStock: ProductContextValue["adjustStock"] = (productId, delta, reason, note) => {
    const current = products.find((p) => p.id === productId);
    if (!current) return;
    applyStockChange(productId, current.stock + delta, reason, note);
  };

  const setLowStockThreshold: ProductContextValue["setLowStockThreshold"] = (productId, threshold) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, lowStockThreshold: Math.max(0, threshold) } : p))
    );
  };

  const stockHistoryFor = (productId: string) => stockHistory.filter((h) => h.productId === productId);

  const addCategory: ProductContextValue["addCategory"] = (data) => {
    const category: Category = { ...data, id: `cat_${Date.now()}` };
    setCategories((prev) => [...prev, category]);
    return category;
  };

  const updateCategory: ProductContextValue["updateCategory"] = (id, data) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCategory: ProductContextValue["deleteCategory"] = (id) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return { success: false, error: "Category not found." };
    const inUse = products.some((p) => p.category === category.name);
    if (inUse) {
      return {
        success: false,
        error: `"${category.name}" is used by one or more products. Reassign or remove those products first.`,
      };
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  const addOffer: ProductContextValue["addOffer"] = (data) => {
    const offer: Offer = { ...data, id: `off_${Date.now()}` };
    setOffers((prev) => [offer, ...prev]);
    return offer;
  };

  const updateOffer: ProductContextValue["updateOffer"] = (id, data) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
  };

  const deleteOffer: ProductContextValue["deleteOffer"] = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const categoryNames = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const rooms = useMemo(() => Array.from(new Set(products.flatMap((p) => p.room))), [products]);
  const materials = useMemo(
    () => Array.from(new Set(products.map((p) => p.material.split(",")[0].trim()))),
    [products]
  );
  const collections = useMemo(() => Array.from(new Set(products.map((p) => p.collection))), [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        offers,
        stockHistory,
        categoryNames,
        rooms,
        materials,
        collections,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        setStock,
        adjustStock,
        setLowStockThreshold,
        stockHistoryFor,
        addCategory,
        updateCategory,
        deleteCategory,
        addOffer,
        updateOffer,
        deleteOffer,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
