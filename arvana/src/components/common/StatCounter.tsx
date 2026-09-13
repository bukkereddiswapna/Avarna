import { useEffect, useState } from "react";
import { useReveal } from "../../hooks/useReveal";

export default function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useReveal<HTMLDivElement>(0.4);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, value]);

  return (
    <div ref={ref} className="reveal is-visible text-center">
      <p className="font-display text-4xl md:text-5xl text-charcoal">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-xs md:text-sm uppercase tracking-wide text-charcoal-light">{label}</p>
    </div>
  );
}
