import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SectionHeading from "../../components/common/SectionHeading";
import Reveal from "../../components/common/Reveal";

const links = [
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <Reveal>
          <SectionHeading align="left" eyebrow="My Account" title={`Welcome, ${user?.name.split(" ")[0] ?? "there"}`} />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          <aside>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-cream-border pb-2 lg:pb-0 lg:pr-6">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                      isActive ? "text-forest font-medium bg-beige/50" : "text-charcoal-light hover:text-charcoal"
                    }`
                  }
                >
                  <l.icon size={16} /> {l.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-wood hover:bg-wood/5 transition-colors whitespace-nowrap"
              >
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </aside>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
