import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Truck, Zap, CreditCard, Banknote, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAddresses } from "../context/AddressContext";
import { useOrders } from "../context/OrderContext";
import { getProductById } from "../data/products";
import { formatPrice } from "../utils/format";
import { Button } from "../components/common/Button";
import AddressCard from "../components/common/AddressCard";
import AddressForm from "../components/common/AddressForm";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import type { Address, OrderItem } from "../types";

type DeliveryMethod = "standard" | "express";
type PaymentMethod = "online" | "cod";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { addresses, addAddress } = useAddresses();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  // Whether the user has explicitly asked to add a new address. We don't
  // derive the visible form from `addresses.length === 0` on mount: since
  // saved addresses load asynchronously (from localStorage, after the
  // first render), that initial value was always `true` the instant this
  // page opened — showing "add address" even when one was already saved.
  const [addingAddress, setAddingAddress] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [submitting, setSubmitting] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Once saved addresses finish loading, default to the first one.
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const showAddressForm = addingAddress || addresses.length === 0;

  // Guarded with `!submitting` because clearCart() and navigate() both fire
  // inside handlePlaceOrder(). Without this, a re-render can land in the
  // narrow window where the cart is already empty but the route hasn't
  // switched to /order-success yet, which sends the person straight back
  // to /cart and the confirmation screen is never seen.
  if (items.length === 0 && !submitting) {
    return <Navigate to="/cart" replace />;
  }

  const deliveryFee = delivery === "express" ? 2999 : subtotal > 50000 ? 0 : 1499;
  const total = subtotal + deliveryFee;

  const handleSaveAddress = (data: Omit<Address, "id">) => {
    const created = addAddress(data);
    setSelectedAddressId(created.id);
    setAddingAddress(false);
    setAddressError(null);
  };

  const handlePlaceOrder = () => {
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) {
      setAddressError("Please select or add a delivery address before placing your order.");
      return;
    }
    setSubmitting(true);

    const orderItems: OrderItem[] = items
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          quantity: item.quantity,
          color: item.color,
          material: item.material,
        } as OrderItem;
      })
      .filter(Boolean) as OrderItem[];

    setTimeout(() => {
      const order = placeOrder({
        items: orderItems,
        address,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: payment,
      });
      clearCart();
      navigate(`/order-success/${order.id}`, { state: { order } });
    }, 800);
  };

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <Reveal>
          <SectionHeading align="left" eyebrow="Checkout" title="Checkout" />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-charcoal">Delivery Address</h2>
                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => setAddingAddress(true)}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-forest hover:underline"
                  >
                    <Plus size={13} /> Add New Address
                  </button>
                )}
              </div>

              {addressError && (
                <p className="mb-4 border border-wood/40 bg-wood/10 text-wood text-sm px-4 py-3">{addressError}</p>
              )}

              {showAddressForm ? (
                <AddressForm
                  onSave={handleSaveAddress}
                  onCancel={addresses.length > 0 ? () => setAddingAddress(false) : undefined}
                />
              ) : (
                <div className="space-y-4">
                  {addresses.map((a) => (
                    <AddressCard
                      key={a.id}
                      address={a}
                      selected={selectedAddressId === a.id}
                      onSelect={() => {
                        setSelectedAddressId(a.id);
                        setAddressError(null);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-xl text-charcoal mb-5">Delivery Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                    delivery === "standard" ? "border-forest bg-beige/40" : "border-cream-border"
                  }`}
                >
                  <input
                    type="radio"
                    checked={delivery === "standard"}
                    onChange={() => setDelivery("standard")}
                    className="mt-1 accent-forest"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                      <Truck size={15} /> Standard Delivery
                    </div>
                    <p className="mt-1 text-xs text-charcoal-light">5–7 business days · Free above ₹50,000</p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                    delivery === "express" ? "border-forest bg-beige/40" : "border-cream-border"
                  }`}
                >
                  <input
                    type="radio"
                    checked={delivery === "express"}
                    onChange={() => setDelivery("express")}
                    className="mt-1 accent-forest"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                      <Zap size={15} /> Express Delivery
                    </div>
                    <p className="mt-1 text-xs text-charcoal-light">2–3 business days · {formatPrice(2999)}</p>
                  </div>
                </label>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-charcoal mb-5">Payment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${
                    payment === "online" ? "border-forest bg-beige/40" : "border-cream-border"
                  }`}
                >
                  <input
                    type="radio"
                    checked={payment === "online"}
                    onChange={() => setPayment("online")}
                    className="accent-forest"
                  />
                  <CreditCard size={16} />
                  <span className="text-sm text-charcoal">Online Payment</span>
                </label>
                <label
                  className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${
                    payment === "cod" ? "border-forest bg-beige/40" : "border-cream-border"
                  }`}
                >
                  <input
                    type="radio"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="accent-forest"
                  />
                  <Banknote size={16} />
                  <span className="text-sm text-charcoal">Cash on Delivery</span>
                </label>
              </div>
              <p className="mt-3 text-xs text-charcoal-light">
                This is a demo checkout — no real payment will be processed.
              </p>
            </section>
          </div>

          <div className="h-fit border border-cream-border p-6 sm:p-8 bg-beige/30">
            <h2 className="font-display text-xl text-charcoal mb-5">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex gap-3">
                    <img src={product.images[0]} alt="" className="h-14 w-14 object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal truncate">{product.name}</p>
                      <p className="text-xs text-charcoal-light">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm text-charcoal">{formatPrice(product.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 space-y-3 border-t border-cream-border pt-4 text-sm">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span className="text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Delivery</span>
                <span className="text-charcoal">{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-cream-border pt-4 text-base font-medium text-charcoal">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button onClick={handlePlaceOrder} disabled={submitting} className="mt-7 w-full" size="lg">
              {submitting ? "Placing Order…" : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
