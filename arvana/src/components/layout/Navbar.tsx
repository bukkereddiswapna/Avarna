import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X, User, ChevronDown, Package, MapPin, LogOut } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import SearchOverlay from "../common/SearchOverlay";
import Logo from "../common/Logo";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Custom Furniture", to: "/custom-furniture" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const transparent = isHome && !scrolled && !mobileOpen;
  const textColor = transparent ? "text-ivory" : "text-charcoal";

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent ? "bg-transparent py-6" : "bg-white shadow-md border-b border-cream-border py-4"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 flex items-center justify-between">
          <Logo className={textColor} />

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `hover-underline text-[13px] uppercase tracking-wide font-medium ${textColor} ${
                    isActive ? "active" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className={`hidden sm:flex ${textColor} hover:opacity-70 transition-opacity`}
            >
              <Search size={19} />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className={`relative hidden sm:flex ${textColor} hover:opacity-70 transition-opacity`}>
              <Heart size={19} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-wood text-[9px] text-ivory">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" aria-label="Cart" className={`relative flex ${textColor} hover:opacity-70 transition-opacity`}>
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-wood text-[9px] text-ivory">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account: dropdown when logged in, Login/Register links when logged out */}
            {user ? (
              <div className="relative hidden lg:block" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className={`flex items-center gap-1.5 ${textColor} hover:opacity-70 transition-opacity`}
                >
                  <User size={19} />
                  <ChevronDown size={13} className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  className={`absolute right-0 top-full mt-3 w-56 bg-ivory shadow-xl border border-cream-border transition-all duration-200 origin-top-right ${
                    accountOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-3 border-b border-cream-border">
                    <p className="text-sm font-medium text-charcoal truncate">{user.name}</p>
                    <p className="text-xs text-charcoal-light truncate">{user.email}</p>
                  </div>
                  <Link to="/account/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors">
                    <User size={14} /> Profile
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors">
                    <Package size={14} /> My Orders
                  </Link>
                  <Link to="/account/addresses" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-light hover:bg-beige hover:text-charcoal transition-colors">
                    <MapPin size={14} /> Saved Addresses
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-wood hover:bg-wood/5 transition-colors border-t border-cream-border">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className={`hidden lg:flex items-center gap-3 text-[13px] uppercase tracking-wide font-medium ${textColor}`}>
                <Link to="/login" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                  <User size={18} /> Login
                </Link>
                <span className="opacity-40">/</span>
                <Link to="/register" className="hover:opacity-70 transition-opacity">
                  Register
                </Link>
              </div>
            )}

            <Link
              to="/contact"
              className={`hidden lg:inline-flex btn-shine items-center border px-5 py-2.5 text-[12px] uppercase tracking-wide font-medium transition-colors duration-300 ${
                transparent
                  ? "border-ivory text-ivory hover:bg-ivory hover:text-charcoal"
                  : "border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory"
              }`}
            >
              Visit Showroom
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className={`lg:hidden flex ${textColor}`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-ivory transition-transform duration-500 ease-out lg:hidden overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-full flex-col justify-between px-8 pt-28 pb-10">
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={{ transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms" }}
                className={({ isActive }) =>
                  `font-display text-3xl transition-all duration-500 ${
                    mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                  } ${isActive ? "text-forest" : "text-charcoal"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-col gap-4 pt-10">
            <button
              onClick={() => {
                setSearchOpen(true);
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 text-charcoal-light text-sm uppercase tracking-wide"
            >
              <Search size={17} /> Search
            </button>
            <Link to="/wishlist" className="flex items-center gap-3 text-charcoal-light text-sm uppercase tracking-wide">
              <Heart size={17} /> Wishlist
            </Link>
            {user ? (
              <>
                <Link to="/account/profile" className="flex items-center gap-3 text-charcoal-light text-sm uppercase tracking-wide">
                  <User size={17} /> My Account
                </Link>
                <Link to="/account/orders" className="flex items-center gap-3 text-charcoal-light text-sm uppercase tracking-wide">
                  <Package size={17} /> My Orders
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 text-wood text-sm uppercase tracking-wide">
                  <LogOut size={17} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-3 text-charcoal-light text-sm uppercase tracking-wide">
                  <User size={17} /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-3 text-charcoal-light text-sm uppercase tracking-wide">
                  <User size={17} /> Register
                </Link>
              </>
            )}
            <Link to="/contact" className="mt-3 inline-flex justify-center border border-charcoal px-6 py-3.5 text-xs uppercase tracking-wide">
              Visit Showroom
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
