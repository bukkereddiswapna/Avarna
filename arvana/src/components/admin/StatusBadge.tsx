const TONE_MAP: Record<string, string> = {
  // Product publish status
  draft: "bg-charcoal/10 text-charcoal-light",
  active: "bg-forest/10 text-forest",
  out_of_stock: "bg-wood/15 text-wood",
  inactive: "bg-charcoal/10 text-charcoal-light",
  // Inventory status
  "IN STOCK": "bg-forest/10 text-forest",
  "LOW STOCK": "bg-gold/20 text-wood-dark",
  "OUT OF STOCK": "bg-wood/15 text-wood",
  "MADE TO ORDER": "bg-charcoal/10 text-charcoal-light",
  // Order status
  "Order Placed": "bg-charcoal/10 text-charcoal-light",
  Confirmed: "bg-gold/20 text-wood-dark",
  Processing: "bg-gold/20 text-wood-dark",
  Shipped: "bg-forest/10 text-forest",
  "Out for Delivery": "bg-forest/10 text-forest",
  Delivered: "bg-forest/15 text-forest",
  Cancelled: "bg-wood/15 text-wood",
  Returned: "bg-wood/15 text-wood",
  // Payment status
  Paid: "bg-forest/10 text-forest",
  Pending: "bg-gold/20 text-wood-dark",
  Refunded: "bg-wood/15 text-wood",
};

const LABEL_MAP: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  out_of_stock: "Out of Stock",
  inactive: "Inactive",
};

export default function StatusBadge({ status }: { status: string }) {
  const tone = TONE_MAP[status] ?? "bg-charcoal/10 text-charcoal-light";
  const label = LABEL_MAP[status] ?? status;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      {label}
    </span>
  );
}
