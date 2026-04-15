export interface DemoReview {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  status: "approved";
}

export const demoReviews: DemoReview[] = [
  // Classic Cotton Tee
  {
    id: "rev-1",
    product_id: "demo-1",
    author_name: "Marcus T.",
    rating: 5,
    title: "Best tee I've owned",
    content: "The weight is perfect — not too thin, not too heavy. Bought two more after the first wash convinced me this is the one.",
    created_at: "2026-03-20T14:30:00Z",
    status: "approved",
  },
  {
    id: "rev-2",
    product_id: "demo-1",
    author_name: "Sarah K.",
    rating: 4,
    title: "Great quality, runs slightly large",
    content: "Fabric is excellent and the stitching is solid. Size down if you prefer a fitted look.",
    created_at: "2026-03-15T09:00:00Z",
    status: "approved",
  },
  // Linen Resort Shirt
  {
    id: "rev-3",
    product_id: "demo-2",
    author_name: "James L.",
    rating: 5,
    title: "Perfect summer shirt",
    content: "Wore this through two weeks in Portugal. Breathes like a dream and the camp collar sits perfectly.",
    created_at: "2026-03-10T11:20:00Z",
    status: "approved",
  },
  // Slim Stretch Chinos
  {
    id: "rev-4",
    product_id: "demo-5",
    author_name: "Daniel R.",
    rating: 5,
    title: "My go-to work pant",
    content: "The stretch makes these incredibly comfortable for all-day wear. The olive color is spot on.",
    created_at: "2026-03-18T16:45:00Z",
    status: "approved",
  },
  {
    id: "rev-5",
    product_id: "demo-5",
    author_name: "Alex M.",
    rating: 4,
    title: "Solid chinos",
    content: "Good construction and the fit is true to size. Would love to see more color options.",
    created_at: "2026-03-12T08:15:00Z",
    status: "approved",
  },
  // Relaxed Selvedge Denim
  {
    id: "rev-6",
    product_id: "demo-6",
    author_name: "Kevin W.",
    rating: 5,
    title: "Incredible denim",
    content: "Real selvedge at this price is unbeatable. Three months in and the fades are starting to show beautifully.",
    created_at: "2026-02-28T13:00:00Z",
    status: "approved",
  },
  // Heavyweight Crewneck
  {
    id: "rev-7",
    product_id: "demo-9",
    author_name: "Emily C.",
    rating: 5,
    title: "Heavy and luxurious",
    content: "This is the kind of sweatshirt that makes you cancel plans and stay on the couch. Worth every penny.",
    created_at: "2026-03-22T10:30:00Z",
    status: "approved",
  },
  {
    id: "rev-8",
    product_id: "demo-9",
    author_name: "Ryan P.",
    rating: 4,
    title: "Chunky in the best way",
    content: "The 450 GSM weight is no joke. This feels like it will last years. Runs true to size.",
    created_at: "2026-03-08T15:20:00Z",
    status: "approved",
  },
  // Full-Zip Hoodie
  {
    id: "rev-9",
    product_id: "demo-10",
    author_name: "Chris D.",
    rating: 5,
    title: "Daily driver",
    content: "I own five hoodies and this is the only one I reach for. The zipper is smooth and the pockets are deep.",
    created_at: "2026-04-01T12:00:00Z",
    status: "approved",
  },
  // Oxford Button-Down
  {
    id: "rev-10",
    product_id: "demo-4",
    author_name: "Nathan S.",
    rating: 5,
    title: "Perfect oxford",
    content: "The collar roll is exactly right. Not too stiff, not floppy. Gets better with every wash.",
    created_at: "2026-03-05T17:30:00Z",
    status: "approved",
  },
  // Waxed Canvas Jacket
  {
    id: "rev-11",
    product_id: "demo-13",
    author_name: "Tom H.",
    rating: 5,
    title: "Built to last",
    content: "The Millerain wax cotton is the real deal. Handled a full day of rain in the Lake District without issue.",
    created_at: "2026-03-25T09:45:00Z",
    status: "approved",
  },
  {
    id: "rev-12",
    product_id: "demo-13",
    author_name: "Anna B.",
    rating: 4,
    title: "Beautiful but heavy",
    content: "Stunning craftsmanship and the brass hardware is gorgeous. It's a substantial jacket though — not for warm days.",
    created_at: "2026-03-14T14:15:00Z",
    status: "approved",
  },
  // Pleated Wool Trousers
  {
    id: "rev-13",
    product_id: "demo-8",
    author_name: "David L.",
    rating: 5,
    title: "Dress pants done right",
    content: "The drape on these is fantastic. Italian wool that actually feels like Italian wool. Tailored perfectly.",
    created_at: "2026-04-05T11:00:00Z",
    status: "approved",
  },
  // Canvas Tote Bag
  {
    id: "rev-14",
    product_id: "demo-14",
    author_name: "Lisa M.",
    rating: 5,
    title: "My everyday carry",
    content: "Fits my laptop, water bottle, and lunch with room to spare. The leather handles are a nice touch.",
    created_at: "2026-03-28T16:00:00Z",
    status: "approved",
  },
  // Track Jacket
  {
    id: "rev-15",
    product_id: "demo-12",
    author_name: "Mike R.",
    rating: 4,
    title: "Cool retro vibe",
    content: "The contrast piping gives it a nice 70s feel. Runs slightly slim — size up if you plan to layer underneath.",
    created_at: "2026-03-30T10:00:00Z",
    status: "approved",
  },
  // Piqué Polo
  {
    id: "rev-16",
    product_id: "demo-3",
    author_name: "Jordan F.",
    rating: 5,
    title: "Elevated polo",
    content: "This doesn't look like every other polo out there. The wash gives it character and the fit is ideal.",
    created_at: "2026-04-02T13:30:00Z",
    status: "approved",
  },
];
