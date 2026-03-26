import { describe, it, expect } from "vitest";
import { getPlaceholderBlur, PLACEHOLDER_HASHES } from "@/lib/thumbhash";

describe("thumbhash advanced", () => {
  describe("getPlaceholderBlur called multiple times returns same result (memoization check)", () => {
    it("returns identical result for 'light' across multiple calls", () => {
      const result1 = getPlaceholderBlur("light");
      const result2 = getPlaceholderBlur("light");
      const result3 = getPlaceholderBlur("light");
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it("returns identical result for 'dark' across multiple calls", () => {
      const result1 = getPlaceholderBlur("dark");
      const result2 = getPlaceholderBlur("dark");
      expect(result1).toBe(result2);
    });

    it("returns identical result for 'warm' across multiple calls", () => {
      const result1 = getPlaceholderBlur("warm");
      const result2 = getPlaceholderBlur("warm");
      expect(result1).toBe(result2);
    });
  });

  describe("all 3 presets return strings starting with 'data:'", () => {
    it("light preset starts with 'data:'", () => {
      expect(getPlaceholderBlur("light").startsWith("data:")).toBe(true);
    });

    it("dark preset starts with 'data:'", () => {
      expect(getPlaceholderBlur("dark").startsWith("data:")).toBe(true);
    });

    it("warm preset starts with 'data:'", () => {
      expect(getPlaceholderBlur("warm").startsWith("data:")).toBe(true);
    });
  });

  describe("fallback URL is a valid data URI", () => {
    it("fallback starts with 'data:image/png;base64,'", () => {
      const result = getPlaceholderBlur(
        "nonexistent" as keyof typeof PLACEHOLDER_HASHES
      );
      expect(result.startsWith("data:image/png;base64,")).toBe(true);
    });

    it("fallback is a non-empty string", () => {
      const result = getPlaceholderBlur(
        "invalid_key" as keyof typeof PLACEHOLDER_HASHES
      );
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("fallback contains valid base64 characters after prefix", () => {
      const result = getPlaceholderBlur(
        "missing" as keyof typeof PLACEHOLDER_HASHES
      );
      const base64Part = result.replace("data:image/png;base64,", "");
      // Base64 characters: A-Z, a-z, 0-9, +, /, =
      expect(base64Part).toMatch(/^[A-Za-z0-9+/=]+$/);
    });
  });

  describe("PLACEHOLDER_HASHES object has exactly 3 keys", () => {
    it("has exactly 3 keys", () => {
      expect(Object.keys(PLACEHOLDER_HASHES)).toHaveLength(3);
    });

    it("keys are light, dark, and warm", () => {
      const keys = Object.keys(PLACEHOLDER_HASHES).sort();
      expect(keys).toEqual(["dark", "light", "warm"]);
    });
  });

  describe("each hash value is a non-empty string", () => {
    it("light hash is a non-empty string", () => {
      expect(typeof PLACEHOLDER_HASHES.light).toBe("string");
      expect(PLACEHOLDER_HASHES.light.length).toBeGreaterThan(0);
    });

    it("dark hash is a non-empty string", () => {
      expect(typeof PLACEHOLDER_HASHES.dark).toBe("string");
      expect(PLACEHOLDER_HASHES.dark.length).toBeGreaterThan(0);
    });

    it("warm hash is a non-empty string", () => {
      expect(typeof PLACEHOLDER_HASHES.warm).toBe("string");
      expect(PLACEHOLDER_HASHES.warm.length).toBeGreaterThan(0);
    });

    it("all hash values are base64-like strings", () => {
      for (const key of Object.keys(PLACEHOLDER_HASHES)) {
        const value = PLACEHOLDER_HASHES[key];
        // Base64 characters: A-Z, a-z, 0-9, +, /, =
        expect(value).toMatch(/^[A-Za-z0-9+/=]+$/);
      }
    });
  });
});
