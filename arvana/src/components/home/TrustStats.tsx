import StatCounter from "../common/StatCounter";

const stats = [
  { value: 10, suffix: "+", label: "Years of Craftsmanship" },
  { value: 5, suffix: "K+", label: "Happy Customers" },
  { value: 150, suffix: "+", label: "Furniture Designs" },
  { value: 100, suffix: "%", label: "Quality Focus" },
];

export default function TrustStats() {
  return (
    <section className="border-y border-cream-border bg-beige/40 py-12 md:py-14">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <StatCounter key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
