import type { Testimonial, CollectionInfo, FAQItem } from "../types";
import { img, PHOTOS } from "../utils/img";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya Rao",
    location: "Bengaluru, KA",
    rating: 5,
    quote:
      "Beautiful craftsmanship and even better in person. The Oslo sofa completely changed our living room — friends keep asking where we got it.",
  },
  {
    id: "t2",
    name: "Karthik Menon",
    location: "Kochi, KL",
    rating: 5,
    quote:
      "We ordered the Arlo bed and a custom wardrobe. The attention to detail and finish quality is far beyond what we expected at this price.",
  },
  {
    id: "t3",
    name: "Priya Nair",
    location: "Hyderabad, TS",
    rating: 5,
    quote:
      "From the showroom visit to delivery, everything felt premium and personal. Our dining set is now the heart of our home.",
  },
];

export const collectionsData: CollectionInfo[] = [
  {
    id: "modern-living",
    name: "Modern Living",
    description: "Clean lines and warm neutrals for contemporary living spaces.",
    image: img(PHOTOS.heroLiving2),
    itemCount: 24,
  },
  {
    id: "timeless-classics",
    name: "Timeless Classics",
    description: "Enduring silhouettes crafted from solid hardwoods.",
    image: img(PHOTOS.bedroom1),
    itemCount: 18,
  },
  {
    id: "minimal-bedroom",
    name: "Minimal Bedroom",
    description: "Calm, uncluttered pieces designed for restful spaces.",
    image: img(PHOTOS.bedroom2),
    itemCount: 15,
  },
  {
    id: "dining-essentials",
    name: "Dining Essentials",
    description: "Tables and chairs built for gathering and everyday meals.",
    image: img(PHOTOS.diningRoom),
    itemCount: 20,
  },
  {
    id: "work-from-home",
    name: "Work From Home",
    description: "Desks and storage that make focus feel effortless.",
    image: img(PHOTOS.homeOffice),
    itemCount: 12,
  },
  {
    id: "luxury-collection",
    name: "Luxury Collection",
    description: "Our finest materials and detailing, reserved for statement pieces.",
    image: img(PHOTOS.sofa1),
    itemCount: 10,
  },
];

export const faqData: FAQItem[] = [
  {
    question: "Do you provide home delivery?",
    answer:
      "Yes, we offer white-glove home delivery across major cities, including careful placement and packaging removal.",
  },
  {
    question: "Can furniture be customized?",
    answer:
      "Absolutely. Most pieces can be customized in dimension, material, and finish through our Custom Furniture service.",
  },
  {
    question: "What materials do you use?",
    answer:
      "We primarily work with solid hardwoods such as sheesham, mango, and acacia, paired with premium fabrics, leathers, and veneers.",
  },
  {
    question: "Do you provide installation?",
    answer:
      "Yes, our delivery team handles full assembly and installation for all applicable furniture at no extra cost.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "In-stock items typically arrive within 5–7 business days. Made-to-order and custom pieces take 3–6 weeks depending on complexity.",
  },
  {
    question: "Can I visit the showroom?",
    answer:
      "Of course — our showroom is open all week. Walk in anytime during working hours or book a private consultation slot.",
  },
  {
    question: "Do you accept custom furniture requests?",
    answer:
      "Yes, our design team works with you from concept to delivery on fully bespoke furniture pieces of any scale.",
  },
];
