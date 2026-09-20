import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import { collectionsData } from "../data/content";

export default function Collections() {
  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Curated"
            title="Our Collections"
            subtitle="Explore furniture grouped by style, mood and the way you live."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {collectionsData.map((c, i) => (
            <Reveal key={c.id} delay={(i % 2) * 100}>
              <Link
                to={`/shop?collection=${encodeURIComponent(c.name)}`}
                className="group relative block aspect-[4/3] overflow-hidden"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="text-[11px] uppercase tracking-wide text-beige-dark">{c.itemCount} Pieces</p>
                  <h3 className="mt-1 font-display text-2xl md:text-3xl text-ivory">{c.name}</h3>
                  <p className="mt-2 max-w-sm text-sm text-ivory/70">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-ivory border-b border-ivory/50 pb-1 group-hover:border-ivory transition-colors">
                    Explore Collection <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
