import { Pencil, Trash2 } from "lucide-react";
import type { Address } from "../../types";

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 border p-4 transition-colors ${
        onSelect ? "cursor-pointer" : ""
      } ${selected ? "border-forest bg-beige/40" : "border-cream-border"}`}
    >
      {onSelect && (
        <input type="radio" checked={!!selected} onChange={onSelect} className="mt-1 accent-forest" />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide bg-charcoal text-ivory px-2 py-0.5">
            {address.label}
          </span>
          <p className="text-sm font-medium text-charcoal">{address.name}</p>
        </div>
        <p className="mt-1.5 text-sm text-charcoal-light">{address.fullAddress}</p>
        <p className="text-sm text-charcoal-light">
          {address.city}, {address.state} – {address.pincode}
        </p>
        <p className="text-sm text-charcoal-light">Mobile: {address.mobile}</p>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-3 shrink-0">
          {onEdit && (
            <button type="button" onClick={onEdit} aria-label="Edit address" className="text-charcoal-light hover:text-forest transition-colors">
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} aria-label="Delete address" className="text-charcoal-light hover:text-wood transition-colors">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </label>
  );
}
