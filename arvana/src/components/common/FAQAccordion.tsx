import { useState } from "react";
import { Plus } from "lucide-react";
import type { FAQItem } from "../../types";

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-cream-border border-t border-b border-cream-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg text-charcoal">{item.question}</span>
              <Plus
                size={18}
                className={`shrink-0 text-olive transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              />
            </button>
            <div
              className="grid transition-all duration-400 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-10 text-sm leading-relaxed text-charcoal-light">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
