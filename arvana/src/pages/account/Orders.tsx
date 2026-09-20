import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { formatPrice } from "../../utils/format";
import { LinkButton } from "../../components/common/Button";

export default function Orders() {
  const { orders, getOrderStatus } = useOrders();

  const sorted = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border border-cream-border bg-white shadow-sm">
        <Package size={32} className="mx-auto text-beige-dark" strokeWidth={1.3} />
        <p className="mt-4 font-display text-xl text-charcoal">No orders yet.</p>
        <p className="mt-1 text-sm text-charcoal-light">When you place an order, it will show up here.</p>
        <div className="mt-6">
          <LinkButton to="/shop">Start Shopping</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl text-charcoal mb-6">My Orders</h2>
      <div className="space-y-4">
        {sorted.map((order) => {
          const status = getOrderStatus(order);
          return (
            <Link
              key={order.id}
              to={`/account/orders/${order.id}`}
              className="block rounded-xl border border-cream-border bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-forest hover:-translate-y-0.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-charcoal">{order.id}</p>
                  <p className="text-xs text-charcoal-light">
                    Placed on {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className="text-[11px] uppercase tracking-wide rounded-full border border-forest text-forest px-3 py-1">
                  {status}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {order.items.slice(0, 4).map((item, i) => (
                  <img key={i} src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover shadow-sm" />
                ))}
                {order.items.length > 4 && (
                  <span className="text-xs text-charcoal-light">+{order.items.length - 4} more</span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-charcoal-light">{order.items.length} item(s)</span>
                <span className="font-medium text-charcoal">{formatPrice(order.total)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
