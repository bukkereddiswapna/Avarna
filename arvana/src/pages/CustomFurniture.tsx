import { useState, type FormEvent } from "react";
import { MessageSquare, Palette, CheckCircle, Hammer, Upload, CheckCircle2 } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import { Button } from "../components/common/Button";
import { img, PHOTOS } from "../utils/img";
import { buildWhatsAppLink } from "../data/config";

const steps = [
  { icon: MessageSquare, title: "Share Your Idea", desc: "Tell us what you're envisioning — sketch, reference photo, or a simple description." },
  { icon: Palette, title: "Choose Materials", desc: "Select from our curated woods, fabrics, and finishes to match your space." },
  { icon: CheckCircle, title: "Confirm Design", desc: "We share a detailed proposal and quote for your approval before we begin." },
  { icon: Hammer, title: "We Craft It", desc: "Our artisans handcraft your piece and deliver it fully assembled." },
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  furnitureType: "",
  size: "",
  material: "",
  finish: "",
  budget: "",
  description: "",
};

export default function CustomFurniture() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.furnitureType) e.furnitureType = "Please select a furniture type.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // No design-team backend is connected in this demo, so — same as the
    // Contact page — the request is handed straight to WhatsApp with every
    // field included, which actually reaches the business. Swap this for a
    // real API call once a backend/CRM is ready.
    const lines = [
      "New custom furniture request:",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Furniture Type: ${form.furnitureType}`,
    ];
    if (form.size.trim()) lines.push(`Preferred Size: ${form.size}`);
    if (form.material) lines.push(`Material: ${form.material}`);
    if (form.finish.trim()) lines.push(`Color / Finish: ${form.finish}`);
    if (form.budget) lines.push(`Budget Range: ${form.budget}`);
    if (form.description.trim()) lines.push("", `Description: ${form.description}`);
    if (fileName) lines.push("", `(Reference image selected: ${fileName} — please attach it here in WhatsApp)`);

    window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
    setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-lg border border-cream-border bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

  return (
    <div>
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img
          src={img(PHOTOS.craftsman, 1800)}
          alt="Craftsman building custom furniture"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-beige-dark font-medium animate-fade-up">
              Bespoke Furniture
            </p>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl text-ivory max-w-2xl animate-fade-up" style={{ animationDelay: "150ms" }}>
              Furniture Made Around You.
            </h1>
            <p className="mt-5 max-w-lg text-ivory/75 animate-fade-up" style={{ animationDelay: "300ms" }}>
              Whether it's a sofa sized for an odd corner or a dining table in a finish we don't stock —
              our design team brings your vision to life, handcrafted from scratch.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <SectionHeading eyebrow="How It Works" title="From Idea to Handcrafted Reality" />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="text-center px-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-ivory text-sm font-display">
                  {i + 1}
                </div>
                <s.icon size={22} className="mx-auto mt-4 text-forest" strokeWidth={1.5} />
                <h3 className="mt-3 font-display text-lg text-charcoal">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-beige/30">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <Reveal>
            <SectionHeading eyebrow="Enquiry" title="Start Your Custom Request" />
          </Reveal>

          <div className="mt-12">
            {submitted ? (
              <div className="text-center py-16 rounded-2xl border border-cream-border bg-white shadow-xl animate-scale-in">
                <CheckCircle2 size={40} className="mx-auto text-forest" strokeWidth={1.4} />
                <p className="mt-5 font-display text-2xl text-charcoal">
                  Thank you! Our design team will contact you soon.
                </p>
                <p className="mt-2 text-sm text-charcoal-light">
                  We've opened WhatsApp with your request pre-filled — just hit send there and our team will
                  respond within 24 hours with next steps and a rough estimate.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-2xl bg-white p-6 sm:p-10 border border-cream-border shadow-xl" noValidate>
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    type="text"
                    placeholder="Your full name"
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-1 text-xs text-wood">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-wood">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Email</label>
                  <input
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                  {errors.email && <p className="mt-1 text-xs text-wood">{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass}>Furniture Type</label>
                  <select
                    required
                    value={form.furnitureType}
                    onChange={(e) => set("furnitureType", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select type</option>
                    <option>Sofa</option>
                    <option>Bed</option>
                    <option>Dining Table</option>
                    <option>Wardrobe</option>
                    <option>Storage Unit</option>
                    <option>Other</option>
                  </select>
                  {errors.furnitureType && <p className="mt-1 text-xs text-wood">{errors.furnitureType}</p>}
                </div>
                <div>
                  <label className={labelClass}>Preferred Size</label>
                  <input
                    value={form.size}
                    onChange={(e) => set("size", e.target.value)}
                    type="text"
                    placeholder='e.g. 78" x 36" x 30"'
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Material</label>
                  <select value={form.material} onChange={(e) => set("material", e.target.value)} className={inputClass}>
                    <option value="">Select material</option>
                    <option>Sheesham Wood</option>
                    <option>Mango Wood</option>
                    <option>Acacia Wood</option>
                    <option>Engineered Wood</option>
                    <option>Not Sure Yet</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Color / Finish</label>
                  <input
                    value={form.finish}
                    onChange={(e) => set("finish", e.target.value)}
                    type="text"
                    placeholder="e.g. Walnut, Matte Black"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Budget Range</label>
                  <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className={inputClass}>
                    <option value="">Select budget</option>
                    <option>Under ₹20,000</option>
                    <option>₹20,000 – ₹50,000</option>
                    <option>₹50,000 – ₹1,00,000</option>
                    <option>Above ₹1,00,000</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={4}
                    placeholder="Tell us more about what you have in mind…"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Reference Image (optional)</label>
                  <label className="flex items-center gap-3 rounded-lg border border-dashed border-cream-border bg-white px-4 py-6 cursor-pointer transition-colors hover:border-forest">
                    <Upload size={18} className="text-charcoal-light" />
                    <span className="text-sm text-charcoal-light">
                      {fileName ?? "Click to upload a reference photo or sketch"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>
                </div>
                <p className="sm:col-span-2 text-xs text-charcoal-light">
                  This form sends your request via WhatsApp — no email backend is connected yet.
                </p>
                <div className="sm:col-span-2 mt-2">
                  <Button type="submit" size="lg" className="w-full">
                    Submit Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
