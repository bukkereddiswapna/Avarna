import { ArrowRight, Ruler, Palette, Sparkles } from "lucide-react";
import { LinkButton } from "../common/Button";
import Reveal from "../common/Reveal";
import { img, PHOTOS } from "../../utils/img";

const features = [
  { icon: Ruler, label: "Custom Dimensions" },
  { icon: Palette, label: "Choice of Materials" },
  { icon: Sparkles, label: "Personalized Finishes" },
];

export default function CustomFurnitureSection() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-24 md:py-32">
      <img
        src={img(PHOTOS.craftsman, 1800)}
        alt="Craftsman finishing a custom furniture piece"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="max-w-xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.2em] text-beige-dark font-medium">Bespoke Furniture</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory">
              Your Space.
              <br />
              Your Vision.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ivory/70">
              From dimensions to finishes, create furniture that is uniquely yours.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-9 flex flex-col sm:flex-row gap-6 sm:gap-10">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <f.icon size={20} className="text-beige-dark" />
                  <span className="text-sm text-ivory/85">{f.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-10">
              <LinkButton to="/custom-furniture" variant="secondary" size="lg" icon={<ArrowRight size={16} />} className="!bg-ivory !text-charcoal !border-ivory hover:!bg-transparent hover:!text-ivory">
                Start a Custom Request
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
