import { Link, useParams, Navigate } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { formatPrice } from "../../utils/format";
import OrderStatusTracker from "../../components/common/OrderStatusTracker";

export default function OrderDetails() {
  const { id } = useParams();
  const { getOrder, getOrderStatus } = useOrders();
  const order = getOrder(id ?? "");

  if (!order) return <Navigate to="/account/orders" replace />;

  const status = getOrderStatus(order);

  return (
    <div>
      <Link to="/account/orders" className="text-xs uppercase tracking-wide text-charcoal-light hover:text-forest">
        ← Back to My Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-charcoal">{order.id}</h2>
        <span className="text-[11px] uppercase tracking-wide border border-forest text-forest px-3 py-1">
          {status}
        </span>
      </div>
      <p className="mt-1 text-sm text-charcoal-light">
        Placed on{" "}
        {new Date(order.placedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="mt-10 border border-cream-border p-6">
        <OrderStatusTracker status={status} />
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <h3 className="font-display text-lg text-charcoal mb-4">Items</h3>
          <div className="divide-y divide-cream-border border-t border-b border-cream-border">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 py-4">
                <img src={item.image} alt={item.name} className="h-20 w-20 object-cover shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{item.name}</p>
                  {(item.color || item.material) && (
                    <p className="mt-0.5 text-xs text-charcoal-light">
                      {item.color && <>Color: {item.color} </>}
                      {item.material && <>· Material: {item.material}</>}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-charcoal-light">Qty {item.quantity}</p>
                </div>
                <p className="text-sm text-charcoal font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-display text-lg text-charcoal mb-3">Delivery Address</h3>
            <div className="border border-cream-border p-4 text-sm text-charcoal-light">
              <p className="text-charcoal font-medium">{order.address.name}</p>
              <p className="mt-1">{order.address.fullAddress}</p>
              <p>
                {order.address.city}, {order.address.state} – {order.address.pincode}
              </p>
              <p className="mt-1">Mobile: {order.address.mobile}</p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-charcoal mb-3">Order Summary</h3>
            <div className="border border-cream-border p-4 space-y-2 text-sm">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span className="text-charcoal">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Delivery</span>
                <span className="text-charcoal">{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-cream-border pt-2 font-medium text-charcoal">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <p className="pt-2 text-xs text-charcoal-light">
                Payment: {order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
