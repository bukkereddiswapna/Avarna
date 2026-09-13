import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { Minus, Plus, MessageCircle, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { getProductById, products } from "../data/products";
import { formatPrice } from "../utils/format";
import { buildWhatsAppLink, buildProductEnquiryMessage } from "../data/config";
import Rating from "../components/common/Rating";
import { Button } from "../components/common/Button";
import ProductCard from "../components/product/ProductCard";
import Lightbox from "../components/common/Lightbox";
import Reveal from "../components/common/Reveal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

type TabKey = "description" | "specifications" | "care" | "delivery" | "reviews";

const TABS: { key: TabKey; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "specifications", label: "Specifications" },
  { key: "care", label: "Materials & Care" },
  { key: "delivery", label: "Delivery Information" },
  { key: "reviews", label: "Customer Reviews" },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id ?? "");
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [material, setMaterial] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<TabKey>("description");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setQuantity(1);
      setColor(product.colorOptions?.[0]?.name);
      setMaterial(product.materialOptions?.[0]);
      setTab("description");
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [product]);

  if (!product) return <Navigate to="/shop" replace />;

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const waMessage = buildProductEnquiryMessage(product.name);

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="text-xs text-charcoal-light">
          <Link to="/shop" className="hover:text-forest">Shop</Link> / <span className="text-charcoal">{product.name}</span>
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <button
              onClick={() => setLightboxIndex(activeImage)}
              className="block w-full aspect-square overflow-hidden bg-beige"
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden border-2 transition-colors ${
                      activeImage === i ? "border-forest" : "border-transparent"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-olive">{product.category}</p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl text-charcoal">{product.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <Rating value={product.rating} reviews={product.reviews} />
              <span
                className={`text-xs uppercase tracking-wide ${
                  product.availability === "In Stock" ? "text-forest" : "text-wood"
                }`}
              >
                {product.availability}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-medium text-charcoal">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-charcoal-light/60 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs uppercase tracking-wide bg-wood/10 text-wood px-2 py-1">
                    Save {Math.round(100 - (product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-charcoal-light">{product.description}</p>

            {product.colorOptions && (
              <div className="mt-7">
                <p className="text-xs uppercase tracking-wide text-charcoal-light mb-3">
                  Color: <span className="text-charcoal">{color}</span>
                </p>
                <div className="flex gap-3">
                  {product.colorOptions.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      className={`h-9 w-9 rounded-full border-2 transition-transform ${
                        color === c.name ? "border-forest scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.materialOptions && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wide text-charcoal-light mb-3">Material</p>
                <div className="flex flex-wrap gap-2">
                  {product.materialOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMaterial(m)}
                      className={`border px-4 py-2 text-xs transition-colors ${
                        material === m ? "border-forest bg-forest text-ivory" : "border-cream-border text-charcoal-light"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 flex items-center gap-4">
              <p className="text-xs uppercase tracking-wide text-charcoal-light">Quantity</p>
              <div className="flex items-center border border-cream-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-beige transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 hover:bg-beige transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => addToCart(product.id, quantity, color, material)}
                className="flex-1"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => {
                  addToCart(product.id, quantity, color, material);
                  navigate("/checkout");
                }}
              >
                Buy Now
              </Button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className="flex items-center justify-center border border-cream-border px-4 hover:border-wood transition-colors"
              >
                <Heart size={18} className={isWishlisted(product.id) ? "text-wood" : "text-charcoal"} fill={isWishlisted(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <a
              href={buildWhatsAppLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 border border-[#25D366]/40 text-[#128C4A] py-3.5 text-sm uppercase tracking-wide hover:bg-[#25D366]/10 transition-colors"
            >
              <MessageCircle size={16} /> Enquire on WhatsApp
            </a>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-cream-border pt-6 text-center">
              <div>
                <Truck size={18} className="mx-auto text-forest" />
                <p className="mt-2 text-[11px] text-charcoal-light">Free White-Glove Delivery</p>
              </div>
              <div>
                <ShieldCheck size={18} className="mx-auto text-forest" />
                <p className="mt-2 text-[11px] text-charcoal-light">2-Year Warranty</p>
              </div>
              <div>
                <RotateCcw size={18} className="mx-auto text-forest" />
                <p className="mt-2 text-[11px] text-charcoal-light">7-Day Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-cream-border">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`pb-4 text-sm uppercase tracking-wide transition-colors border-b-2 -mb-px ${
                  tab === t.key ? "border-forest text-charcoal" : "border-transparent text-charcoal-light"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-10 max-w-3xl">
            {tab === "description" && (
              <p className="text-sm leading-relaxed text-charcoal-light">{product.description}</p>
            )}
            {tab === "specifications" && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {[
                  ["Material", product.material],
                  ["Color", product.color],
                  ["Finish", product.finish],
                  ["Length", product.dimensions.length],
                  ["Width", product.dimensions.width],
                  ["Height", product.dimensions.height],
                  ["Weight", product.weight],
                  ["Seating Capacity", product.seatingCapacity ?? "—"],
                  ["Assembly Required", product.assemblyRequired ? "Yes" : "No"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-cream-border pb-3">
                    <dt className="text-sm text-charcoal-light">{label}</dt>
                    <dd className="text-sm text-charcoal font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {tab === "care" && (
              <ul className="space-y-3 text-sm leading-relaxed text-charcoal-light list-disc pl-5">
                <li>Wipe clean with a soft, dry cloth. Avoid harsh chemical cleaners.</li>
                <li>Keep away from direct sunlight and heat sources to preserve finish and colour.</li>
                <li>Use coasters and mats to prevent scratches or moisture rings on wood surfaces.</li>
                <li>Fabric upholstery should be vacuumed regularly and spot-cleaned promptly.</li>
              </ul>
            )}
            {tab === "delivery" && (
              <div className="space-y-3 text-sm leading-relaxed text-charcoal-light">
                <p>
                  {product.availability === "In Stock"
                    ? "This item ships within 5–7 business days."
                    : "This is a made-to-order piece; delivery typically takes 3–6 weeks."}
                </p>
                <p>Delivery includes assembly and packaging removal at your doorstep, free of charge.</p>
                <p>Enquire on WhatsApp for delivery estimates specific to your city.</p>
              </div>
            )}
            {tab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <p className="font-display text-4xl text-charcoal">{product.rating}</p>
                  <div>
                    <Rating value={product.rating} showValue={false} size={16} />
                    <p className="text-xs text-charcoal-light mt-1">Based on {product.reviews} reviews</p>
                  </div>
                </div>
                <p className="text-sm text-charcoal-light">
                  Customers consistently highlight the build quality, finish and comfort of this piece. Visit our
                  showroom or reach out on WhatsApp to hear more from recent buyers.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-8">Complete the Look</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Lightbox images={product.images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </div>
  );
}
