import { useState, type FormEvent } from "react";
import type { Address } from "../../types";
import { Button } from "./Button";

const inputClass =
  "w-full border border-cream-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-forest";
const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

export default function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Address;
  onSave: (address: Omit<Address, "id">) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({
    label: initial?.label ?? "Home",
    name: initial?.name ?? "",
    fullAddress: initial?.fullAddress ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    pincode: initial?.pincode ?? "",
    mobile: initial?.mobile ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.fullAddress.trim()) e.fullAddress = "Address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State is required.";
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode.";
    if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-cream-border p-6 bg-beige/20">
      <div>
        <label className={labelClass}>Label</label>
        <div className="flex gap-2">
          {["Home", "Work", "Other"].map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => set("label", l)}
              className={`border px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
                form.label === l ? "border-forest bg-forest text-ivory" : "border-cream-border text-charcoal-light"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Recipient's name" />
          {errors.name && <p className="mt-1 text-xs text-wood">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Mobile Number</label>
          <input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className={inputClass} placeholder="10-digit mobile number" />
          {errors.mobile && <p className="mt-1 text-xs text-wood">{errors.mobile}</p>}
        </div>
      </div>
      <div>
        <label className={labelClass}>Full Address</label>
        <textarea
          value={form.fullAddress}
          onChange={(e) => set("fullAddress", e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="House/Flat no., Street, Landmark"
        />
        {errors.fullAddress && <p className="mt-1 text-xs text-wood">{errors.fullAddress}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>City</label>
          <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
          {errors.city && <p className="mt-1 text-xs text-wood">{errors.city}</p>}
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input value={form.state} onChange={(e) => set("state", e.target.value)} className={inputClass} />
          {errors.state && <p className="mt-1 text-xs text-wood">{errors.state}</p>}
        </div>
        <div>
          <label className={labelClass}>Pincode</label>
          <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} className={inputClass} />
          {errors.pincode && <p className="mt-1 text-xs text-wood">{errors.pincode}</p>}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit">Save Address</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
