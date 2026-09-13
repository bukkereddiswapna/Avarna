import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { products, categories, rooms, materials } from "../data/products";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/product/QuickViewModal";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import type { Product } from "../types";

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRoom = searchParams.get("room") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialCollection = searchParams.get("collection") ?? "";

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(initialRoom ? [initialRoom] : []);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [collectionFilter] = useState<string>(initialCollection);
  const [maxPrice, setMaxPrice] = useState(70000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const toggle = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (collectionFilter && p.collection !== collectionFilter) return false;
      if (selectedRooms.length && !p.room.some((r) => selectedRooms.includes(r))) return false;
      if (selectedMaterials.length && !selectedMaterials.some((m) => p.material.includes(m))) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && p.availability !== "In Stock") return false;
      return true;
    });

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return list;
  }, [search, selectedCategories, selectedRooms, selectedMaterials, collectionFilter, maxPrice, inStockOnly, sort]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRooms([]);
    setSelectedMaterials([]);
    setMaxPrice(70000);
    setInStockOnly(false);
    setSearch("");
    setSearchParams({});
  };

  const activeFilterCount =
    selectedCategories.length + selectedRooms.length + selectedMaterials.length + (inStockOnly ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-charcoal">Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs uppercase tracking-wide text-wood hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal-light mb-3">Category</p>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-2.5 text-sm text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c)}
                onChange={() => toggle(selectedCategories, setSelectedCategories, c)}
                className="h-4 w-4 accent-forest"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal-light mb-3">Room</p>
        <div className="space-y-2">
          {rooms.map((r) => (
            <label key={r} className="flex items-center gap-2.5 text-sm text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRooms.includes(r)}
                onChange={() => toggle(selectedRooms, setSelectedRooms, r)}
                className="h-4 w-4 accent-forest"
              />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal-light mb-3">Price up to ₹{maxPrice.toLocaleString("en-IN")}</p>
        <input
          type="range"
          min={5000}
          max={70000}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-forest"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal-light mb-3">Material</p>
        <div className="flex flex-wrap gap-2">
          {materials.map((m) => (
            <button
              key={m}
              onClick={() => toggle(selectedMaterials, setSelectedMaterials, m)}
              className={`border px-3 py-1.5 text-xs transition-colors ${
                selectedMaterials.includes(m)
                  ? "border-forest bg-forest text-ivory"
                  : "border-cream-border text-charcoal-light hover:border-forest"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal-light mb-3">Availability</p>
        <label className="flex items-center gap-2.5 text-sm text-charcoal cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly((v) => !v)}
            className="h-4 w-4 accent-forest"
          />
          In Stock Only
        </label>
      </div>
    </div>
  );

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Shop"
            title="Furniture Collection"
            subtitle="Explore pieces designed to bring comfort and character to your space."
          />
        </Reveal>

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search furniture…"
              className="w-full border border-cream-border bg-transparent py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-forest"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-cream-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-forest"
          >
            <option value="featured">Sort: Featured</option>
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
            <option value="rating">Sort: Best Rated</option>
          </select>
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 border border-cream-border px-4 py-3 text-sm"
          >
            <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          <aside className="hidden lg:block">{FilterPanel}</aside>

          <div>
            <p className="mb-6 text-sm text-charcoal-light">{filtered.length} products</p>
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display text-2xl text-charcoal">No furniture matches your filters.</p>
                <button onClick={clearFilters} className="mt-4 text-sm uppercase tracking-wide text-forest hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-[80] lg:hidden transition-visibility ${filtersOpen ? "" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-charcoal/50 transition-opacity duration-300 ${filtersOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setFiltersOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-ivory p-6 transition-transform duration-400 ease-out ${
            filtersOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end mb-4">
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <X size={22} />
            </button>
          </div>
          {FilterPanel}
        </div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
