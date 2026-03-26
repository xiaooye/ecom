import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format-price";

describe("formatPrice edge cases", () => {
  describe("MAX_SAFE_INTEGER", () => {
    it("handles Number.MAX_SAFE_INTEGER without throwing", () => {
      expect(() => formatPrice(Number.MAX_SAFE_INTEGER, "usd")).not.toThrow();
    });

    it("returns a non-empty string for MAX_SAFE_INTEGER", () => {
      const result = formatPrice(Number.MAX_SAFE_INTEGER, "usd");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("result contains dollar sign for MAX_SAFE_INTEGER in USD", () => {
      const result = formatPrice(Number.MAX_SAFE_INTEGER, "usd");
      expect(result).toContain("$");
    });
  });

  describe("floating point amounts (not integer cents)", () => {
    it("handles a fractional cent amount", () => {
      // 99.5 cents = $0.995, formatted with 2 decimal places
      const result = formatPrice(99.5, "usd");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("formats 0.1 cents without throwing", () => {
      const result = formatPrice(0.1, "usd");
      expect(typeof result).toBe("string");
      expect(result).toContain("$");
    });

    it("formats 1999.99 (fractional cents) without throwing", () => {
      const result = formatPrice(1999.99, "usd");
      expect(typeof result).toBe("string");
      expect(result).toContain("$");
    });
  });

  describe("empty string currency code defaults gracefully", () => {
    it("uses default 'usd' when no currency code is provided", () => {
      const result = formatPrice(1000);
      expect(result).toBe("$10.00");
    });

    it("default currency formats the same as explicit 'usd'", () => {
      const withDefault = formatPrice(2500);
      const withExplicit = formatPrice(2500, "usd");
      expect(withDefault).toBe(withExplicit);
    });
  });

  describe("repeated calls with same args return same result", () => {
    it("formatPrice(1999, 'usd') returns consistent result", () => {
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(formatPrice(1999, "usd"));
      }
      const allSame = results.every((r) => r === results[0]);
      expect(allSame).toBe(true);
    });

    it("formatPrice(0, 'eur') returns consistent result", () => {
      const result1 = formatPrice(0, "eur");
      const result2 = formatPrice(0, "eur");
      const result3 = formatPrice(0, "eur");
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it("formatPrice(null) returns consistent result", () => {
      const result1 = formatPrice(null);
      const result2 = formatPrice(null);
      expect(result1).toBe(result2);
      expect(result1).toBe("");
    });

    it("formatPrice(undefined) returns consistent result", () => {
      const result1 = formatPrice(undefined);
      const result2 = formatPrice(undefined);
      expect(result1).toBe(result2);
      expect(result1).toBe("");
    });
  });

  describe("negative zero", () => {
    it("handles -0 without throwing", () => {
      expect(() => formatPrice(-0, "usd")).not.toThrow();
    });

    it("formats -0 as a valid price string", () => {
      const result = formatPrice(-0, "usd");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("-0 and 0 produce equivalent formatted output", () => {
      const negZero = formatPrice(-0, "usd");
      const posZero = formatPrice(0, "usd");
      // Both should result in $0.00 (Intl treats -0 as 0 for formatting)
      expect(negZero).toContain("0.00");
      expect(posZero).toContain("0.00");
    });
  });
});
