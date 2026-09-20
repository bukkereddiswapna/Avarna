import { useState } from "react";
import { Plus, Pencil, Trash2, Power, X } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { Button } from "../../components/common/Button";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import StatusBadge from "../../components/admin/StatusBadge";
import type { Offer } from "../../types";

const emptyForm = {
  code: "",
  discountType: "percentage" as Offer["discountType"],
  discountValue: "",
  startDate: "",
  endDate: "",
  minOrderValue: "0",
  maxDiscount: "",
};

export default function AdminOffers() {
  const { offers, addOffer, updateOffer, deleteOffer } = useProducts();
  const [editing, setEditing] = useState<Offer | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Offer | null>(null);

  const openNew = () => {
    setEditing("new");
    setForm(emptyForm);
    setError(null);
  };

  const openEdit = (o: Offer) => {
    setEditing(o);
    setForm({
      code: o.code,
      discountType: o.discountType,
      discountValue: String(o.discountValue),
      startDate: o.startDate.slice(0, 10),
      endDate: o.endDate.slice(0, 10),
      minOrderValue: String(o.minOrderValue),
      maxDiscount: o.maxDiscount ? String(o.maxDiscount) : "",
    });
    setError(null);
  };

  const handleSave = () => {
    if (!form.code.trim()) return setError("Coupon code is required.");
    if (!form.discountValue || Number(form.discountValue) <= 0) return setError("Enter a valid discount value.");
    if (!form.startDate || !form.endDate) return setError("Start and end dates are required.");
    if (new Date(form.endDate) < new Date(form.startDate)) return setError("End date must be after start date.");

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      active: true,
    };

    if (editing === "new") addOffer(payload);
    else if (editing) updateOffer(editing.id, payload);
    setEditing(null);
  };

  const isExpired = (o: Offer) => new Date(o.endDate) < new Date();

  const inputClass =
    "w-full rounded-lg border border-cream-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Offers / Discounts</h1>
          <p className="mt-1 text-sm text-charcoal-light">{offers.length} coupons configured.</p>
        </div>
        <Button onClick={openNew} icon={<Plus size={16} />} iconPosition="left">
          Add Offer
        </Button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-cream-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
              <th className="py-3 pl-5 pr-3">Code</th>
              <th className="py-3 px-3">Discount</th>
              <th className="py-3 px-3">Valid</th>
              <th className="py-3 px-3">Min Order</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 pr-5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-charcoal-light">No offers created yet.</td>
              </tr>
            )}
            {offers.map((o) => (
              <tr key={o.id} className="border-b border-cream-border last:border-0 hover:bg-beige/20 transition-colors">
                <td className="py-3 pl-5 pr-3 font-mono text-charcoal font-medium">{o.code}</td>
                <td className="py-3 px-3 text-charcoal-light">
                  {o.discountType === "percentage" ? `${o.discountValue}%` : `₹${o.discountValue}`}
                  {o.maxDiscount ? ` (max ₹${o.maxDiscount})` : ""}
                </td>
                <td className="py-3 px-3 text-charcoal-light whitespace-nowrap">
                  {new Date(o.startDate).toLocaleDateString()} – {new Date(o.endDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-3 text-charcoal-light">₹{o.minOrderValue}</td>
                <td className="py-3 px-3">
                  <StatusBadge status={!o.active ? "inactive" : isExpired(o) ? "out_of_stock" : "active"} />
                </td>
                <td className="py-3 pr-5 pl-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => openEdit(o)} className="rounded-lg p-2 text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => updateOffer(o.id, { active: !o.active })}
                      className="rounded-lg p-2 text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors"
                    >
                      <Power size={15} />
                    </button>
                    <button onClick={() => setToDelete(o)} className="rounded-lg p-2 text-charcoal-light hover:bg-wood/10 hover:text-wood transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-charcoal">{editing === "new" ? "Add Offer" : "Edit Offer"}</h3>
              <button onClick={() => setEditing(null)} className="text-charcoal-light hover:text-charcoal">
                <X size={18} />
              </button>
            </div>
            {error && <p className="mt-3 rounded-lg border border-wood/40 bg-wood/10 px-3 py-2 text-xs text-wood">{error}</p>}
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>Coupon Code</label>
                <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className={`${inputClass} uppercase`} placeholder="WELCOME10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as Offer["discountType"] }))}
                    className={inputClass}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Value</label>
                  <input
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Min Order Value (₹)</label>
                  <input type="number" min="0" value={form.minOrderValue} onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Max Discount (₹, optional)</label>
                  <input type="number" min="0" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} className={inputClass} />
                </div>
              </div>
            </div>
            <Button onClick={handleSave} className="mt-6 w-full">Save Offer</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this offer?"
        message={`Coupon "${toDelete?.code}" will be permanently removed.`}
        onConfirm={() => {
          if (toDelete) deleteOffer(toDelete.id);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
