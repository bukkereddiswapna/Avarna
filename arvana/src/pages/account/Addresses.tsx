import { useState } from "react";
import { Plus } from "lucide-react";
import { useAddresses } from "../../context/AddressContext";
import AddressCard from "../../components/common/AddressCard";
import AddressForm from "../../components/common/AddressForm";
import { Button } from "../../components/common/Button";
import type { Address } from "../../types";

export default function Addresses() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const handleSave = (data: Omit<Address, "id">) => {
    if (editing) updateAddress(editing.id, data);
    else addAddress(data);
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-charcoal">Saved Addresses</h2>
        {!showForm && (
          <Button size="sm" icon={<Plus size={14} />} iconPosition="left" onClick={() => setShowForm(true)}>
            Add New Address
          </Button>
        )}
      </div>

      {showForm ? (
        <AddressForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : addresses.length === 0 ? (
        <p className="text-sm text-charcoal-light">
          You haven't saved any addresses yet. Add one to speed up checkout next time.
        </p>
      ) : (
        <div className="space-y-4 max-w-xl">
          {addresses.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              onEdit={() => {
                setEditing(a);
                setShowForm(true);
              }}
              onDelete={() => deleteAddress(a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
