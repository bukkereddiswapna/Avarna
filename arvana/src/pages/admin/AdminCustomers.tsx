import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import StatusBadge from "../../components/admin/StatusBadge";
import { formatPrice } from "../../utils/format";

export default function AdminCustomers() {
  const { users } = useAuth();
  const { allOrders } = useOrders();
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  const rows = useMemo(() => {
    return users
      .map((u) => {
        const orders = allOrders.filter((o) => o.userId === u.id);
        const totalSpent = orders.reduce((s, o) => s + o.total, 0);
        return { user: u, orderCount: orders.length, totalSpent, orders };
      })
      .filter((r) => `${r.user.name} ${r.user.email}`.toLowerCase().includes(search.toLowerCase()));
  }, [users, allOrders, search]);

  const viewingRow = rows.find((r) => r.user.id === viewing);

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Customers</h1>
      <p className="mt-1 text-sm text-charcoal-light">{users.length} registered customers.</p>

      <div className="mt-6 rounded-2xl border border-cream-border bg-white p-4 shadow-sm">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-cream-border bg-ivory py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-cream-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
              <th className="py-3 pl-5 pr-3">Name</th>
              <th className="py-3 px-3">Email</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Orders</th>
              <th className="py-3 px-3">Total Spent</th>
              <th className="py-3 pr-5 pl-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-charcoal-light">No customers found.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.user.id} className="border-b border-cream-border last:border-0 hover:bg-beige/20 transition-colors">
                <td className="py-3 pl-5 pr-3 text-charcoal font-medium">{r.user.name}</td>
                <td className="py-3 px-3 text-charcoal-light">{r.user.email}</td>
                <td className="py-3 px-3 text-charcoal-light">{r.user.mobile}</td>
                <td className="py-3 px-3">{r.orderCount}</td>
                <td className="py-3 px-3">{formatPrice(r.totalSpent)}</td>
                <td className="py-3 pr-5 pl-3 text-right">
                  <button
                    onClick={() => setViewing(r.user.id)}
                    className="rounded-full border border-cream-border px-3 py-1.5 text-xs text-charcoal-light hover:border-forest hover:text-forest transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingRow && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scale-in max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-charcoal">{viewingRow.user.name}</h3>
                <p className="text-sm text-charcoal-light">{viewingRow.user.email} · {viewingRow.user.mobile}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-charcoal-light hover:text-charcoal">
                <X size={18} />
              </button>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wide text-charcoal-light">Order History</p>
            <div className="mt-2 flex-1 overflow-y-auto divide-y divide-cream-border">
              {viewingRow.orders.length === 0 && (
                <p className="py-6 text-center text-sm text-charcoal-light">No orders yet.</p>
              )}
              {viewingRow.orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="text-charcoal font-medium">{o.id}</p>
                    <p className="text-xs text-charcoal-light">{new Date(o.placedAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={o.status} />
                  <p className="text-charcoal">{formatPrice(o.total)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
