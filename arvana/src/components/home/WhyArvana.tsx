import { Gem, Hammer, Ruler, Truck } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import Reveal from "../common/Reveal";

const features = [
  { icon: Gem, title: "Premium Materials", desc: "Selected for durability, comfort and lasting beauty." },
  { icon: Hammer, title: "Expert Craftsmanship", desc: "Every piece is carefully crafted with attention to detail." },
  { icon: Ruler, title: "Made for You", desc: "Flexible designs and customization for your space." },
  { icon: Truck, title: "Reliable Delivery", desc: "Carefully handled from our workshop to your home." },
];

export default function WhyArvana() {
  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading eyebrow="Why Arvana" title="Furniture Built on Trust" />
        </Reveal>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100} className="text-center px-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cream-border">
                <f.icon size={24} className="text-forest" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-xl text-charcoal">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{f.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
