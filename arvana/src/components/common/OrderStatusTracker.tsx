import { Check } from "lucide-react";
import { ORDER_STAGES, type OrderStatus } from "../../types";

export default function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STAGES.indexOf(status);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-w-[560px] items-start">
        {ORDER_STAGES.map((stage, i) => {
          const done = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={stage} className="flex flex-1 flex-col items-center relative">
              {i > 0 && (
                <div
                  className={`absolute top-4 right-1/2 h-[2px] w-full -z-0 ${
                    i <= currentIndex ? "bg-forest" : "bg-cream-border"
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  done ? "bg-forest border-forest text-ivory" : "bg-ivory border-cream-border text-charcoal-light"
                } ${isCurrent ? "ring-4 ring-forest/15" : ""}`}
              >
                {done ? <Check size={15} /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <p
                className={`mt-3 text-center text-[11px] uppercase tracking-wide px-1 ${
                  done ? "text-charcoal font-medium" : "text-charcoal-light"
                }`}
              >
                {stage}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
