import { getProductCategories, getCategoryByHandle } from "@/lib/medusa/products";
import { demoCategories, type DemoCategory } from "@/lib/demo-categories";

/**
 * Category data wrapper — Medusa SDK first, demo fallback.
 */

export async function listCategories(): Promise<DemoCategory[]> {
  try {
    const response = await getProductCategories();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cats: any[] = response.product_categories ?? [];
    return cats.map((c: { id: string; name?: string; handle?: string; description?: string }) => ({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const category: any = await getCategoryByHandle(handle);
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
