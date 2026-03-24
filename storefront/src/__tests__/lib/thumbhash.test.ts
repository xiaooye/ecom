import { describe, it, expect } from "vitest";
import { getPlaceholderBlur, PLACEHOLDER_HASHES } from "@/lib/thumbhash";

describe("thumbhash", () => {
  describe("getPlaceholderBlur", () => {
    it("returns a data URL string", () => {
      const result = getPlaceholderBlur("light");
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.startsWith("data:")).toBe(true);
    });

    it("returns fallback on invalid hash", () => {
      // Pass an invalid key to trigger the catch block
      const result = getPlaceholderBlur("nonexistent" as keyof typeof PLACEHOLDER_HASHES);
      expect(result).toBeDefined();
      expect(result.startsWith("data:image/png;base64,")).toBe(true);
    });
  });

  describe("preset keys", () => {
    it("light preset returns a valid data URL", () => {
      const result = getPlaceholderBlur("light");
      expect(result.startsWith("data:")).toBe(true);
    });

    it("dark preset returns a valid data URL", () => {
      const result = getPlaceholderBlur("dark");
      expect(result.startsWith("data:")).toBe(true);
    });

    it("warm preset returns a valid data URL", () => {
      const result = getPlaceholderBlur("warm");
      expect(result.startsWith("data:")).toBe(true);
    });
  });

  describe("PLACEHOLDER_HASHES", () => {
    it("has light, dark, and warm keys", () => {
      expect(PLACEHOLDER_HASHES).toHaveProperty("light");
      expect(PLACEHOLDER_HASHES).toHaveProperty("dark");
      expect(PLACEHOLDER_HASHES).toHaveProperty("warm");
    });

    it("all hashes are non-empty strings", () => {
      for (const key of Object.keys(PLACEHOLDER_HASHES)) {
        expect(typeof PLACEHOLDER_HASHES[key]).toBe("string");
        expect(PLACEHOLDER_HASHES[key].length).toBeGreaterThan(0);
      }
    });
  });
});
