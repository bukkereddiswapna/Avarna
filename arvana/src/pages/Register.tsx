import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { img, PHOTOS } from "../utils/img";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit number.";
    if (form.password.length < 6) e.password = "Min. 6 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match.";
    if (!agreed) e.terms = "You must agree to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const result = register(form);
    if (!result.success) {
      setErrors({ email: result.error ?? "Something went wrong." });
      return;
    }
    navigate("/account", { replace: true });
  };

  const inputClass =
    "w-full border border-cream-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-forest";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige/40 px-4 py-16 sm:py-20">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-ivory shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex flex-col justify-center px-7 py-8 sm:px-10 sm:py-10 order-2 lg:order-1">
          <p className="font-display text-xl text-charcoal">ARVANA</p>
          <h1 className="mt-3 font-display text-2xl text-charcoal">Create Account</h1>
          <p className="mt-1.5 text-sm text-charcoal-light">Join us for a more personal furniture experience.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <div>
              <label className={labelClass}>Full Name</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} type="text" placeholder="Your full name" className={inputClass} />
              {errors.name && <p className="mt-1 text-xs text-wood">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" placeholder="you@example.com" className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-wood">{errors.email}</p>}
              </div>
              <div>
                <label className={labelClass}>Mobile Number</label>
                <input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} type="tel" placeholder="10-digit number" className={inputClass} />
                {errors.mobile && <p className="mt-1 text-xs text-wood">{errors.mobile}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password</label>
                <input value={form.password} onChange={(e) => set("password", e.target.value)} type="password" placeholder="••••••••" className={inputClass} />
                {errors.password && <p className="mt-1 text-xs text-wood">{errors.password}</p>}
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input value={form.confirm} onChange={(e) => set("confirm", e.target.value)} type="password" placeholder="••••••••" className={inputClass} />
                {errors.confirm && <p className="mt-1 text-xs text-wood">{errors.confirm}</p>}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2 text-xs text-charcoal-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed((v) => !v)}
                  className="mt-0.5 h-3.5 w-3.5 accent-forest"
                />
                I agree to the Terms &amp; Conditions and Privacy Policy.
              </label>
              {errors.terms && <p className="mt-1 text-xs text-wood">{errors.terms}</p>}
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-charcoal-light">
            Already have an account?{" "}
            <Link to="/login" className="text-forest hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <div className="hidden lg:block relative order-1 lg:order-2">
          <img src={img(PHOTOS.interior4, 900)} alt="ARVANA styled interior" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/25" />
        </div>
      </div>
    </div>
  );
}
