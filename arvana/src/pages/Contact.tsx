import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Navigation, CheckCircle2 } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import Reveal from "../components/common/Reveal";
import { Button } from "../components/common/Button";
import { BRAND, buildWhatsAppLink, GOOGLE_MAPS_EMBED_SRC, GENERAL_ENQUIRY_MESSAGE } from "../data/config";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number.";
    if (!form.message.trim()) e.message = "Please enter a message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // No email/CRM backend is connected in this demo, so we don't pretend to
    // send an email — instead we hand the enquiry straight to WhatsApp,
    // which actually reaches the business. Swap this for a real API call
    // (e.g. Web3Forms, EmailJS, or a custom backend endpoint) when ready.
    const waMessage = `New enquiry from website:\n\nName: ${form.name}\nEmail: ${form.email}${
      form.phone ? `\nPhone: ${form.phone}` : ""
    }\n\nMessage: ${form.message}`;
    window.open(buildWhatsAppLink(waMessage), "_blank");
    setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-lg border border-cream-border bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";
  const labelClass = "text-xs uppercase tracking-wide text-charcoal-light mb-1.5 block";

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Get in Touch"
            title="Visit Our Showroom"
            subtitle="We'd love to help you find, or build, the perfect piece."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-14">
          <Reveal>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="mt-1 text-forest shrink-0" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Address</p>
                  <p className="mt-1 text-sm text-charcoal-light">{BRAND.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="mt-1 text-forest shrink-0" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Phone</p>
                  <p className="mt-1 text-sm text-charcoal-light">{BRAND.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={20} className="mt-1 text-forest shrink-0" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Email</p>
                  <p className="mt-1 text-sm text-charcoal-light">{BRAND.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={20} className="mt-1 text-forest shrink-0" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Opening Hours</p>
                  <p className="mt-1 text-sm text-charcoal-light">{BRAND.hours}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={buildWhatsAppLink(GENERAL_ENQUIRY_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-white text-[#128C4A] px-5 py-3 text-xs uppercase tracking-wide shadow-sm transition-all hover:shadow-md hover:bg-[#25D366]/10"
                >
                  <MessageCircle size={15} /> Chat on WhatsApp
                </a>
                <a
                  href={BRAND.googleMapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-charcoal bg-white px-5 py-3 text-xs uppercase tracking-wide shadow-sm transition-all hover:shadow-md hover:bg-charcoal hover:text-ivory"
                >
                  <Navigation size={15} /> Get Directions
                </a>
              </div>

              {/* Real embedded map */}
              <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-cream-border bg-beige shadow-md">
                <iframe
                  title="ARVANA Showroom Location"
                  src={GOOGLE_MAPS_EMBED_SRC}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-charcoal-light">{BRAND.address}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center rounded-2xl border border-cream-border bg-white p-10 shadow-xl animate-scale-in">
                <CheckCircle2 size={38} className="text-forest" strokeWidth={1.4} />
                <p className="mt-5 font-display text-2xl text-charcoal">Message sent via WhatsApp!</p>
                <p className="mt-2 text-sm text-charcoal-light">
                  We've opened WhatsApp with your enquiry pre-filled — just hit send there and our team will
                  reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-cream-border p-6 sm:p-10 bg-white shadow-xl" noValidate>
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    type="text"
                    placeholder="Your full name"
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-1 text-xs text-wood">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                    {errors.email && <p className="mt-1 text-xs text-wood">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-wood">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={5}
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                  {errors.message && <p className="mt-1 text-xs text-wood">{errors.message}</p>}
                </div>
                <p className="text-xs text-charcoal-light">
                  This form sends your enquiry via WhatsApp — no email backend is connected yet.
                </p>
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
