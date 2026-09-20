import { useState } from "react";
import { Plus, Pencil, Trash2, Power, X } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { Button } from "../../components/common/Button";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import StatusBadge from "../../components/admin/StatusBadge";
import type { Category } from "../../types";

export default function AdminCategories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProducts();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const productCountFor = (categoryName: string) => products.filter((p) => p.category === categoryName).length;

  const openNew = () => {
    setEditing("new");
    setName("");
    setDescription("");
    setError(null);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setDescription(c.description ?? "");
    setError(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    if (editing === "new") {
      const exists = categories.some((c) => c.name.toLowerCase() === name.trim().toLowerCase());
      if (exists) {
        setError("A category with this name already exists.");
        return;
      }
      addCategory({ name: name.trim(), description: description.trim() || undefined, active: true });
    } else if (editing) {
      updateCategory(editing.id, { name: name.trim(), description: description.trim() || undefined });
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    const result = deleteCategory(toDelete.id);
    if (!result.success) {
      setDeleteError(result.error ?? "Could not delete this category.");
      setToDelete(null);
      return;
    }
    setToDelete(null);
  };

  const inputClass =
    "w-full rounded-lg border border-cream-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Categories</h1>
          <p className="mt-1 text-sm text-charcoal-light">{categories.length} categories.</p>
        </div>
        <Button onClick={openNew} icon={<Plus size={16} />} iconPosition="left">
          Add Category
        </Button>
      </div>

      {deleteError && (
        <p className="mt-4 rounded-lg border border-wood/40 bg-wood/10 px-3.5 py-2.5 text-xs text-wood">
          {deleteError}
        </p>
      )}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-cream-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light border-b border-cream-border">
              <th className="py-3 pl-5 pr-3">Name</th>
              <th className="py-3 px-3">Products</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 pr-5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-cream-border last:border-0 hover:bg-beige/20 transition-colors">
                <td className="py-3 pl-5 pr-3">
                  <p className="text-charcoal font-medium">{c.name}</p>
                  {c.description && <p className="text-xs text-charcoal-light">{c.description}</p>}
                </td>
                <td className="py-3 px-3 text-charcoal-light">{productCountFor(c.name)}</td>
                <td className="py-3 px-3"><StatusBadge status={c.active ? "active" : "inactive"} /></td>
                <td className="py-3 pr-5 pl-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded-lg p-2 text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => updateCategory(c.id, { active: !c.active })}
                      className="rounded-lg p-2 text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors"
                    >
                      <Power size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteError(null);
                        setToDelete(c);
                      }}
                      className="rounded-lg p-2 text-charcoal-light hover:bg-wood/10 hover:text-wood transition-colors"
                    >
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
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-charcoal">{editing === "new" ? "Add Category" : "Edit Category"}</h3>
              <button onClick={() => setEditing(null)} className="text-charcoal-light hover:text-charcoal">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                {error && <p className="mt-1 text-xs text-wood">{error}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block">Description (optional)</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
              </div>
            </div>
            <Button onClick={handleSave} className="mt-6 w-full">Save</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this category?"
        message={`"${toDelete?.name}" will be removed. This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
