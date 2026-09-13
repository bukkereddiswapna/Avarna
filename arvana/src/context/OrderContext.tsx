import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Order, OrderItem, Address, OrderStatus } from "../types";
import { ORDER_STAGES } from "../types";
import { useAuth } from "./AuthContext";

interface PlaceOrderInput {
  items: OrderItem[];
  address: Address;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "online" | "cod";
}

interface OrderContextValue {
  orders: Order[];
  placeOrder: (input: PlaceOrderInput) => Order;
  getOrder: (id: string) => Order | undefined;
  getOrderStatus: (order: Order) => OrderStatus;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

// Orders are stored globally (keyed by userId inside each record) so an
// order ID like ORD-1001 keeps incrementing across the whole demo store,
// the way a real order-numbering system would.
const ORDERS_KEY = "arvana_orders";
const COUNTER_KEY = "arvana_order_counter";

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function nextOrderId(): string {
  const current = Number(localStorage.getItem(COUNTER_KEY) ?? "1000");
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return `ORD-${next}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder: OrderContextValue["placeOrder"] = (input) => {
    const order: Order = {
      id: nextOrderId(),
      userId: user?.id ?? "guest",
      placedAt: new Date().toISOString(),
      ...input,
    };
    setOrders((prev) => [...prev, order]);
    return order;
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  // Simulates order progress over time so the demo feels alive without a
  // real fulfilment backend: each ~elapsed period advances one stage.
  // Replace with a real status field from the backend when available.
  const getOrderStatus = (order: Order): OrderStatus => {
    const hoursElapsed = (Date.now() - new Date(order.placedAt).getTime()) / (1000 * 60 * 60);
    const stageIndex = Math.min(Math.floor(hoursElapsed / 18), ORDER_STAGES.length - 1);
    return ORDER_STAGES[stageIndex];
  };

  const userOrders = user ? orders.filter((o) => o.userId === user.id) : [];

  return (
    <OrderContext.Provider value={{ orders: userOrders, placeOrder, getOrder, getOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
