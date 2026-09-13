import SectionHeading from "../common/SectionHeading";
import Reveal from "../common/Reveal";
import ProductCard from "../product/ProductCard";
import { products } from "../../data/products";

export default function NewArrivals() {
  const newItems = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-beige/30">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Just Landed"
            title="New Arrivals"
            subtitle="The newest additions to our furniture collection."
            align="left"
          />
        </Reveal>

        <div className="mt-12 -mx-5 md:mx-0 flex md:grid md:grid-cols-4 gap-5 overflow-x-auto px-5 md:px-0 pb-4 md:pb-0 snap-x snap-mandatory">
          {newItems.map((p, i) => (
            <Reveal key={p.id} delay={i * 80} className="min-w-[68%] sm:min-w-[42%] md:min-w-0 snap-start">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
