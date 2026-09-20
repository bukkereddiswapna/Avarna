import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/admin/StatusBadge";
import { formatPrice } from "../../utils/format";
import type { OrderStatus } from "../../types";

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

export default function AdminOrders() {
  const { allOrders, updateOrderStatus } = useOrders();
  const { users } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const customerFor = (userId: string) => users.find((u) => u.id === userId);

  const filtered = useMemo(() => {
    return [...allOrders]
      .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt))
      .filter((o) => {
        const customer = customerFor(o.userId);
        if (
          search &&
          !`${o.id} ${customer?.name ?? ""} ${customer?.email ?? ""}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (statusFilter && o.status !== statusFilter) return false;
        return true;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrders, users, search, statusFilter]);

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Orders</h1>
      <p className="mt-1 text-sm text-charcoal-light">{allOrders.length} orders placed so far.</p>

      <div className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-cream-border bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
            className="w-full rounded-lg border border-cream-border bg-ivory py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-forest"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-cream-border bg-ivory px-3 py-2.5 text-sm focus:outline-none focus:border-forest"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-cream-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
              <th className="py-3 pl-5 pr-3">Order ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Items</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Payment</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 pr-5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-charcoal-light">No orders match your filters.</td>
              </tr>
            )}
            {filtered.map((o) => {
              const customer = customerFor(o.userId);
              return (
                <tr key={o.id} className="border-b border-cream-border last:border-0 hover:bg-beige/20 transition-colors">
                  <td className="py-3 pl-5 pr-3">
                    <Link to={`/admin/orders/${o.id}`} className="text-forest hover:underline font-medium">{o.id}</Link>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-charcoal">{customer?.name ?? "Guest"}</p>
                    <p className="text-xs text-charcoal-light">{customer?.email}</p>
                  </td>
                  <td className="py-3 px-3 text-charcoal-light whitespace-nowrap">
                    {new Date(o.placedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-charcoal-light">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="py-3 px-3">{formatPrice(o.total)}</td>
                  <td className="py-3 px-3"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="py-3 px-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="rounded-lg border border-cream-border bg-ivory px-2 py-1.5 text-xs focus:outline-none focus:border-forest"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-5 pl-3 text-right">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="rounded-full border border-cream-border px-3 py-1.5 text-xs text-charcoal-light hover:border-forest hover:text-forest transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
