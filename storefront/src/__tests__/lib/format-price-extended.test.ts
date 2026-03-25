import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format-price";

describe("formatPrice extended", () => {
  it("formats GBP correctly", () => {
    const result = formatPrice(2500, "gbp");
    // Intl formats GBP with pound sign
    expect(result).toContain("25.00");
    expect(result).toContain("£");
  });

  it("formats JPY (no decimals in display, but minimumFractionDigits: 2 is set)", () => {
    // JPY is a zero-decimal currency, but formatPrice divides by 100
    // and forces 2 decimal places via minimumFractionDigits: 2.
    // So 10000 yen-cents => ¥100.00
    const result = formatPrice(10000, "jpy");
    expect(result).toContain("¥");
    expect(result).toContain("100.00");
  });

  it("handles negative amounts", () => {
    const result = formatPrice(-1999, "usd");
    // Should contain a minus sign and the formatted amount
    expect(result).toContain("19.99");
    expect(result).toMatch(/-/);
  });

  it("handles very large numbers (millions)", () => {
    // 100,000,000 cents = $1,000,000.00
    const result = formatPrice(100000000, "usd");
    expect(result).toBe("$1,000,000.00");
  });

  it("handles even larger numbers (10 million)", () => {
    // 1,000,000,000 cents = $10,000,000.00
    const result = formatPrice(1000000000, "usd");
    expect(result).toBe("$10,000,000.00");
  });

  it("currency code is case insensitive - lowercase", () => {
    const result = formatPrice(2999, "usd");
    expect(result).toBe("$29.99");
  });

  it("currency code is case insensitive - uppercase", () => {
    const result = formatPrice(2999, "USD");
    expect(result).toBe("$29.99");
  });

  it("currency code is case insensitive - mixed case", () => {
    const result = formatPrice(2999, "Usd");
    expect(result).toBe("$29.99");
  });

  it("formats EUR with euro sign", () => {
    const result = formatPrice(5000, "eur");
    expect(result).toContain("50.00");
    expect(result).toContain("€");
  });

  it("formats CAD correctly", () => {
    const result = formatPrice(7500, "cad");
    expect(result).toContain("75.00");
    expect(result).toContain("CA$");
  });

  it("handles small amounts (1 cent)", () => {
    const result = formatPrice(1, "usd");
    expect(result).toBe("$0.01");
  });
});
