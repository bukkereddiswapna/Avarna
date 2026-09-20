import { Link } from "react-router-dom";

/**
 * Premium wordmark + monogram lockup for ARVANA.
 * The mark is a refined diamond badge with a hand-drawn "A", evoking a
 * furniture-maker's stamp/crest rather than a literal furniture icon.
 * currentColor driven so it inherits navbar text color (ivory on hero,
 * charcoal on scroll).
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" aria-label="ARVANA — Home" className={`flex items-center gap-3 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="8" y="8" width="28" height="28" transform="rotate(45 22 22)" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M22 13L28.5 30.5H26L24.3 25.8H19.5L17.8 30.5H15.4L22 13ZM22 17.7L20.1 23.8H23.8L22 17.7Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-display text-2xl tracking-[0.08em] leading-none">ARVANA</span>
    </Link>
  );
}
