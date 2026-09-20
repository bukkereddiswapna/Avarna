import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import Reveal from "../common/Reveal";
import { img, PHOTOS } from "../../utils/img";

const spaces = [
  { name: "Living Room", desc: "Sofas & lounge seating for gathering.", image: img(PHOTOS.heroLiving2) },
  { name: "Bedroom", desc: "Beds & storage for restful spaces.", image: img(PHOTOS.bedroom1) },
  { name: "Dining Room", desc: "Tables & chairs made for togetherness.", image: img(PHOTOS.diningRoom) },
  { name: "Home Office", desc: "Desks & shelving built for focus.", image: img(PHOTOS.homeOffice) },
];

export default function ShopBySpace() {
  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Browse by Room"
            title="Designed for Every Space"
            subtitle="Furniture that brings character to every corner of your home."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {spaces.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <Link
                to={`/shop?room=${encodeURIComponent(s.name)}`}
                className="group relative block aspect-[5/4] overflow-hidden"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent transition-opacity duration-500 group-hover:from-charcoal/90" />
                <div className="absolute inset-x-0 bottom-0 p-7 flex items-end justify-between">
                  <div className="transition-transform duration-500 group-hover:-translate-y-1">
                    <h3 className="font-display text-2xl text-ivory">{s.name}</h3>
                    <p className="mt-1 text-sm text-ivory/70 max-w-[220px]">{s.desc}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur-sm transition-all duration-500 group-hover:bg-ivory group-hover:text-charcoal group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
