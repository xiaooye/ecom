import { getProductsList, getProductByHandle } from "@/lib/medusa/products";
import { demoProducts, demoCategoryMap } from "@/lib/demo-products";
import { demoReviews } from "@/lib/demo-reviews";
import type { Product } from "@/lib/types";
import type { DemoReview } from "@/lib/demo-reviews";

/**
 * Data wrapper that tries Medusa SDK first, then falls back to demo data.
 * This lets the storefront render fully without a running backend.
 */

export async function listProducts(params: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  order?: string;
  q?: string;
}): Promise<{ products: Product[]; count: number }> {
  const { limit = 12, offset = 0, order, q, category_id } = params;

  try {
    const response = await getProductsList(params);
    const products = (response.products ?? []) as Product[];
    return { products, count: response.count ?? 0 };
  } catch {
    // Medusa unavailable — filter and paginate demo data
  }

  let filtered = [...demoProducts];

  // Filter by category (map category handle → product IDs)
  if (category_id?.length) {
    const allowedIds = new Set(
      category_id.flatMap((catId) => {
        // catId could be a Medusa UUID or a demo category handle/id
        for (const [handle, ids] of Object.entries(demoCategoryMap)) {
          if (catId === handle || catId === `cat-${handle}`) return ids;
        }
        return [];
      }),
    );
    if (allowedIds.size > 0) {
      filtered = filtered.filter((p) => allowedIds.has(p.id));
    }
  }

  // Search by query
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query),
    );
  }

  // Sort
  if (order === "price_asc") {
    filtered.sort(
      (a, b) =>
        (a.variants?.[0]?.calculated_price?.calculated_amount ?? 0) -
        (b.variants?.[0]?.calculated_price?.calculated_amount ?? 0),
    );
  } else if (order === "price_desc") {
    filtered.sort(
      (a, b) =>
        (b.variants?.[0]?.calculated_price?.calculated_amount ?? 0) -
        (a.variants?.[0]?.calculated_price?.calculated_amount ?? 0),
    );
  } else if (order === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }
  // Default: created_at desc (newest first)

  const count = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return { products: paginated, count };
}

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const product = await getProductByHandle(handle);
    if (product) return product as Product;
  } catch {
    // Medusa unavailable
  }

  return demoProducts.find((p) => p.handle === handle) ?? null;
}

export function getReviewsForProduct(productId: string): DemoReview[] {
  return demoReviews.filter((r) => r.product_id === productId);
}
