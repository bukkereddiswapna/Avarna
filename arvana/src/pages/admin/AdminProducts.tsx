import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Plus, Eye, Pencil, Trash2, Power } from "lucide-react";
import { useProducts, getInventoryStatus } from "../../context/ProductContext";
import { LinkButton } from "../../components/common/Button";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { formatPrice } from "../../utils/format";
import type { Product } from "../../types";

type SortKey = "name" | "price-asc" | "price-desc" | "stock" | "updated";

export default function AdminProducts() {
  const { products, categories, deleteProduct, updateProduct } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !`${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (stockFilter && getInventoryStatus(p) !== stockFilter) return false;
      return true;
    });
    switch (sort) {
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "stock":
        list = [...list].sort((a, b) => a.stock - b.stock);
        break;
      default:
        list = [...list].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    }
    return list;
  }, [products, search, categoryFilter, stockFilter, sort]);

  const handleDelete = () => {
    if (toDelete) deleteProduct(toDelete.id);
    setToDelete(null);
  };

  const toggleActive = (p: Product) => {
    updateProduct(p.id, { status: p.status === "active" ? "inactive" : "active" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Products</h1>
          <p className="mt-1 text-sm text-charcoal-light">{products.length} products in your catalog.</p>
        </div>
        <LinkButton to="/admin/products/add" icon={<Plus size={16} />} iconPosition="left">
          Add Product
        </LinkButton>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-cream-border bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            placeholder="Search by name or SKU…"
            className="w-full rounded-lg border border-cream-border bg-ivory py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-forest"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-cream-border bg-ivory px-3 py-2.5 text-sm focus:outline-none focus:border-forest"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="rounded-lg border border-cream-border bg-ivory px-3 py-2.5 text-sm focus:outline-none focus:border-forest"
        >
          <option value="">All Stock Status</option>
          <option value="IN STOCK">In Stock</option>
          <option value="LOW STOCK">Low Stock</option>
          <option value="OUT OF STOCK">Out of Stock</option>
          <option value="MADE TO ORDER">Made to Order</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-cream-border bg-ivory px-3 py-2.5 text-sm focus:outline-none focus:border-forest"
        >
          <option value="updated">Recently Updated</option>
          <option value="name">Name (A–Z)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="stock">Stock (Low to High)</option>
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-cream-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
              <th className="py-3 pl-5 pr-3">Product</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Stock</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 pr-5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-charcoal-light">
                  No products match your filters.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-cream-border last:border-0 hover:bg-beige/20 transition-colors">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-charcoal font-medium">{p.name}</p>
                      <p className="text-xs text-charcoal-light">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-charcoal-light">{p.category}</td>
                <td className="py-3 px-3">
                  {formatPrice(p.originalPrice ?? p.price)}
                  {p.originalPrice && <span className="block text-xs text-forest">{formatPrice(p.price)}</span>}
                </td>
                <td className="py-3 px-3">
                  {p.trackStock ? p.stock : "—"}
                  <span className="block"><StatusBadge status={getInventoryStatus(p)} /></span>
                </td>
                <td className="py-3 px-3"><StatusBadge status={p.status} /></td>
                <td className="py-3 px-3 text-charcoal-light">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="py-3 pr-5 pl-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/product/${p.id}`}
                      target="_blank"
                      title="View on site"
                      className="rounded-lg p-2 text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      title="Edit"
                      className="rounded-lg p-2 text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => toggleActive(p)}
                      title={p.status === "active" ? "Deactivate" : "Activate"}
                      className="rounded-lg p-2 text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors"
                    >
                      <Power size={15} />
                    </button>
                    <button
                      onClick={() => setToDelete(p)}
                      title="Delete"
                      className="rounded-lg p-2 text-charcoal-light hover:bg-wood/10 hover:text-wood transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this product?"
        message={`"${toDelete?.name}" will be permanently removed from your catalog and the customer shop.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
