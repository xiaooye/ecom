import type { MetadataRoute } from "next";
import { getProductsList, getProductCategories } from "@/lib/medusa/products";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webstore.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/size-guide`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/returns-policy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const { products } = await getProductsList({ limit: 1000 });
    productPages = (products ?? []).map((product: { handle: string }) => ({
      url: `${BASE_URL}/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Backend not available
  }

  try {
    const { product_categories } = await getProductCategories();
    categoryPages = (product_categories ?? []).map((cat: { handle: string }) => ({
      url: `${BASE_URL}/categories/${cat.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Backend not available
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
