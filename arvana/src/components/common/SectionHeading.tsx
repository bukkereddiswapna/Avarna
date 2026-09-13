export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "text-left"}>
      {eyebrow && (
        <p className={`text-[11px] uppercase tracking-[0.2em] font-medium mb-3 ${light ? "text-beige-dark" : "text-olive"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl leading-tight ${light ? "text-ivory" : "text-charcoal"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base ${light ? "text-ivory/70" : "text-charcoal-light"}`}>{subtitle}</p>
      )}
    </div>
  );
}
