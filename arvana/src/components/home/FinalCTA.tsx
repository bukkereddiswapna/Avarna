import { LinkButton } from "../common/Button";
import Reveal from "../common/Reveal";

export default function FinalCTA() {
  return (
    <section className="bg-forest py-24 md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 text-center">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory max-w-2xl mx-auto">
            Let's Create a Space You'll Love.
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-ivory/70 text-base leading-relaxed">
            Explore our collection or talk to us about creating something made specifically for your home.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <LinkButton to="/shop" variant="secondary" size="lg" className="!bg-ivory !text-charcoal !border-ivory hover:!bg-transparent hover:!text-ivory">
              Shop Furniture
            </LinkButton>
            <LinkButton to="/contact" variant="outlineLight" size="lg">
              Contact Us
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
