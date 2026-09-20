import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const rows = [
    ["Full Name", user.name],
    ["Email", user.email],
    ["Mobile Number", user.mobile],
  ];

  return (
    <div>
      <h2 className="font-display text-xl text-charcoal mb-6">Profile</h2>
      <div className="max-w-md border border-cream-border divide-y divide-cream-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between px-5 py-4">
            <span className="text-xs uppercase tracking-wide text-charcoal-light">{label}</span>
            <span className="text-sm text-charcoal font-medium">{value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-charcoal-light max-w-md">
        Profile editing isn't wired up in this demo yet — this section is ready to connect to a real account
        update endpoint when the backend is available.
      </p>
    </div>
  );
}
