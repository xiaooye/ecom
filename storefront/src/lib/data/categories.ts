import { getProductCategories, getCategoryByHandle } from "@/lib/medusa/products";
import { demoCategories, type DemoCategory } from "@/lib/demo-categories";

/**
 * Category data wrapper — Medusa SDK first, demo fallback.
 */

export async function listCategories(): Promise<DemoCategory[]> {
  try {
    const response = await getProductCategories();
    const cats = response.product_categories ?? [];
    return cats.map((c) => ({
      id: c.id,
      name: c.name ?? "",
      handle: c.handle ?? "",
      description: (c as unknown as Record<string, unknown>).description as string || "",
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
    const category = await getCategoryByHandle(handle);
    if (category) {
      return {
        id: category.id as string,
        name: category.name as string,
        handle: category.handle as string,
        description: (category.description as string) || "",
        product_count: 0,
      };
    }
  } catch {
    // Medusa unavailable
  }

  return demoCategories.find((c) => c.handle === handle) ?? null;
}
