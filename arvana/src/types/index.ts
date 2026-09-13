export interface Product {
  id: string;
  name: string;
  category: string;
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
  seatingCapacity?: string;
  assemblyRequired: boolean;
  availability: "In Stock" | "Made to Order" | "Out of Stock";
  isNew: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  colorOptions?: { name: string; hex: string }[];
  materialOptions?: string[];
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
  | "Delivered";

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
}

