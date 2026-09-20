import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/admin/StatusBadge";
import { formatPrice } from "../../utils/format";
import type { OrderStatus, PaymentStatus } from "../../types";

const STATUS_OPTIONS: OrderStatus[] = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
];
const PAYMENT_OPTIONS: PaymentStatus[] = ["Paid", "Pending", "Refunded"];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const { getOrder, updateOrderStatus, updatePaymentStatus } = useOrders();
  const { users } = useAuth();

  const order = getOrder(id ?? "");
  if (!order) return <Navigate to="/admin/orders" replace />;

  const customer = users.find((u) => u.id === order.userId);

  return (
    <div className="max-w-4xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-charcoal-light hover:text-forest">
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{order.id}</h1>
          <p className="mt-1 text-sm text-charcoal-light">Placed on {new Date(order.placedAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg text-charcoal">Items</h2>
            <div className="mt-4 divide-y divide-cream-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-charcoal font-medium truncate">{item.name}</p>
                    {(item.color || item.material) && (
                      <p className="text-xs text-charcoal-light">
                        {item.color && <>Color: {item.color} </>}
                        {item.material && <>· Material: {item.material}</>}
                      </p>
                    )}
                    <p className="text-xs text-charcoal-light">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-charcoal font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-cream-border space-y-1.5 text-sm">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Delivery</span><span>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-medium text-charcoal pt-1.5 border-t border-cream-border">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg text-charcoal">Delivery Address</h2>
            <p className="mt-3 text-sm text-charcoal">{order.address.name}</p>
            <p className="text-sm text-charcoal-light">{order.address.fullAddress}</p>
            <p className="text-sm text-charcoal-light">
              {order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
            <p className="mt-1 text-sm text-charcoal-light">Mobile: {order.address.mobile}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg text-charcoal">Customer</h2>
            <p className="mt-3 text-sm text-charcoal">{customer?.name ?? "Guest"}</p>
            <p className="text-sm text-charcoal-light">{customer?.email}</p>
            <p className="text-sm text-charcoal-light">{customer?.mobile}</p>
          </div>

          <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-display text-lg text-charcoal">Manage Order</h2>
            <div>
              <label className="text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block">Order Status</label>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-cream-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block">Payment Status</label>
              <select
                value={order.paymentStatus}
                onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                className="w-full rounded-lg border border-cream-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest"
              >
                {PAYMENT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-charcoal-light capitalize">
              Payment method: {order.paymentMethod === "online" ? "Online" : "Cash on Delivery"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
