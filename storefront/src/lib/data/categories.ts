import { getProductCategories, getCategoryByHandle } from "@/lib/medusa/products";
import { demoCategories, type DemoCategory } from "@/lib/demo-categories";

/**
 * Category data wrapper — Medusa SDK first, demo fallback.
 */

interface CategoryLike {
  id: string;
  name?: string;
  handle?: string;
  description?: string;
}

export async function listCategories(): Promise<DemoCategory[]> {
  try {
    const response = await getProductCategories();
    const cats = (response.product_categories ?? []) as unknown as CategoryLike[];
    return cats.map((c) => ({
      id: c.id,
      name: c.name ?? "",
      handle: c.handle ?? "",
      description: c.description ?? "",
      product_count: 0,
    }));
  } catch {
    // Medusa unavailable
  }

  return demoCategories;
}

export async function getCategory(
  handle: string,
): Promise<DemoCategory | null> {
  try {
    const category = await getCategoryByHandle(handle) as unknown as CategoryLike | null;
    if (category) {
      return {
        id: category.id,
        name: category.name ?? "",
        handle: category.handle ?? "",
        description: category.description ?? "",
        product_count: 0,
      };
    }
  } catch {
    // Medusa unavailable
  }

  return demoCategories.find((c) => c.handle === handle) ?? null;
}
