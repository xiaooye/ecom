import type { Product } from "./types";

// Category mapping for demo product filtering
export const demoCategoryMap: Record<string, string[]> = {
  shirts: ["demo-1", "demo-2", "demo-3", "demo-4"],
  pants: ["demo-5", "demo-6", "demo-7", "demo-8"],
  sweatshirts: ["demo-9", "demo-10", "demo-11", "demo-12"],
  merch: ["demo-13", "demo-14", "demo-15", "demo-16"],
};

// Helper: date N days ago as ISO string
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

function makeVariants(
  prefix: string,
  basePrice: number,
  sizes: string[],
  colors: string[],
  stockOverrides?: Record<string, number>,
) {
  const variants: Product["variants"] = [];
  let i = 1;
  for (const color of colors) {
    for (const size of sizes) {
      const key = `${size}-${color}`;
      variants.push({
        id: `${prefix}-${i}`,
        title: `${size} / ${color}`,
        sku: `${prefix.toUpperCase()}-${size}-${color.slice(0, 3).toUpperCase()}`,
        options: { Size: size, Color: color },
        inventory_quantity: stockOverrides?.[key] ?? Math.floor(Math.random() * 25) + 5,
        calculated_price: { calculated_amount: basePrice, currency_code: "usd" },
      });
      i++;
    }
  }
  return variants;
}

function makeOptions(sizes: string[], colors: string[]) {
  return [
    { id: "opt-size", title: "Size", values: sizes.map((v) => ({ value: v })) },
    { id: "opt-color", title: "Color", values: colors.map((v) => ({ value: v })) },
  ];
}

export const demoProducts: Product[] = [
  // ── SHIRTS ──────────────────────────────────────────────
  {
    id: "demo-1",
    title: "Classic Cotton Tee",
    handle: "classic-cotton-tee",
    description:
      "Essential crew-neck t-shirt in premium organic cotton. Garment-dyed for a lived-in softness from day one. Relaxed through the body with a slightly longer hem.",
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    created_at: daysAgo(5),
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Black", "White"]),
    variants: makeVariants("v1", 3500, ["S", "M", "L", "XL"], ["Black", "White"]),
  },
  {
    id: "demo-2",
    title: "Linen Resort Shirt",
    handle: "linen-resort-shirt",
    description:
      "Relaxed-fit linen shirt with a camp collar and coconut shell buttons. Perfect for warm-weather layering or worn open over a tee.",
    thumbnail:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    created_at: daysAgo(30),
    images: [
      { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["White", "Sand"]),
    variants: makeVariants("v2", 6800, ["S", "M", "L", "XL"], ["White", "Sand"]),
  },
  {
    id: "demo-3",
    title: "Piqué Polo",
    handle: "pique-polo",
    description:
      "Piqué-knit polo with ribbed collar and two-button placket. Washed for softness. A refined update to the weekend staple.",
    thumbnail:
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=800&fit=crop",
    created_at: daysAgo(10),
    images: [
      { url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1625910513413-5fc39dc44ba7?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Navy", "White"]),
    variants: makeVariants("v3", 5500, ["S", "M", "L", "XL"], ["Navy", "White"]),
  },
  {
    id: "demo-4",
    title: "Oxford Button-Down",
    handle: "oxford-button-down",
    description:
      "Washed oxford cloth with a soft button-down collar. A year-round essential that layers under knitwear in winter and rolls up in summer.",
    thumbnail:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
    created_at: daysAgo(45),
    images: [
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Blue", "White"]),
    variants: makeVariants("v4", 7900, ["S", "M", "L", "XL"], ["Blue", "White"]),
  },

  // ── PANTS ───────────────────────────────────────────────
  {
    id: "demo-5",
    title: "Slim Stretch Chinos",
    handle: "slim-stretch-chinos",
    description:
      "Tailored slim-fit chinos in brushed stretch cotton with a hint of elastane. Garment-washed for a broken-in feel without the break-in period.",
    thumbnail:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    created_at: daysAgo(20),
    images: [
      { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["30", "32", "34", "36"], ["Olive", "Khaki"]),
    variants: makeVariants("v5", 7900, ["30", "32", "34", "36"], ["Olive", "Khaki"]),
  },
  {
    id: "demo-6",
    title: "Relaxed Selvedge Denim",
    handle: "relaxed-selvedge-denim",
    description:
      "Japanese selvedge denim in a relaxed straight cut. 13.5oz raw indigo that will age beautifully with wear. Chain-stitched hem.",
    thumbnail:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
    created_at: daysAgo(3),
    images: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["30", "32", "34", "36"], ["Indigo", "Black"]),
    variants: makeVariants("v6", 12900, ["30", "32", "34", "36"], ["Indigo", "Black"]),
  },
  {
    id: "demo-7",
    title: "Drawstring Shorts",
    handle: "drawstring-shorts",
    description:
      "Lightweight twill shorts with an elastic drawstring waist and 7-inch inseam. Side pockets and a single back welt pocket.",
    thumbnail:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop",
    created_at: daysAgo(60),
    images: [
      { url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Khaki", "Navy"]),
    variants: makeVariants("v7", 4500, ["S", "M", "L", "XL"], ["Khaki", "Navy"]),
  },
  {
    id: "demo-8",
    title: "Pleated Wool Trousers",
    handle: "pleated-wool-trousers",
    description:
      "Single-pleat trousers in Italian tropical wool. Half-lined with a medium rise and tapered leg. Dress them up or down.",
    thumbnail:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    created_at: daysAgo(8),
    images: [
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["30", "32", "34", "36"], ["Charcoal", "Navy"]),
    variants: makeVariants("v8", 14900, ["30", "32", "34", "36"], ["Charcoal", "Navy"], {
      "30-Charcoal": 2, "36-Navy": 0, // low stock & out of stock
    }),
  },

  // ── SWEATSHIRTS ─────────────────────────────────────────
  {
    id: "demo-9",
    title: "Heavyweight Crewneck",
    handle: "heavyweight-crewneck",
    description:
      "450 GSM French terry crewneck with flatlock seams. Enzyme-washed for a vintage hand feel. Ribbed cuffs and hem.",
    thumbnail:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
    created_at: daysAgo(25),
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1578768079470-0a4a5fdbf847?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Charcoal", "Oatmeal"]),
    variants: makeVariants("v9", 8500, ["S", "M", "L", "XL"], ["Charcoal", "Oatmeal"]),
  },
  {
    id: "demo-10",
    title: "Full-Zip Hoodie",
    handle: "full-zip-hoodie",
    description:
      "Midweight cotton-blend hoodie with YKK zipper and kangaroo pockets. Lined hood with flat drawcord. An everyday layer.",
    thumbnail:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop",
    created_at: daysAgo(2),
    images: [
      { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1578768079470-0a4a5fdbf847?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Navy", "Black"]),
    variants: makeVariants("v10", 9500, ["S", "M", "L", "XL"], ["Navy", "Black"]),
  },
  {
    id: "demo-11",
    title: "Oversized Pullover",
    handle: "oversized-pullover",
    description:
      "Dropped shoulder pullover in loopback terry. Boxy fit through the body with a raw-edge hem. Wears well oversized.",
    thumbnail:
      "https://images.unsplash.com/photo-1578768079470-0a4a5fdbf847?w=600&h=800&fit=crop",
    created_at: daysAgo(40),
    images: [
      { url: "https://images.unsplash.com/photo-1578768079470-0a4a5fdbf847?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Sage", "Cream"]),
    variants: makeVariants("v11", 7500, ["S", "M", "L", "XL"], ["Sage", "Cream"]),
  },
  {
    id: "demo-12",
    title: "Track Jacket",
    handle: "track-jacket",
    description:
      "Retro-inspired track jacket with contrast piping and snap placket. Woven poly-cotton with a mesh lining for breathability.",
    thumbnail:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    created_at: daysAgo(12),
    images: [
      { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Black", "Forest"]),
    variants: makeVariants("v12", 9900, ["S", "M", "L", "XL"], ["Black", "Forest"]),
  },

  // ── MERCH / ACCESSORIES ────────────────────────────────
  {
    id: "demo-13",
    title: "Waxed Canvas Jacket",
    handle: "waxed-canvas-jacket",
    description:
      "British Millerain waxed cotton jacket with brass hardware. Corduroy collar and quilted lining. Built to weather anything.",
    thumbnail:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
    created_at: daysAgo(7),
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&h=1000&fit=crop" },
    ],
    options: makeOptions(["S", "M", "L", "XL"], ["Olive", "Tan"]),
    variants: makeVariants("v13", 18900, ["S", "M", "L", "XL"], ["Olive", "Tan"], {
      "S-Tan": 1, "XL-Olive": 0, // limited stock
    }),
  },
  {
    id: "demo-14",
    title: "Canvas Tote Bag",
    handle: "canvas-tote-bag",
    description:
      "Heavy-duty 18oz canvas tote with reinforced leather handles and a brass rivet base. Internal zip pocket.",
    thumbnail:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
    created_at: daysAgo(50),
    images: [
      { url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=1000&fit=crop" },
    ],
    options: [
      { id: "opt-color", title: "Color", values: [{ value: "Natural" }, { value: "Olive" }] },
    ],
    variants: [
      {
        id: "v14-1",
        title: "Natural",
        sku: "TOTE-NAT",
        options: { Color: "Natural" },
        inventory_quantity: 30,
        calculated_price: { calculated_amount: 3900, currency_code: "usd" },
      },
      {
        id: "v14-2",
        title: "Olive",
        sku: "TOTE-OLV",
        options: { Color: "Olive" },
        inventory_quantity: 18,
        calculated_price: { calculated_amount: 3900, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-15",
    title: "Wool Beanie",
    handle: "wool-beanie",
    description:
      "Ribbed-knit merino wool beanie. Soft, warm, and naturally moisture-wicking. Fits snug without being tight.",
    thumbnail:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=800&fit=crop",
    created_at: daysAgo(90),
    images: [
      { url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&h=1000&fit=crop" },
    ],
    options: [
      { id: "opt-color", title: "Color", values: [{ value: "Charcoal" }, { value: "Camel" }, { value: "Burgundy" }] },
    ],
    variants: [
      {
        id: "v15-1",
        title: "Charcoal",
        sku: "BEANIE-CHA",
        options: { Color: "Charcoal" },
        inventory_quantity: 40,
        calculated_price: { calculated_amount: 2900, currency_code: "usd" },
      },
      {
        id: "v15-2",
        title: "Camel",
        sku: "BEANIE-CAM",
        options: { Color: "Camel" },
        inventory_quantity: 35,
        calculated_price: { calculated_amount: 2900, currency_code: "usd" },
      },
      {
        id: "v15-3",
        title: "Burgundy",
        sku: "BEANIE-BUR",
        options: { Color: "Burgundy" },
        inventory_quantity: 0,
        calculated_price: { calculated_amount: 2900, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-16",
    title: "Leather Belt",
    handle: "leather-belt",
    description:
      "Full-grain vegetable-tanned leather belt with a solid brass buckle. Will develop a rich patina with age.",
    thumbnail:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
    created_at: daysAgo(35),
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&h=1000&fit=crop" },
      { url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=1000&fit=crop" },
    ],
    options: [
      { id: "opt-size", title: "Size", values: [{ value: "32" }, { value: "34" }, { value: "36" }, { value: "38" }] },
      { id: "opt-color", title: "Color", values: [{ value: "Tan" }, { value: "Dark Brown" }] },
    ],
    variants: makeVariants("v16", 5900, ["32", "34", "36", "38"], ["Tan", "Dark Brown"]),
  },
];
