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
  allOrders: Order[];
  placeOrder: (input: PlaceOrderInput) => Order;
  getOrder: (id: string) => Order | undefined;
  getOrderStatus: (order: Order) => OrderStatus;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: Order["paymentStatus"]) => void;
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
      status: "Order Placed",
      paymentStatus: input.paymentMethod === "online" ? "Paid" : "Pending",
      ...input,
    };
    setOrders((prev) => [...prev, order]);
    return order;
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const updateOrderStatus: OrderContextValue["updateOrderStatus"] = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const updatePaymentStatus: OrderContextValue["updatePaymentStatus"] = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)));
  };

  // Simulates order progress over time so the demo feels alive without a
  // real fulfilment backend, while still respecting any status the admin
  // has manually set: whichever stage is further along wins. Cancelled and
  // Returned are terminal admin-only states and always take priority.
  const getOrderStatus = (order: Order): OrderStatus => {
    if (order.status === "Cancelled" || order.status === "Returned") return order.status;

    const hoursElapsed = (Date.now() - new Date(order.placedAt).getTime()) / (1000 * 60 * 60);
    const simulatedIndex = Math.min(Math.floor(hoursElapsed / 18), ORDER_STAGES.length - 1);
    const explicitIndex = ORDER_STAGES.indexOf(order.status);
    const stageIndex = Math.max(simulatedIndex, explicitIndex === -1 ? 0 : explicitIndex);
    return ORDER_STAGES[stageIndex];
  };

  const userOrders = user ? orders.filter((o) => o.userId === user.id) : [];

  return (
    <OrderContext.Provider
      value={{ orders: userOrders, allOrders: orders, placeOrder, getOrder, getOrderStatus, updateOrderStatus, updatePaymentStatus }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
