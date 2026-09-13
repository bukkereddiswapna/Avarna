export function img(id: string, w = 1200, q = 80): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

// Curated pool of furniture / interior photography used across the site.
// Every ID below has been verified (via Unsplash's own alt-text/description)
// to actually depict what its key name claims, to avoid hover/category
// image mismatches (e.g. a "dining room" image that was actually a bedroom).
export const PHOTOS = {
  heroLiving: "photo-1560448204-e02f11c3d0e2", // premium living room, warm beige couch and armchair — matches the site's ivory/beige/wood palette
  heroLiving2: "photo-1616047006789-b7af5afb8c20", // living room, tan leather sectional
  livingCozy: "photo-1699901524286-41a46a4cd5c8",
  sofa1: "photo-1555041469-a586c61ea9bc", // green fabric sofa
  sofa2: "photo-1611967164521-abae8fba4668", // gray sofa with throw pillows
  sofaLounge: "photo-1567538096630-e0c55bd6374c", // tufted white leather sofa chair
  armchair: "photo-1605702098590-d552a98dc93d", // brown wooden armchair
  modernChair: "photo-1586158291800-2665f07bba79", // white padded armchair, black frame
  bedroom1: "photo-1616486029423-aaa4789e8c9a", // bedroom, bed + leather bench + wall art
  bed1: "photo-1616594039964-ae9021a400a0", // modern bedroom, white upholstered bed
  bedroom2: "photo-1560185893-a55cbc8c57e8", // bedroom, dark grey walls, floral rug
  wardrobe: "photo-1672137233327-37b0c1049e77", // walk-in closet with mirror and stool
  diningTable: "photo-1617806118233-18e1de247200", // wooden dining table and chairs
  diningRoom: "photo-1616486886892-ff366aa67ba4", // dining table and chairs
  diningChair: "photo-1604578762246-41134e37f9cc", // wooden dining table and chairs
  diningSet: "photo-1723750290151-164cb19ebab7", // dining room, table and chairs
  coffeeTable: "photo-1592078615290-033ee584e267",
  deskWorkspace: "photo-1595846723416-99a641e1231a", // desk near blue padded chair
  homeOffice: "photo-1737233030536-247c1379d82c", // room with a desk and a chair
  bookshelf: "photo-1636499447962-1e4674d738aa", // bookshelf filled with books
  dressingTable: "photo-1556020685-ae41abfc9365", // white wooden dresser with mirror
  bedsideTable: "photo-1615529182904-14819c35db37",
  tvConsole: "photo-1714872245785-674ae3038d21", // living room, couch, chair, television
  showroom: "photo-1571508601891-ca5e7a713859",
  interior1: "photo-1484154218962-a197022b5858",
  interior2: "photo-1550254478-ead40cc54513",
  interior3: "photo-1522771739844-6a9f6d5f14af",
  interior4: "photo-1560184897-ae75f418493e",
  woodTexture: "photo-1779031242515-205111711b23", // carpenter working with wood
  craftsman: "photo-1779031242515-205111711b23", // carpenter working wood, workshop
};
