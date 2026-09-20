import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "../common/Button";
import { img, PHOTOS } from "../../utils/img";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
      <div
        className="absolute inset-0 scale-110 transition-opacity duration-1000"
        style={{ transform: `translateY(${offset}px) scale(1.1)`, opacity: loaded ? 1 : 0 }}
      >
        <img
          src={img(PHOTOS.heroLiving, 1920)}
          alt="Elegant living room interior featuring premium ARVANA furniture"
          className="h-full w-full object-cover"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/35 to-transparent ${loaded ? "" : "bg-charcoal"}`} />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <div className="max-w-xl">
            <p className="animate-fade-up text-[11px] sm:text-xs uppercase tracking-[0.25em] text-beige-dark font-medium" style={{ animationDelay: "100ms" }}>
              Crafted for Modern Living
            </p>
            <h1
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ivory animate-fade-up"
              style={{ animationDelay: "250ms" }}
            >
              Furniture That
              <br />
              Feels Like Home.
            </h1>
            <p className="mt-6 max-w-md text-sm sm:text-base text-ivory/75 leading-relaxed animate-fade-up" style={{ animationDelay: "400ms" }}>
              Discover thoughtfully crafted furniture designed to bring comfort, character and timeless beauty into every space.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "550ms" }}>
              <LinkButton to="/shop" variant="primary" size="lg" icon={<ArrowRight size={16} />}>
                Explore Collection
              </LinkButton>
              <LinkButton to="/about" variant="outlineLight" size="lg">
                Discover Our Story
              </LinkButton>
            </div>
            <p className="mt-10 text-xs uppercase tracking-wide text-ivory/50 animate-fade-up" style={{ animationDelay: "700ms" }}>
              Premium craftsmanship &nbsp;•&nbsp; Thoughtful design &nbsp;•&nbsp; Made to last
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
