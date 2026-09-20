import { Link } from "react-router-dom";
import { Package, CheckCircle2, AlertTriangle, XCircle, ClipboardList, Clock, Truck, Users } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";
import { useProducts, getInventoryStatus } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/format";

export default function AdminDashboard() {
  const { products } = useProducts();
  const { allOrders } = useOrders();
  const { users } = useAuth();

  const activeProducts = products.filter((p) => p.status === "active");
  const lowStock = products.filter((p) => getInventoryStatus(p) === "LOW STOCK");
  const outOfStock = products.filter((p) => getInventoryStatus(p) === "OUT OF STOCK");
  const pendingOrders = allOrders.filter((o) => !["Delivered", "Cancelled", "Returned"].includes(o.status));
  const deliveredOrders = allOrders.filter((o) => o.status === "Delivered");

  const recentOrders = [...allOrders].sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt)).slice(0, 5);

  const lowStockList = [...lowStock, ...outOfStock].slice(0, 5);

  // Top sellers computed from actual order history (units sold + revenue).
  const salesByProduct = new Map<string, { name: string; image: string; units: number; revenue: number }>();
  allOrders.forEach((o) => {
    o.items.forEach((item) => {
      const entry = salesByProduct.get(item.productId) ?? {
        name: item.name,
        image: item.image,
        units: 0,
        revenue: 0,
      };
      entry.units += item.quantity;
      entry.revenue += item.price * item.quantity;
      salesByProduct.set(item.productId, entry);
    });
  });
  const topSelling = Array.from(salesByProduct.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal-light">An overview of your store's products, orders and customers.</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={products.length} icon={Package} />
        <StatCard label="Active Products" value={activeProducts.length} icon={CheckCircle2} />
        <StatCard label="Low Stock" value={lowStock.length} icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of Stock" value={outOfStock.length} icon={XCircle} tone="danger" />
        <StatCard label="Total Orders" value={allOrders.length} icon={ClipboardList} />
        <StatCard label="Pending Orders" value={pendingOrders.length} icon={Clock} tone="warning" />
        <StatCard label="Delivered Orders" value={deliveredOrders.length} icon={Truck} />
        <StatCard label="Total Customers" value={users.length} icon={Users} />
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-charcoal">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-forest hover:underline">View all</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
                  <th className="py-2 pr-3">Order ID</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-charcoal-light">No orders yet.</td>
                  </tr>
                )}
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-cream-border last:border-0">
                    <td className="py-3 pr-3">
                      <Link to={`/admin/orders/${o.id}`} className="text-forest hover:underline">{o.id}</Link>
                    </td>
                    <td className="py-3 pr-3 text-charcoal-light">{new Date(o.placedAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-3">{formatPrice(o.total)}</td>
                    <td className="py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-charcoal">Low Stock Products</h2>
            <Link to="/admin/inventory" className="text-xs text-forest hover:underline">View inventory</Link>
          </div>
          <div className="mt-4 space-y-3">
            {lowStockList.length === 0 && <p className="text-sm text-charcoal-light">All products are well stocked.</p>}
            {lowStockList.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-charcoal">{p.name}</p>
                  <p className="text-xs text-charcoal-light">Stock: {p.stock}</p>
                </div>
                <StatusBadge status={getInventoryStatus(p)} />
                <Link
                  to="/admin/inventory"
                  className="text-xs whitespace-nowrap rounded-full border border-forest px-3 py-1.5 text-forest hover:bg-forest hover:text-ivory transition-colors"
                >
                  Update Stock
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="font-display text-lg text-charcoal">Top Selling Products</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Units Sold</th>
                  <th className="py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSelling.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-charcoal-light">No sales yet.</td>
                  </tr>
                )}
                {topSelling.map((p, i) => (
                  <tr key={i} className="border-b border-cream-border last:border-0">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="text-charcoal">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">{p.units}</td>
                    <td className="py-3">{formatPrice(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
