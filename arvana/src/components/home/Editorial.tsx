import { ArrowRight } from "lucide-react";
import { LinkButton } from "../common/Button";
import Reveal from "../common/Reveal";
import { img, PHOTOS } from "../../utils/img";

export default function Editorial() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      <Reveal className="order-2 lg:order-1">
        <div className="h-full min-h-[420px] lg:min-h-[560px]">
          <img
            src={img(PHOTOS.livingCozy, 1400)}
            alt="Warm, lived-in living room with ARVANA furniture"
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>
      <Reveal delay={120} className="order-1 lg:order-2">
        <div className="flex h-full flex-col justify-center bg-beige px-8 py-16 sm:px-16 sm:py-20">
          <p className="text-[11px] uppercase tracking-[0.2em] text-olive font-medium">Our Philosophy</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-charcoal">
            Made to Live With.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal-light">
            Every ARVANA piece begins with a conversation between craftsmanship and comfort. We source
            quality hardwoods and natural textiles, then shape them with modern design sensibilities —
            so each piece feels considered, not manufactured. The result is furniture built to be lived
            with, not just looked at.
          </p>
          <div className="mt-9">
            <LinkButton to="/about" variant="outline" icon={<ArrowRight size={16} />}>
              Our Story
            </LinkButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
