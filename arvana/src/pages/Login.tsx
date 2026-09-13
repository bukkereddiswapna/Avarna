import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { img, PHOTOS } from "../utils/img";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError("Please enter your email/mobile and password.");
      return;
    }
    const result = login(identifier, password);
    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    navigate(location.state?.from ?? "/account", { replace: true });
  };

  const inputClass =
    "w-full border border-cream-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-forest";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige/40 px-4 py-24 sm:py-28">
      <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-2 bg-ivory shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden lg:block relative">
          <img src={img(PHOTOS.interior2, 900)} alt="ARVANA styled interior" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/25" />
        </div>

        <div className="flex flex-col justify-center px-7 py-8 sm:px-10 sm:py-10">
          <p className="font-display text-xl text-charcoal">ARVANA</p>
          <h1 className="mt-3 font-display text-2xl text-charcoal">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-charcoal-light">Sign in to manage your orders and wishlist.</p>

          {error && (
            <p className="mt-4 border border-wood/40 bg-wood/10 text-wood text-xs px-3 py-2.5">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <div>
              <label className={labelClass}>Email or Mobile</label>
              <input
                required
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-charcoal-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                  className="h-3.5 w-3.5 accent-forest"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-charcoal-light hover:text-forest transition-colors">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-charcoal-light">
            Don't have an account?{" "}
            <Link to="/register" className="text-forest hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
