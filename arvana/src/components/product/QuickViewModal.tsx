import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { Product } from "../../types";
import Rating from "../common/Rating";
import { Button } from "../common/Button";
import { formatPrice } from "../../utils/format";
import { useCart } from "../../context/CartContext";
import { isPurchasable } from "../../context/ProductContext";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  if (!product) return null;
  const purchasable = isPurchasable(product);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative grid w-full max-w-3xl grid-cols-1 sm:grid-cols-2 bg-ivory shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 text-charcoal-light hover:text-charcoal">
          <X size={20} />
        </button>
        <div className="aspect-[4/5] sm:aspect-auto bg-beige">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="p-6 sm:p-8 flex flex-col">
          <p className="text-[11px] uppercase tracking-wider text-olive">{product.category}</p>
          <h3 className="mt-1 font-display text-2xl text-charcoal">{product.name}</h3>
          <div className="mt-2">
            <Rating value={product.rating} reviews={product.reviews} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-medium text-charcoal">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-charcoal-light/60 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-light line-clamp-4">{product.description}</p>
          <div className="mt-auto pt-6 flex flex-col gap-3">
            <Button onClick={() => addToCart(product.id)} className="w-full" disabled={!purchasable}>
              {purchasable ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-center text-sm uppercase tracking-wide text-charcoal hover-underline"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
