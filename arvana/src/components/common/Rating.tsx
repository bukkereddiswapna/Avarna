import { Star } from "lucide-react";

export default function Rating({
  value,
  reviews,
  size = 14,
  showValue = true,
}: {
  value: number;
  reviews?: number;
  size?: number;
  showValue?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex items-center gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.round(value) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs text-charcoal-light">
          {value.toFixed(1)}
          {reviews !== undefined && ` (${reviews})`}
        </span>
      )}
    </div>
  );
}
