/**
 * Simplified product type used across storefront components.
 * Cast from Medusa SDK's StoreProduct at data-fetching boundaries.
 */
export interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  created_at?: string | Date | null;
  images?: Array<{ url: string }> | null;
  options?: Array<{
    id: string;
    title: string;
    values: Array<{ value: string }>;
  }> | null;
  variants?: Array<{
    id: string;
    title: string;
    sku?: string | null;
    options?: Record<string, string> | null;
    inventory_quantity?: number;
    calculated_price?: {
      calculated_amount?: number;
      currency_code?: string;
    } | null;
  }> | null;
}
