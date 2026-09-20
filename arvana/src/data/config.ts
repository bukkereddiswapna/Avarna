// Central configuration for the ARVANA demo site.
// Update these values to match the real business before handing off to a client.

// WhatsApp number with country code, no + sign, spaces, or dashes.
export const WHATSAPP_NUMBER = "918885681468";

export const BRAND = {
  name: "ARVANA",
  tagline: "Furniture Crafted for Living.",
  phone: "+91 88856 81468",
  email: "hello@arvana.co.in",
  addressLine: "24 Craftsman Lane, Whitefield",
  city: "Kurnool",
  state: "Andhra Pradesh",
  pincode: "518001",
  get address() {
    return `${this.addressLine}, ${this.city}, ${this.state} ${this.pincode}`;
  },
  hours: "Mon – Sat: 10:00 AM – 8:00 PM · Sun: 11:00 AM – 6:00 PM",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  pinterest: "https://pinterest.com",
  // Replace with the business's real Google Maps share link (Share > Copy Link).
  googleMapsLink: "https://maps.google.com/?q=Kurnool,Andhra+Pradesh,518001",
};

// Used for the embedded map on the Contact page. No API key required —
// this uses the public Google Maps embed query format. Replace the query
// text with the exact business address for best accuracy, or swap in an
// official "Embed a map" iframe src from Google Maps once available.
export const GOOGLE_MAPS_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${BRAND.addressLine}, ${BRAND.city}, ${BRAND.state} ${BRAND.pincode}`
)}&z=15&output=embed`;

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildProductEnquiryMessage(productName: string) {
  return `Hello, I am interested in your furniture products. I would like to know more about the ${productName}.`;
}

export const GENERAL_ENQUIRY_MESSAGE =
  "Hello, I am interested in your furniture products. I would like to know more.";
