import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = index !== null ? "hidden" : "";
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNavigate]);

  if (index === null) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-charcoal/95 animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute top-6 right-6 text-ivory/80 hover:text-ivory">
        <X size={26} />
      </button>
      <button
        onClick={() => onNavigate((index - 1 + images.length) % images.length)}
        aria-label="Previous image"
        className="absolute left-4 sm:left-8 text-ivory/70 hover:text-ivory"
      >
        <ChevronLeft size={32} />
      </button>
      <img
        src={images[index]}
        alt=""
        className="max-h-[82vh] max-w-[88vw] object-contain animate-scale-in shadow-2xl"
      />
      <button
        onClick={() => onNavigate((index + 1) % images.length)}
        aria-label="Next image"
        className="absolute right-4 sm:right-8 text-ivory/70 hover:text-ivory"
      >
        <ChevronRight size={32} />
      </button>
      <div className="absolute bottom-6 text-ivory/60 text-sm">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
