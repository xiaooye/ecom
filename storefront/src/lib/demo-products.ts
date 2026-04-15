import type { Product } from "./types";

/**
 * Static demo products shown when the Medusa backend is unavailable.
 * Uses Unsplash images so the storefront always looks populated.
 */
export const demoProducts: Product[] = [
  {
    id: "demo-1",
    title: "Classic Black Tee",
    handle: "classic-black-tee",
    description: "Essential crew-neck t-shirt in premium cotton.",
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-1",
        title: "M / Black",
        inventory_quantity: 25,
        calculated_price: { calculated_amount: 3500, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-2",
    title: "White Linen Shirt",
    handle: "white-linen-shirt",
    description: "Relaxed-fit linen shirt for warm-weather style.",
    thumbnail:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-2",
        title: "L / White",
        inventory_quantity: 18,
        calculated_price: { calculated_amount: 6800, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-3",
    title: "Slim Chinos",
    handle: "slim-chinos",
    description: "Tailored slim-fit chinos in stretch cotton.",
    thumbnail:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-3",
        title: "32 / Olive",
        inventory_quantity: 12,
        calculated_price: { calculated_amount: 7900, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-4",
    title: "Vintage Crewneck",
    handle: "vintage-crewneck",
    description: "Heavyweight washed crewneck sweatshirt.",
    thumbnail:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-4",
        title: "L / Charcoal",
        inventory_quantity: 8,
        calculated_price: { calculated_amount: 8500, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-5",
    title: "Denim Jacket",
    handle: "denim-jacket",
    description: "Classic trucker jacket in washed indigo denim.",
    thumbnail:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-5",
        title: "M / Indigo",
        inventory_quantity: 6,
        calculated_price: { calculated_amount: 12900, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-6",
    title: "Cargo Shorts",
    handle: "cargo-shorts",
    description: "Relaxed cargo shorts with adjustable waist.",
    thumbnail:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-6",
        title: "L / Khaki",
        inventory_quantity: 20,
        calculated_price: { calculated_amount: 4500, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-7",
    title: "Zip Hoodie",
    handle: "zip-hoodie",
    description: "Full-zip hoodie with kangaroo pockets.",
    thumbnail:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-7",
        title: "XL / Navy",
        inventory_quantity: 15,
        calculated_price: { calculated_amount: 9500, currency_code: "usd" },
      },
    ],
  },
  {
    id: "demo-8",
    title: "Striped Polo",
    handle: "striped-polo",
    description: "Piqué polo with contrast collar detail.",
    thumbnail:
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=800&fit=crop",
    created_at: new Date().toISOString(),
    variants: [
      {
        id: "v-8",
        title: "M / Navy Stripe",
        inventory_quantity: 10,
        calculated_price: { calculated_amount: 5500, currency_code: "usd" },
      },
    ],
  },
];
