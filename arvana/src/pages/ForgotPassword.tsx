import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { users, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleRequest = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!exists) {
      setError("No account found with this email address.");
      return;
    }
    setStep("reset");
  };

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const result = resetPassword(email, newPassword);
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setDone(true);
  };

  const inputClass =
    "w-full border border-cream-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-forest";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige/40 px-4 py-24">
      <div className="w-full max-w-sm bg-ivory shadow-xl px-7 py-8 sm:px-10 sm:py-10">
        <p className="font-display text-xl text-charcoal text-center">ARVANA</p>

        {done ? (
          <div className="mt-10 text-center animate-scale-in">
            <CheckCircle2 size={40} className="mx-auto text-forest" strokeWidth={1.4} />
            <h1 className="mt-5 font-display text-2xl text-charcoal">Password Reset</h1>
            <p className="mt-2 text-sm text-charcoal-light">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Button onClick={() => navigate("/login")} className="mt-7 w-full" size="lg">
              Back to Login
            </Button>
          </div>
        ) : step === "request" ? (
          <>
            <h1 className="mt-6 font-display text-3xl text-charcoal">Forgot Password</h1>
            <p className="mt-2 text-sm text-charcoal-light">
              Enter your account email and we'll help you reset your password.
            </p>
            {error && <p className="mt-5 border border-wood/40 bg-wood/10 text-wood text-sm px-4 py-3">{error}</p>}
            <form onSubmit={handleRequest} className="mt-6 space-y-5" noValidate>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Continue
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-6 font-display text-3xl text-charcoal">Set New Password</h1>
            <p className="mt-2 text-sm text-charcoal-light">Choose a new password for {email}.</p>
            {error && <p className="mt-5 border border-wood/40 bg-wood/10 text-wood text-sm px-4 py-3">{error}</p>}
            <form onSubmit={handleReset} className="mt-6 space-y-5" noValidate>
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  required
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Reset Password
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-charcoal-light">
          Remembered your password?{" "}
          <Link to="/login" className="text-forest hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
