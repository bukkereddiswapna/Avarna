import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "warning" | "danger";
}) {
  const toneClasses =
    tone === "warning"
      ? "bg-wood/10 text-wood"
      : tone === "danger"
        ? "bg-charcoal/10 text-charcoal"
        : "bg-forest/10 text-forest";

  return (
    <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-charcoal-light">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses}`}>
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl text-charcoal">{value}</p>
    </div>
  );
}
