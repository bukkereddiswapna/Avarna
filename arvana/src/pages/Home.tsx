import Hero from "../components/home/Hero";
import TrustStats from "../components/home/TrustStats";
import ShopBySpace from "../components/home/ShopBySpace";
import FeaturedCollection from "../components/home/FeaturedCollection";
import Editorial from "../components/home/Editorial";
import NewArrivals from "../components/home/NewArrivals";
import CustomFurnitureSection from "../components/home/CustomFurnitureSection";
import WhyArvana from "../components/home/WhyArvana";
import InspirationGallery from "../components/home/InspirationGallery";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import TestimonialCarousel from "../components/common/TestimonialCarousel";
import FAQAccordion from "../components/common/FAQAccordion";
import FinalCTA from "../components/home/FinalCTA";
import { testimonials } from "../data/content";
import { faqData } from "../data/content";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStats />
      <ShopBySpace />
      <FeaturedCollection />
      <Editorial />
      <NewArrivals />
      <CustomFurnitureSection />
      <WhyArvana />
      <InspirationGallery />

      <section className="py-20 md:py-28 bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <SectionHeading eyebrow="Testimonials" title="Loved by Our Customers" />
          </Reveal>
          <div className="mt-14">
            <TestimonialCarousel items={testimonials} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-beige/30">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <Reveal>
            <SectionHeading eyebrow="Questions" title="Frequently Asked" />
          </Reveal>
          <div className="mt-12">
            <FAQAccordion items={faqData} />
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
