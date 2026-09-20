import { useMemo, useState } from "react";
import { Minus, Plus, History, X, Search } from "lucide-react";
import { useProducts, getInventoryStatus, type StockChangeReason } from "../../context/ProductContext";
import StatusBadge from "../../components/admin/StatusBadge";
import type { Product } from "../../types";

const REASONS: StockChangeReason[] = ["Stock Added", "Manual Adjustment", "Return", "Damaged", "Cancelled Order"];

export default function AdminInventory() {
  const { products, adjustStock, setStock, setLowStockThreshold, stockHistoryFor } = useProducts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [historyFor, setHistoryFor] = useState<Product | null>(null);
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const [setStockFor, setSetStockFor] = useState<Product | null>(null);
  const [setStockValue, setSetStockValue] = useState("");
  const [setStockReason, setSetStockReason] = useState<StockChangeReason>("Manual Adjustment");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !`${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && getInventoryStatus(p) !== statusFilter) return false;
      return true;
    });
  }, [products, search, statusFilter]);

  const openSetStock = (p: Product) => {
    setSetStockFor(p);
    setSetStockValue(String(p.stock));
    setSetStockReason("Manual Adjustment");
  };

  const confirmSetStock = () => {
    if (!setStockFor) return;
    const value = Number(setStockValue);
    if (!Number.isFinite(value) || value < 0) return;
    setStock(setStockFor.id, value, setStockReason);
    setSetStockFor(null);
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Inventory / Stock</h1>
      <p className="mt-1 text-sm text-charcoal-light">Track and adjust stock levels across your catalog.</p>

      <div className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-cream-border bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            className="w-full rounded-lg border border-cream-border bg-ivory py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-forest"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-cream-border bg-ivory px-3 py-2.5 text-sm focus:outline-none focus:border-forest"
        >
          <option value="">All Stock Status</option>
          <option value="IN STOCK">In Stock</option>
          <option value="LOW STOCK">Low Stock</option>
          <option value="OUT OF STOCK">Out of Stock</option>
          <option value="MADE TO ORDER">Made to Order</option>
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-cream-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
              <th className="py-3 pl-5 pr-3">Product</th>
              <th className="py-3 px-3">SKU</th>
              <th className="py-3 px-3">Current Stock</th>
              <th className="py-3 px-3">Low Stock Threshold</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 pr-5 pl-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-cream-border last:border-0 hover:bg-beige/20 transition-colors">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover shrink-0" />
                    <span className="text-charcoal font-medium truncate">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-charcoal-light">{p.sku}</td>
                <td className="py-3 px-3">
                  {p.trackStock ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => adjustStock(p.id, -1, "Manual Adjustment")}
                        disabled={p.stock <= 0}
                        className="flex h-7 w-7 items-center justify-center rounded border border-cream-border text-charcoal-light hover:bg-beige disabled:opacity-30 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <button
                        onClick={() => openSetStock(p)}
                        className="w-10 text-center font-medium text-charcoal hover:underline"
                        title="Set exact quantity"
                      >
                        {p.stock}
                      </button>
                      <button
                        onClick={() => adjustStock(p.id, 1, "Stock Added")}
                        className="flex h-7 w-7 items-center justify-center rounded border border-cream-border text-charcoal-light hover:bg-beige transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-charcoal-light">—</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  {p.trackStock ? (
                    editingThreshold === p.id ? (
                      <input
                        type="number"
                        min="0"
                        autoFocus
                        defaultValue={p.lowStockThreshold}
                        onBlur={(e) => {
                          setLowStockThreshold(p.id, Number(e.target.value) || 0);
                          setEditingThreshold(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                        className="w-16 rounded border border-cream-border px-2 py-1 text-sm"
                      />
                    ) : (
                      <button onClick={() => setEditingThreshold(p.id)} className="text-charcoal hover:underline">
                        {p.lowStockThreshold}
                      </button>
                    )
                  ) : (
                    <span className="text-charcoal-light">—</span>
                  )}
                </td>
                <td className="py-3 px-3"><StatusBadge status={getInventoryStatus(p)} /></td>
                <td className="py-3 px-3 text-charcoal-light">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="py-3 pr-5 pl-3 text-right">
                  <button
                    onClick={() => setHistoryFor(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cream-border px-3 py-1.5 text-xs text-charcoal-light hover:border-forest hover:text-forest transition-colors"
                  >
                    <History size={13} /> History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Set exact stock modal */}
      {setStockFor && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setSetStockFor(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
            <h3 className="font-display text-lg text-charcoal">Set Stock — {setStockFor.name}</h3>
            <div className="mt-4">
              <label className="text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block">New Quantity</label>
              <input
                type="number"
                min="0"
                autoFocus
                value={setStockValue}
                onChange={(e) => setSetStockValue(e.target.value)}
                className="w-full rounded-lg border border-cream-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest"
              />
            </div>
            <div className="mt-4">
              <label className="text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block">Reason</label>
              <select
                value={setStockReason}
                onChange={(e) => setSetStockReason(e.target.value as StockChangeReason)}
                className="w-full rounded-lg border border-cream-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSetStockFor(null)}
                className="flex-1 rounded-lg border border-cream-border py-2.5 text-sm text-charcoal hover:bg-beige transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSetStock}
                className="flex-1 rounded-lg bg-forest py-2.5 text-sm text-ivory hover:bg-forest-light transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock history modal */}
      {historyFor && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setHistoryFor(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scale-in max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-charcoal">Stock History — {historyFor.name}</h3>
              <button onClick={() => setHistoryFor(null)} className="text-charcoal-light hover:text-charcoal">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
                    <th className="py-2 pr-2">Date</th>
                    <th className="py-2 pr-2">Previous</th>
                    <th className="py-2 pr-2">Change</th>
                    <th className="py-2 pr-2">New</th>
                    <th className="py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {stockHistoryFor(historyFor.id).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-charcoal-light">No stock changes recorded yet.</td>
                    </tr>
                  )}
                  {stockHistoryFor(historyFor.id).map((h) => (
                    <tr key={h.id} className="border-b border-cream-border last:border-0">
                      <td className="py-2 pr-2 text-charcoal-light whitespace-nowrap">
                        {new Date(h.date).toLocaleString()}
                      </td>
                      <td className="py-2 pr-2">{h.previousStock}</td>
                      <td className={`py-2 pr-2 font-medium ${h.change >= 0 ? "text-forest" : "text-wood"}`}>
                        {h.change >= 0 ? `+${h.change}` : h.change}
                      </td>
                      <td className="py-2 pr-2">{h.newStock}</td>
                      <td className="py-2 text-charcoal-light">{h.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
