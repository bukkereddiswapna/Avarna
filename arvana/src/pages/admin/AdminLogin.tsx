import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LayoutDashboard } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = login(email, password, rememberMe);
    if (!result.success) {
      setErrors({ form: result.error });
      return;
    }
    navigate("/admin/dashboard", { replace: true });
  };

  const inputClass =
    "w-full rounded-lg border border-cream-border bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8 sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-ivory">
          <LayoutDashboard size={22} />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl text-charcoal">ARVANA Admin</h1>
        <p className="mt-1.5 text-center text-sm text-charcoal-light">Sign in to manage your store.</p>

        {errors.form && (
          <p className="mt-5 rounded-lg border border-wood/40 bg-wood/10 px-3 py-2.5 text-xs text-wood">
            {errors.form}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className={labelClass}>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@arvana.co.in"
              className={inputClass}
            />
            {errors.email && <p className="mt-1 text-xs text-wood">{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-wood">{errors.password}</p>}
          </div>

          <label className="flex items-center gap-2 text-xs text-charcoal-light cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((v) => !v)}
              className="h-3.5 w-3.5 accent-forest"
            />
            Remember me
          </label>

          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] text-charcoal-light">
          Demo credentials — admin@arvana.co.in / Arvana@Admin123
        </p>
      </div>
    </div>
  );
}
