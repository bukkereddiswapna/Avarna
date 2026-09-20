import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  Boxes,
  ClipboardList,
  Users,
  BadgePercent,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useProducts, getInventoryStatus } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/products/add", label: "Add Product", icon: PlusCircle },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/inventory", label: "Inventory / Stock", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/offers", label: "Offers / Discounts", icon: BadgePercent },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-charcoal text-ivory">
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-ivory/10">
        <span className="flex h-8 w-8 items-center justify-center rounded border border-ivory/40 font-display text-sm">
          A
        </span>
        <span className="font-display text-lg tracking-wide leading-none">
          ARVANA
          <span className="block text-[10px] tracking-[0.2em] text-ivory/50 font-sans mt-0.5">ADMIN</span>
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2 ${
                isActive
                  ? "bg-ivory/10 border-l-wood-light text-ivory font-medium"
                  : "border-l-transparent text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-ivory/10 p-4">
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-ivory/70 hover:text-ivory transition-colors"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { admin } = useAdminAuth();
  const { products } = useProducts();
  const { allOrders } = useOrders();
  const navigate = useNavigate();

  const lowStockProducts = products.filter((p) => {
    const s = getInventoryStatus(p);
    return s === "LOW STOCK" || s === "OUT OF STOCK";
  });
  const pendingOrders = allOrders.filter((o) => o.status === "Order Placed" || o.status === "Confirmed");
  const notifCount = lowStockProducts.length + pendingOrders.length;

  return (
    <div className="min-h-screen bg-ivory-dark flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-screen w-64">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-[100] lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-charcoal/60 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative h-full">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 text-ivory/70 hover:text-ivory"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-cream-border bg-white px-5 py-4 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-charcoal" aria-label="Open menu">
            <Menu size={22} />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              placeholder="Search products, orders…"
              className="w-full rounded-lg border border-cream-border bg-ivory py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value.trim();
                  if (q) navigate(`/admin/products?search=${encodeURIComponent(q)}`);
                }
              }}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-light hover:bg-beige transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {notifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-wood text-[9px] font-medium text-ivory">
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-cream-border bg-white shadow-xl overflow-hidden">
                  <div className="max-h-80 overflow-y-auto divide-y divide-cream-border">
                    {notifCount === 0 && (
                      <p className="px-4 py-6 text-center text-sm text-charcoal-light">You're all caught up.</p>
                    )}
                    {pendingOrders.slice(0, 5).map((o) => (
                      <button
                        key={o.id}
                        onClick={() => {
                          setNotifOpen(false);
                          navigate(`/admin/orders/${o.id}`);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm hover:bg-beige/40 transition-colors"
                      >
                        <span className="font-medium text-charcoal">New order {o.id}</span>
                        <span className="block text-xs text-charcoal-light">Awaiting confirmation</span>
                      </button>
                    ))}
                    {lowStockProducts.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/admin/inventory");
                        }}
                        className="block w-full px-4 py-3 text-left text-sm hover:bg-beige/40 transition-colors"
                      >
                        <span className="font-medium text-charcoal">{p.name}</span>
                        <span className="block text-xs text-wood">{getInventoryStatus(p)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 hover:bg-beige transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-xs font-medium text-ivory">
                  {admin?.name?.slice(0, 2).toUpperCase()}
                </span>
                <span className="hidden sm:block text-sm text-charcoal">{admin?.name}</span>
                <ChevronDown size={14} className="text-charcoal-light" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-cream-border bg-white shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-cream-border">
                    <p className="text-sm font-medium text-charcoal">{admin?.name}</p>
                    <p className="text-xs text-charcoal-light truncate">{admin?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/settings");
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-charcoal hover:bg-beige/40 transition-colors"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
