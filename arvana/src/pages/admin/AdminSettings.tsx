import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminSettings() {
  const { admin } = useAdminAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-charcoal">Settings</h1>
      <p className="mt-1 text-sm text-charcoal-light">Admin account and store configuration.</p>

      <div className="mt-6 rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg text-charcoal">Admin Account</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-charcoal-light">Name</p>
            <p className="mt-1 text-charcoal">{admin?.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-charcoal-light">Email</p>
            <p className="mt-1 text-charcoal">{admin?.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg text-charcoal">About This Admin Panel</h2>
        <p className="mt-2 text-sm text-charcoal-light leading-relaxed">
          This is a frontend-only demo admin module. Products, categories, offers, stock history, orders and
          admin login are all persisted to your browser's local storage rather than a real backend — so
          everything survives a page refresh, but it's specific to this browser and not shared across
          devices. When a real backend is ready, the data layer (in <code>ProductContext</code>,{" "}
          <code>OrderContext</code> and <code>AdminAuthContext</code>) is the only place that needs to change
          to call real APIs instead.
        </p>
      </div>
    </div>
  );
}
