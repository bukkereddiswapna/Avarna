import { Link } from "react-router-dom";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { getProductById } from "../data/products";
import { formatPrice } from "../utils/format";
import { LinkButton, Button } from "../components/common/Button";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const products = items.map((id) => getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="pt-28 md:pt-32 pb-32 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-5">
          <Heart size={40} className="mx-auto text-beige-dark" strokeWidth={1.2} />
          <h1 className="mt-6 font-display text-2xl md:text-3xl text-charcoal">
            Your wishlist is waiting for something beautiful.
          </h1>
          <div className="mt-8">
            <LinkButton to="/shop">Explore Furniture</LinkButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1000px] px-5 md:px-10">
        <Reveal>
          <SectionHeading align="left" eyebrow="Saved" title="Your Wishlist" />
        </Reveal>

        <div className="mt-12 space-y-4">
          {products.map((p) => (
            <div
              key={p!.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl border border-cream-border bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
            >
              <Link to={`/product/${p!.id}`} className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-beige">
                <img src={p!.images[0]} alt={p!.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wide text-olive">{p!.category}</p>
                <Link to={`/product/${p!.id}`} className="font-display text-lg text-charcoal hover:text-forest transition-colors">
                  {p!.name}
                </Link>
                <p className="mt-1 text-sm font-medium text-charcoal">{formatPrice(p!.price)}</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  size="sm"
                  icon={<ShoppingBag size={14} />}
                  iconPosition="left"
                  onClick={() => {
                    addToCart(p!.id);
                    removeFromWishlist(p!.id);
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Move to Cart
                </Button>
                <button
                  onClick={() => removeFromWishlist(p!.id)}
                  aria-label="Remove from wishlist"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light transition-colors hover:bg-wood/10 hover:text-wood"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
