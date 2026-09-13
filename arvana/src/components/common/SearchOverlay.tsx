import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { products } from "../../data/products";
import { formatPrice } from "../../utils/format";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] animate-fade-in">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-24 w-[92%] max-w-2xl bg-ivory shadow-2xl animate-scale-in">
        <div className="flex items-center gap-4 border-b border-cream-border px-6 py-5">
          <Search size={20} className="text-charcoal-light shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sofas, beds, dining tables…"
            className="w-full bg-transparent text-lg font-display placeholder:text-charcoal-light/50 focus:outline-none"
          />
          <button onClick={onClose} aria-label="Close search" className="text-charcoal-light shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-charcoal-light">
              No furniture found for "{query}". Try "sofa", "bed" or "dining".
            </p>
          )}
          {results.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              onClick={onClose}
              className="flex items-center gap-4 px-6 py-3 hover:bg-beige transition-colors"
            >
              <img src={p.images[0]} alt="" className="h-14 w-14 object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                <p className="text-xs text-charcoal-light">{p.category}</p>
              </div>
              <span className="text-sm text-charcoal">{formatPrice(p.price)}</span>
            </Link>
          ))}
          {query.trim().length < 2 && (
            <div className="px-6 py-8">
              <p className="mb-3 text-[11px] uppercase tracking-wide text-charcoal-light">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {["Sofa", "Dining Table", "Bed", "Recliner", "Bookshelf"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="border border-cream-border px-3 py-1.5 text-xs text-charcoal-light hover:border-forest hover:text-forest transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
