import {
  parseAsString,
  parseAsInteger,
  createSearchParamsCache,
} from "nuqs/server";

/**
 * Type-safe URL search parameter definitions for product listing.
 * Uses nuqs for validated, serialized URL state management.
 */
export const productSearchParams = {
  q: parseAsString.withDefault(""),
  order: parseAsString.withDefault("created_at"),
  offset: parseAsInteger.withDefault(0),
  min_price: parseAsString.withDefault(""),
  max_price: parseAsString.withDefault(""),
  category_id: parseAsString.withDefault(""),
};

export const productSearchParamsCache = createSearchParamsCache(productSearchParams);
