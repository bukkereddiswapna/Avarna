import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/common/Button";
import type { Product } from "../../types";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  originalPrice: "",
  sku: "",
  trackStock: true,
  stock: "",
  lowStockThreshold: "5",
  material: "",
  color: "",
  finish: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  warranty: "1 Year Manufacturer Warranty",
  assemblyRequired: false,
  room: "",
  collection: "",
  status: "active" as Product["status"],
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct, categories, collections } = useProducts();
  const { showToast } = useToast();

  const existing = isEdit ? getProductById(id!) : undefined;
  if (isEdit && !existing) return <Navigate to="/admin/products" replace />;

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        description: existing.description,
        category: existing.category,
        subcategory: existing.subcategory ?? "",
        price: String(existing.price),
        originalPrice: existing.originalPrice ? String(existing.originalPrice) : "",
        sku: existing.sku,
        trackStock: existing.trackStock,
        stock: String(existing.stock),
        lowStockThreshold: String(existing.lowStockThreshold),
        material: existing.material,
        color: existing.color,
        finish: existing.finish,
        length: existing.dimensions.length,
        width: existing.dimensions.width,
        height: existing.dimensions.height,
        weight: existing.weight,
        warranty: existing.warranty ?? "",
        assemblyRequired: existing.assemblyRequired,
        room: existing.room.join(", "),
        collection: existing.collection,
        status: existing.status,
      });
      setImages(existing.images);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageUpload = async (fileList: FileList | null, replace: boolean) => {
    if (!fileList || fileList.length === 0) return;
    const dataUrls = await Promise.all(Array.from(fileList).map(fileToDataUrl));
    setImages((prev) => (replace ? [dataUrls[0], ...prev.slice(1)] : [...prev, ...dataUrls]));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.category.trim()) e.category = "Category is required.";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price.";
    if (form.trackStock && (form.stock === "" || Number(form.stock) < 0)) e.stock = "Enter a valid stock quantity.";
    if (images.length === 0) e.images = "At least one product image is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildProductPayload = (status: Product["status"]): Omit<Product, "id" | "updatedAt"> => ({
    name: form.name.trim(),
    category: form.category.trim(),
    subcategory: form.subcategory.trim() || undefined,
    room: form.room
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean),
    collection: form.collection.trim() || "General",
    price: Number(form.price),
    originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
    rating: existing?.rating ?? 0,
    reviews: existing?.reviews ?? 0,
    images,
    description: form.description.trim(),
    material: form.material.trim(),
    color: form.color.trim(),
    finish: form.finish.trim(),
    dimensions: { length: form.length, width: form.width, height: form.height },
    weight: form.weight,
    warranty: form.warranty.trim() || undefined,
    assemblyRequired: form.assemblyRequired,
    availability: !form.trackStock ? "Made to Order" : Number(form.stock) > 0 ? "In Stock" : "Out of Stock",
    isNew: existing?.isNew ?? true,
    isFeatured: existing?.isFeatured ?? false,
    isBestseller: existing?.isBestseller ?? false,
    colorOptions: existing?.colorOptions,
    materialOptions: existing?.materialOptions,
    sku: form.sku.trim() || `ARV-${Date.now().toString().slice(-6)}`,
    trackStock: form.trackStock,
    stock: form.trackStock ? Number(form.stock) : 0,
    lowStockThreshold: Number(form.lowStockThreshold) || 5,
    status,
  });

  const handleSubmit = (e: FormEvent, statusOverride?: Product["status"]) => {
    e.preventDefault();
    if (!validate()) return;
    const status = statusOverride ?? form.status;
    const payload = buildProductPayload(status);

    if (isEdit && existing) {
      updateProduct(existing.id, payload);
      showToast(`${payload.name} updated successfully`, "success");
    } else {
      addProduct(payload);
      showToast(`${payload.name} added successfully`, "success");
    }
    navigate("/admin/products");
  };

  const inputClass =
    "w-full rounded-lg border border-cream-border bg-ivory px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";
  const sectionClass = "rounded-2xl border border-cream-border bg-white p-5 shadow-sm space-y-4";

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-charcoal">{isEdit ? "Edit Product" : "Add Product"}</h1>
      <p className="mt-1 text-sm text-charcoal-light">
        {isEdit ? `Editing "${existing?.name}".` : "Fill in the details below to list a new product."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className={sectionClass}>
          <h2 className="font-display text-lg text-charcoal">Basic Information</h2>
          <div>
            <label className={labelClass}>Product Name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
            {errors.name && <p className="mt-1 text-xs text-wood">{errors.name}</p>}
          </div>
          <div>
            <label className={labelClass}>Product Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                list="category-options"
                className={inputClass}
                placeholder="e.g. Sofas"
              />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
              {errors.category && <p className="mt-1 text-xs text-wood">{errors.category}</p>}
            </div>
            <div>
              <label className={labelClass}>Subcategory (optional)</label>
              <input
                value={form.subcategory}
                onChange={(e) => set("subcategory", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Room(s) — comma separated</label>
              <input
                value={form.room}
                onChange={(e) => set("room", e.target.value)}
                placeholder="Living Room, Bedroom"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Collection</label>
              <input
                value={form.collection}
                onChange={(e) => set("collection", e.target.value)}
                list="collection-options"
                placeholder="e.g. Heritage"
                className={inputClass}
              />
              <datalist id="collection-options">
                {collections.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-display text-lg text-charcoal">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputClass}
              />
              {errors.price && <p className="mt-1 text-xs text-wood">{errors.price}</p>}
            </div>
            <div>
              <label className={labelClass}>Original / Sale Price (₹, optional)</label>
              <input
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                placeholder="Shown struck-through if higher than price"
                className={inputClass}
              />
              {form.originalPrice && Number(form.originalPrice) > Number(form.price || 0) && (
                <p className="mt-1 text-xs text-forest">
                  {Math.round((1 - Number(form.price || 0) / Number(form.originalPrice)) * 100)}% discount
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-display text-lg text-charcoal">Inventory</h2>
          <div>
            <label className={labelClass}>SKU</label>
            <input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              placeholder="Auto-generated if left blank"
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={form.trackStock}
              onChange={(e) => set("trackStock", e.target.checked)}
              className="h-4 w-4 accent-forest"
            />
            Track physical stock for this product
          </label>
          {!form.trackStock && (
            <p className="text-xs text-charcoal-light -mt-2">
              Made-to-order items stay purchasable whenever their status is Active, regardless of stock count.
            </p>
          )}
          {form.trackStock && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  className={inputClass}
                />
                {errors.stock && <p className="mt-1 text-xs text-wood">{errors.stock}</p>}
              </div>
              <div>
                <label className={labelClass}>Low Stock Threshold</label>
                <input
                  type="number"
                  min="0"
                  value={form.lowStockThreshold}
                  onChange={(e) => set("lowStockThreshold", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <div className={sectionClass}>
          <h2 className="font-display text-lg text-charcoal">Product Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Material</label>
              <input value={form.material} onChange={(e) => set("material", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input value={form.color} onChange={(e) => set("color", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Finish</label>
              <input value={form.finish} onChange={(e) => set("finish", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Weight</label>
              <input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 45 kg" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Dimensions (L × W × H)</label>
            <div className="grid grid-cols-3 gap-3">
              <input value={form.length} onChange={(e) => set("length", e.target.value)} placeholder="Length" className={inputClass} />
              <input value={form.width} onChange={(e) => set("width", e.target.value)} placeholder="Width" className={inputClass} />
              <input value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="Height" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Warranty</label>
            <input value={form.warranty} onChange={(e) => set("warranty", e.target.value)} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={form.assemblyRequired}
              onChange={(e) => set("assemblyRequired", e.target.checked)}
              className="h-4 w-4 accent-forest"
            />
            Assembly required
          </label>
        </div>

        <div className={sectionClass}>
          <h2 className="font-display text-lg text-charcoal">Images</h2>
          <div>
            <label className={labelClass}>Main Product Image</label>
            {images[0] ? (
              <div className="relative h-32 w-32">
                <img src={images[0]} alt="" className="h-32 w-32 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.slice(1))}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-ivory"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-cream-border text-charcoal-light hover:border-forest transition-colors">
                <Upload size={18} />
                <span className="text-[11px]">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files, true)} />
              </label>
            )}
            {errors.images && <p className="mt-1 text-xs text-wood">{errors.images}</p>}
          </div>
          <div>
            <label className={labelClass}>Additional Product Images</label>
            <div className="flex flex-wrap gap-3">
              {images.slice(1).map((src, i) => (
                <div key={i} className="relative h-24 w-24">
                  <img src={src} alt="" className="h-24 w-24 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i + 1))}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-ivory"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-cream-border text-charcoal-light hover:border-forest transition-colors">
                <Upload size={16} />
                <span className="text-[10px]">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files, false)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-display text-lg text-charcoal">Product Status</h2>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as Product["status"])}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="inactive">Inactive</option>
          </select>
          <p className="text-xs text-charcoal-light">Only "Active" products are shown and purchasable on the Shop page.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg">
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
          {!isEdit && (
            <Button type="button" variant="outline" size="lg" onClick={(e) => handleSubmit(e as unknown as FormEvent, "draft")}>
              Save as Draft
            </Button>
          )}
          <Button type="button" variant="ghost" size="lg" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
