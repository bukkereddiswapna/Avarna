import { Gem, Hammer, Leaf } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import StatCounter from "../components/common/StatCounter";
import { LinkButton } from "../components/common/Button";
import { img, PHOTOS } from "../utils/img";

export default function About() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[440px] overflow-hidden">
        <img src={img(PHOTOS.showroom, 1800)} alt="ARVANA showroom interior" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-beige-dark font-medium">Our Story</p>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl text-ivory max-w-2xl">
              Crafted with Purpose, Built to Last.
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.2em] text-olive font-medium">Our Story</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-charcoal leading-tight">
              Started in a small workshop, built on an old idea.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-charcoal-light">
              ARVANA began over a decade ago in a modest woodworking studio, where our founders believed
              furniture should be an heirloom, not an afterthought. What started as handcrafted pieces for
              friends and family has grown into a brand trusted by thousands of homes — without ever losing
              the attention to detail we started with.
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              Today, every ARVANA piece still passes through the hands of skilled artisans before it reaches
              your home, blending traditional joinery techniques with a distinctly modern design language.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <img src={img(PHOTOS.craftsman, 1200)} alt="Artisan crafting furniture" className="w-full aspect-[4/3] object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-cream-border bg-beige/40 py-14">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value={10} suffix="+" label="Years of Craftsmanship" />
          <StatCounter value={5} suffix="K+" label="Happy Customers" />
          <StatCounter value={150} suffix="+" label="Furniture Designs" />
          <StatCounter value={40} suffix="+" label="Skilled Artisans" />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <SectionHeading eyebrow="What We Believe" title="Our Philosophy" />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { icon: Hammer, title: "Craftsmanship First", desc: "Every joint, seam and finish is checked by hand before it leaves our workshop." },
              { icon: Leaf, title: "Honest Materials", desc: "We use solid woods and natural fibres, sourced responsibly and built to age gracefully." },
              { icon: Gem, title: "Quality Promise", desc: "If a piece doesn't meet our standard, it doesn't leave the workshop — no exceptions." },
            ].map((f, i) => (
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

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <Reveal>
          <img src={img(PHOTOS.woodTexture, 1200)} alt="Solid wood material detail" className="h-full w-full object-cover min-h-[360px]" />
        </Reveal>
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-center bg-charcoal px-8 py-16 sm:px-16 sm:py-20">
            <p className="text-[11px] uppercase tracking-[0.2em] text-beige-dark font-medium">Materials</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory leading-tight">
              The wood tells the story.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70">
              We work primarily with sheesham, mango and acacia hardwoods — chosen for their strength,
              grain character and ability to age beautifully. Every plank is inspected before it becomes
              part of your home.
            </p>
            <div className="mt-9">
              <LinkButton to="/custom-furniture" variant="outlineLight">
                Build Something Custom
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
