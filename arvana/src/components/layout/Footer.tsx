import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { BRAND } from "../../data/config";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-charcoal text-ivory/80">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl text-ivory">{BRAND.name}</p>
          <p className="mt-3 max-w-xs text-sm text-ivory/60">{BRAND.tagline}</p>
          <div className="mt-6 flex items-center gap-4">
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-ivory transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={BRAND.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-ivory transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.3c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.42-3.9 4.02v2.3H8v3h2.36V21h3.14z" />
              </svg>
            </a>
            <a href={BRAND.pinterest} target="_blank" rel="noreferrer" aria-label="Pinterest" className="hover:text-ivory transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12.017 0C5.396 0 0 5.396 0 12.017c0 5.098 3.152 9.44 7.615 11.216-.105-.949-.2-2.408.042-3.445.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.781c0-1.669.967-2.916 2.171-2.916 1.023 0 1.518.769 1.518 1.69 0 1.03-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.223.083.344-.09.375-.293 1.194-.332 1.36-.052.221-.174.267-.401.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.379l-.748 2.852c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.62 0 11.99-5.396 11.99-12.017C24 5.396 18.638 0 12.017 0z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-ivory/40 mb-4">Quick Links</p>
          <ul className="space-y-2.5 text-sm">
            {[
              ["Home", "/"],
              ["Shop", "/shop"],
              ["Collections", "/collections"],
              ["Custom Furniture", "/custom-furniture"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-ivory transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-ivory/40 mb-4">Customer</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/wishlist" className="hover:text-ivory transition-colors">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-ivory transition-colors">Cart</Link></li>
            <li><Link to={user ? "/account/profile" : "/login"} className="hover:text-ivory transition-colors">My Account</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-ivory/40 mb-4">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5"><Phone size={15} className="mt-0.5 shrink-0" /> {BRAND.phone}</li>
            <li className="flex items-start gap-2.5"><Mail size={15} className="mt-0.5 shrink-0" /> {BRAND.email}</li>
            <li className="flex items-start gap-2.5"><MapPin size={15} className="mt-0.5 shrink-0" /> {BRAND.address}</li>
            <li className="flex items-start gap-2.5"><Clock size={15} className="mt-0.5 shrink-0" /> {BRAND.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs text-ivory/40">
        © 2026 Arvana. All rights reserved.
      </div>
    </footer>
  );
}
