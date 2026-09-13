import { useState } from "react";
import SectionHeading from "../common/SectionHeading";
import Reveal from "../common/Reveal";
import Lightbox from "../common/Lightbox";
import { img, PHOTOS } from "../../utils/img";

const images = [
  img(PHOTOS.heroLiving2, 900),
  img(PHOTOS.bedroom2, 900),
  img(PHOTOS.diningRoom, 900),
  img(PHOTOS.interior1, 900),
  img(PHOTOS.livingCozy, 900),
  img(PHOTOS.interior3, 900),
  img(PHOTOS.homeOffice, 900),
  img(PHOTOS.interior4, 900),
];

const spans = [
  "row-span-2",
  "",
  "",
  "row-span-2",
  "",
  "",
  "row-span-2",
  "",
];

export default function InspirationGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-beige/30">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading eyebrow="Inspiration" title="Spaces We Love" subtitle="A look inside homes styled with ARVANA." />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-4">
          {images.map((src, i) => (
            <Reveal key={src} delay={(i % 4) * 60} className={spans[i]}>
              <button
                onClick={() => setActiveIndex(i)}
                className="group relative h-full w-full overflow-hidden block"
                aria-label="Open image"
              >
                <img
                  src={src}
                  alt="Interior styled with ARVANA furniture"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox images={images} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </section>
  );
}
