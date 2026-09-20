import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, AlertTriangle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProducts, isPurchasable } from "../context/ProductContext";
import { formatPrice } from "../utils/format";
import { LinkButton, Button } from "../components/common/Button";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { getProductById } = useProducts();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-28 md:pt-32 pb-32 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-5">
          <ShoppingBag size={40} className="mx-auto text-beige-dark" strokeWidth={1.2} />
          <h1 className="mt-6 font-display text-2xl md:text-3xl text-charcoal">Your cart is empty.</h1>
          <p className="mt-3 text-sm text-charcoal-light">
            Looks like you haven't added any furniture yet. Let's find something you'll love.
          </p>
          <div className="mt-8">
            <LinkButton to="/shop">Continue Shopping</LinkButton>
          </div>
        </div>
      </div>
    );
  }

  const delivery = subtotal > 50000 ? 0 : 1499;
  const discount = subtotal > 60000 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + delivery - discount;

  // A product could have sold out or been taken down by the admin after it
  // was added to a customer's cart, so re-check availability at checkout
  // time rather than only when it was first added.
  const unavailableItems = items.filter((item) => {
    const product = getProductById(item.productId);
    if (!product || !isPurchasable(product)) return true;
    if (product.trackStock && item.quantity > product.stock) return true;
    return false;
  });

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <Reveal>
          <SectionHeading align="left" eyebrow="Your Cart" title="Shopping Cart" />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="divide-y divide-cream-border border-t border-b border-cream-border">
            {items.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              const purchasable = isPurchasable(product);
              const exceedsStock = product.trackStock && item.quantity > product.stock;
              return (
                <div key={`${item.productId}-${item.color}-${item.material}`} className="flex gap-5 py-6">
                  <Link to={`/product/${product.id}`} className="h-28 w-28 shrink-0 overflow-hidden bg-beige">
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-[11px] uppercase tracking-wide text-olive">{product.category}</p>
                      <Link to={`/product/${product.id}`} className="font-display text-lg text-charcoal hover:text-forest transition-colors">
                        {product.name}
                      </Link>
                      {(item.color || item.material) && (
                        <p className="mt-1 text-xs text-charcoal-light">
                          {item.color && <>Color: {item.color} </>}
                          {item.material && <>· Material: {item.material}</>}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-medium text-charcoal sm:hidden">{formatPrice(product.price)}</p>
                      {!purchasable && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-wood">
                          <AlertTriangle size={13} /> Out of stock — remove to continue checkout
                        </p>
                      )}
                      {purchasable && exceedsStock && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-wood">
                          <AlertTriangle size={13} /> Only {product.stock} left — reduce quantity to continue
                        </p>
                      )}
                    </div>
                    <div className="flex items-center border border-cream-border w-fit">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2.5 hover:bg-beige transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2.5 hover:bg-beige transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="hidden sm:block w-28 text-right text-sm font-medium text-charcoal">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      aria-label="Remove item"
                      className="text-charcoal-light hover:text-wood transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit border border-cream-border p-6 sm:p-8 bg-beige/30">
            <h2 className="font-display text-xl text-charcoal">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span className="text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Delivery</span>
                <span className="text-charcoal">{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-charcoal-light">
                  <span>Discount</span>
                  <span className="text-forest">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-cream-border pt-4 text-base font-medium text-charcoal">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/checkout")}
              className="mt-7 w-full"
              size="lg"
              disabled={unavailableItems.length > 0}
            >
              Proceed to Checkout
            </Button>
            {unavailableItems.length > 0 && (
              <p className="mt-2 text-center text-xs text-wood">
                Resolve the stock issue{unavailableItems.length > 1 ? "s" : ""} above to continue.
              </p>
            )}
            <Link
              to="/shop"
              className="mt-4 block text-center text-xs uppercase tracking-wide text-charcoal-light hover:text-forest transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
