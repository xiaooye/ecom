import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format-price";

describe("formatPrice", () => {
  it("formats USD correctly (cents to dollars)", () => {
    expect(formatPrice(1999, "usd")).toBe("$19.99");
  });

  it("formats EUR correctly", () => {
    const result = formatPrice(2500, "eur");
    // Intl may format EUR as "€25.00" or "EUR 25.00" depending on locale
    expect(result).toContain("25.00");
  });

  it("handles zero amount", () => {
    expect(formatPrice(0, "usd")).toBe("$0.00");
  });

  it("handles null amount (returns empty string)", () => {
    expect(formatPrice(null, "usd")).toBe("");
  });

  it("handles undefined amount (returns empty string)", () => {
    expect(formatPrice(undefined, "usd")).toBe("");
  });

  it("handles large amounts", () => {
    const result = formatPrice(1000000, "usd");
    // $10,000.00
    expect(result).toBe("$10,000.00");
  });

  it("formats with correct decimal places", () => {
    const result = formatPrice(999, "usd");
    expect(result).toBe("$9.99");
  });

  it("defaults currency to USD when not specified", () => {
    expect(formatPrice(500)).toBe("$5.00");
  });
});
