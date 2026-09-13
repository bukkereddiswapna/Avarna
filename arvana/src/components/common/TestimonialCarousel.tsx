import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "../../types";
import Rating from "./Rating";

export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <Quote className="mx-auto mb-6 text-beige-dark" size={36} />
      <div className="relative h-56 sm:h-40">
        {items.map((t, i) => (
          <div
            key={t.id}
            className={`absolute inset-0 flex flex-col items-center justify-start transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <p className="font-display text-xl sm:text-2xl leading-relaxed text-charcoal">"{t.quote}"</p>
            <div className="mt-5 flex flex-col items-center gap-1.5">
              <Rating value={t.rating} showValue={false} />
              <p className="text-sm font-medium text-charcoal">{t.name}</p>
              <p className="text-xs text-charcoal-light">{t.location}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-6">
        <button onClick={prev} aria-label="Previous testimonial" className="text-charcoal-light hover:text-forest transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-forest" : "w-1.5 bg-beige-dark"
              }`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next testimonial" className="text-charcoal-light hover:text-forest transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
