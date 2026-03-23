import { rgbaToThumbHash, thumbHashToDataURL } from "thumbhash";

/**
 * Generate a tiny (~28 byte) blur hash from an RGBA pixel buffer.
 * Uses ThumbHash algorithm (WASM-optimized) for high-quality
 * blur placeholders at minimal size.
 */
export function generateThumbHash(
  width: number,
  height: number,
  rgba: Uint8Array
): string {
  const hash = rgbaToThumbHash(width, height, rgba);
  return thumbHashToDataURL(hash);
}

/**
 * Convert a base64-encoded ThumbHash back to a data URL for use
 * as a blur placeholder in Next.js Image blurDataURL.
 */
export function thumbHashToBlurURL(base64Hash: string): string {
  const binary = atob(base64Hash);
  const hash = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    hash[i] = binary.charCodeAt(i);
  }
  return thumbHashToDataURL(hash);
}

/**
 * Pre-computed ThumbHash placeholders for common product image patterns.
 * These tiny hashes (~28 bytes each) decode to blur placeholders instantly.
 */
export const PLACEHOLDER_HASHES: Record<string, string> = {
  // Light gray product background
  light: "k0gKFYB4d3h/iIeHeEh3eIhw+DkA",
  // Dark product background
  dark: "HAgOHYB4V3h4d2eIaHiId3+AeEcA",
  // Warm tone
  warm: "l0gGHIB4Z3h4h3eHeGdoeI+AeEcA",
};

/**
 * Get a blur data URL from a pre-computed hash key.
 */
export function getPlaceholderBlur(
  key: keyof typeof PLACEHOLDER_HASHES = "light"
): string {
  try {
    return thumbHashToBlurURL(PLACEHOLDER_HASHES[key]);
  } catch {
    // Fallback to a simple 1x1 transparent pixel
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F/PQAJhAN6ap86HQAAAABJRU5ErkJggg==";
  }
}
