import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import type { Product } from "../../types";
import Rating from "../common/Rating";
import { useWishlist } from "../../context/WishlistContext";
import { isPurchasable } from "../../context/ProductContext";
import { formatPrice } from "../../utils/format";

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const purchasable = isPurchasable(product);

  const badge = !purchasable ? "Out of Stock" : product.isNew ? "New" : product.isBestseller ? "Bestseller" : null;

  return (
    <div className="group relative">
      <div className="relative overflow-hidden bg-beige aspect-[4/5]">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
              purchasable ? "" : "grayscale-[35%] opacity-80"
            }`}
          />
        </Link>

        {badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-[10px] uppercase tracking-wider font-medium ${
              badge === "Out of Stock" ? "bg-charcoal-light text-ivory" : badge === "New" ? "bg-forest text-ivory" : "bg-wood text-ivory"
            }`}
          >
            {badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium bg-charcoal text-ivory">
            -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-ivory/90 backdrop-blur-sm text-charcoal hover:bg-ivory transition-colors"
        >
          <Heart
            size={16}
            className={wishlisted ? "text-wood animate-heart-pop" : ""}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-2 bg-charcoal text-ivory px-4 py-2 text-[11px] uppercase tracking-wide opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
          >
            <Eye size={13} /> Quick View
          </button>
        )}
      </div>

      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-wider text-olive">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 font-display text-lg text-charcoal hover:text-forest transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5">
          <Rating value={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium text-charcoal">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-charcoal-light/60 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
