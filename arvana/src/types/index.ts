export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  room: string[];
  collection: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  material: string;
  color: string;
  finish: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  weight: string;
  warranty?: string;
  seatingCapacity?: string;
  assemblyRequired: boolean;
  availability: "In Stock" | "Made to Order" | "Out of Stock";
  isNew: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  colorOptions?: { name: string; hex: string }[];
  materialOptions?: string[];
  // --- Admin / inventory fields ---
  sku: string;
  // Whether this product's purchasability is gated by `stock`. Made-to-order
  // items don't hold physical inventory, so they stay purchasable regardless
  // of `stock` as long as `status` is "active".
  trackStock: boolean;
  stock: number;
  lowStockThreshold: number;
  // Admin-controlled publish state. Only "active" products (and, for
  // purchase purposes, in-stock ones) are shown/purchasable on the shop.
  status: "draft" | "active" | "out_of_stock" | "inactive";
  updatedAt: string; // ISO date string, bumped on every admin edit
}

export interface StockHistoryEntry {
  id: string;
  productId: string;
  date: string; // ISO date string
  previousStock: number;
  change: number; // signed — positive for additions, negative for reductions
  newStock: number;
  reason: "Stock Added" | "Order" | "Manual Adjustment" | "Return" | "Damaged" | "Cancelled Order";
  note?: string; // e.g. related order ID
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface Offer {
  id: string;
  code: string;
  discountType: "percentage" | "amount";
  discountValue: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  minOrderValue: number;
  maxDiscount?: number;
  active: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string; // demo only — never store plaintext passwords in a real backend
}

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  material?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
}

export interface CollectionInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string; // demo only — never store plaintext passwords in a real backend
}

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Work"
  name: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
}

export type OrderStatus =
  | "Order Placed"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

// The customer-facing progress tracker only ever animates through these six
// stages — Cancelled/Returned are terminal states handled separately so the
// existing tracker UI doesn't need to change.
export const ORDER_STAGES: OrderStatus[] = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  material?: string;
}

export type PaymentStatus = "Paid" | "Pending" | "Refunded";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "online" | "cod";
  placedAt: string; // ISO date string
  // Admin-managed fields. `status` defaults to "Order Placed" at checkout
  // and from then on is only advanced by the admin (or by the existing
  // time-based simulation in getOrderStatus, whichever is further along).
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

