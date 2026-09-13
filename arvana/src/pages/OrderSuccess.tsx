import { useParams, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { formatPrice } from "../utils/format";
import { LinkButton } from "../components/common/Button";
import type { Order } from "../types";

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation() as { state?: { order?: Order } };
  const { getOrder, getOrderStatus } = useOrders();
  // Prefer the order handed off directly from Checkout (avoids any timing
  // gap with context/localStorage updates); fall back to a lookup by ID so
  // a page refresh on this URL still works.
  const order = location.state?.order ?? getOrder(id ?? "");

  if (!order) return <Navigate to="/" replace />;
  const status = getOrderStatus(order);

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-5">
      <div className="text-center max-w-lg animate-fade-up">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest/10">
          <CheckCircle2 size={44} className="text-forest" strokeWidth={1.4} />
        </div>
        <h1 className="mt-8 font-display text-3xl md:text-4xl text-charcoal">Order Placed Successfully!</h1>
        <p className="mt-4 text-sm md:text-base text-charcoal-light">
          Your order has been placed successfully. A confirmation has been recorded to your account.
        </p>

        <div className="mt-8 border border-cream-border px-6 sm:px-8 py-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-charcoal-light">Order ID</span>
            <span className="font-display text-lg text-charcoal">{order.id}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-charcoal-light">Order Date</span>
            <span className="text-sm text-charcoal">
              {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-charcoal-light">Status</span>
            <span className="text-[11px] uppercase tracking-wide border border-forest text-forest px-3 py-1">
              {status}
            </span>
          </div>

          <div className="mt-5 border-t border-cream-border pt-4 space-y-3">
            <span className="text-xs uppercase tracking-wide text-charcoal-light">Products Ordered</span>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="h-12 w-12 object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal truncate">{item.name}</p>
                  <p className="text-xs text-charcoal-light">Qty {item.quantity}</p>
                </div>
                <span className="text-sm text-charcoal">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-cream-border pt-4">
            <span className="text-xs uppercase tracking-wide text-charcoal-light">Total Amount</span>
            <span className="text-sm font-medium text-charcoal">{formatPrice(order.total)}</span>
          </div>
          <div className="mt-4 border-t border-cream-border pt-4">
            <span className="text-xs uppercase tracking-wide text-charcoal-light">Delivery Address</span>
            <p className="mt-1 text-sm text-charcoal">
              {order.address.name}, {order.address.fullAddress}, {order.address.city}, {order.address.state} –{" "}
              {order.address.pincode}
            </p>
          </div>
          <p className="mt-4 text-xs uppercase tracking-wide text-charcoal-light">
            Estimated Delivery: 5–7 business days
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <LinkButton to={`/account/orders/${order.id}`}>View My Orders</LinkButton>
          <LinkButton to="/" variant="outline">
            Back to Home
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

