export interface DemoCategory {
  id: string;
  name: string;
  handle: string;
  description: string;
  product_count: number;
}

export const demoCategories: DemoCategory[] = [
  {
    id: "cat-shirts",
    name: "Shirts",
    handle: "shirts",
    description: "Tees, polos, linens, and button-downs built from premium fabrics.",
    product_count: 4,
  },
  {
    id: "cat-pants",
    name: "Pants",
    handle: "pants",
    description: "Chinos, denim, trousers, and shorts — every fit and occasion covered.",
    product_count: 4,
  },
  {
    id: "cat-sweatshirts",
    name: "Sweatshirts",
    handle: "sweatshirts",
    description: "Hoodies, crewnecks, and layers in heavyweight French terry.",
    product_count: 4,
  },
  {
    id: "cat-merch",
    name: "Merch",
    handle: "merch",
    description: "Outerwear, bags, and accessories to round out the wardrobe.",
    product_count: 4,
  },
];
