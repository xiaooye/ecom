import { sdk } from "@/lib/sdk";

export async function getProductsList(params: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  order?: string;
  q?: string;
}) {
  const { limit = 12, offset = 0, ...rest } = params;
  return sdk.store.product.list(
    {
      limit,
      offset,
      fields:
        "+variants.calculated_price,+variants.inventory_quantity",
      ...rest,
    },
    { next: { tags: ["products"] } }
  );
}

export async function getProductByHandle(handle: string) {
  const { products } = await sdk.store.product.list(
    {
      handle,
      fields:
        "+variants.calculated_price,+variants.inventory_quantity",
    },
    { next: { tags: ["products"] } }
  );

  return products[0] || null;
}

export async function getProductCategories() {
  return sdk.store.category.list(
    {
      fields: "+category_children",
    },
    { next: { tags: ["categories"] } }
  );
}

export async function getCategoryByHandle(handle: string) {
  const { product_categories } = await sdk.store.category.list(
    {
      handle,
      fields: "+category_children",
    },
    { next: { tags: ["categories"] } }
  );

  return product_categories[0] || null;
}
