import { useState } from "react";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import Reveal from "../common/Reveal";
import { LinkButton } from "../common/Button";
import ProductCard from "../product/ProductCard";
import QuickViewModal from "../product/QuickViewModal";
import { useProducts, isVisibleToCustomers } from "../../context/ProductContext";
import type { Product } from "../../types";

export default function FeaturedCollection() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.isFeatured && isVisibleToCustomers(p)).slice(0, 8);
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Curated Selection"
            title="Featured Pieces"
            subtitle="Timeless designs chosen to elevate your everyday spaces."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <ProductCard product={p} onQuickView={setQuickView} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 text-center">
          <LinkButton to="/shop" variant="outline" icon={<ArrowRight size={16} />}>
            View All Furniture
          </LinkButton>
        </div>
      </div>
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
