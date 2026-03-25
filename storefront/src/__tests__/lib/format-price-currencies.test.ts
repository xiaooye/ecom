import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format-price";

describe("formatPrice with multiple currencies", () => {
  describe("all major currencies", () => {
    it("formats USD with dollar sign", () => {
      expect(formatPrice(4999, "usd")).toBe("$49.99");
    });

    it("formats EUR with euro sign", () => {
      const result = formatPrice(4999, "eur");
      expect(result).toContain("€");
      expect(result).toContain("49.99");
    });

    it("formats GBP with pound sign", () => {
      const result = formatPrice(4999, "gbp");
      expect(result).toContain("£");
      expect(result).toContain("49.99");
    });

    it("formats JPY with yen sign", () => {
      const result = formatPrice(4999, "jpy");
      expect(result).toContain("¥");
      expect(result).toContain("49.99");
    });

    it("formats CAD with CA$ prefix", () => {
      const result = formatPrice(4999, "cad");
      expect(result).toContain("CA$");
      expect(result).toContain("49.99");
    });

    it("formats AUD with A$ prefix", () => {
      const result = formatPrice(4999, "aud");
      expect(result).toContain("A$");
      expect(result).toContain("49.99");
    });

    it("formats CHF with CHF prefix", () => {
      const result = formatPrice(4999, "chf");
      expect(result).toContain("CHF");
      expect(result).toContain("49.99");
    });

    it("formats CNY with CN¥ prefix", () => {
      const result = formatPrice(4999, "cny");
      expect(result).toContain("CN¥");
      expect(result).toContain("49.99");
    });
  });

  describe("zero amounts for each currency", () => {
    const currencies = ["usd", "eur", "gbp", "jpy", "cad", "aud", "chf", "cny"];

    currencies.forEach((currency) => {
      it(`formats zero for ${currency.toUpperCase()}`, () => {
        const result = formatPrice(0, currency);
        expect(result).toContain("0.00");
      });
    });
  });

  describe("amounts with different decimal places", () => {
    it("formats whole dollar amount (no cents)", () => {
      expect(formatPrice(10000, "usd")).toBe("$100.00");
    });

    it("formats amount with one significant decimal digit", () => {
      expect(formatPrice(1050, "usd")).toBe("$10.50");
    });

    it("formats amount with two significant decimal digits", () => {
      expect(formatPrice(1099, "usd")).toBe("$10.99");
    });

    it("formats odd cent amount", () => {
      expect(formatPrice(1, "usd")).toBe("$0.01");
    });

    it("formats half dollar", () => {
      expect(formatPrice(50, "usd")).toBe("$0.50");
    });
  });

  describe("very small amounts (1 cent equivalent)", () => {
    it("1 cent in USD", () => {
      expect(formatPrice(1, "usd")).toBe("$0.01");
    });

    it("1 cent in EUR", () => {
      const result = formatPrice(1, "eur");
      expect(result).toContain("€");
      expect(result).toContain("0.01");
    });

    it("1 cent in GBP", () => {
      const result = formatPrice(1, "gbp");
      expect(result).toContain("£");
      expect(result).toContain("0.01");
    });

    it("1 cent in JPY", () => {
      const result = formatPrice(1, "jpy");
      expect(result).toContain("¥");
      expect(result).toContain("0.01");
    });

    it("1 cent in CAD", () => {
      const result = formatPrice(1, "cad");
      expect(result).toContain("0.01");
    });
  });

  describe("amounts over 1 million", () => {
    it("formats $1,000,000.00 in USD", () => {
      // 100,000,000 cents = $1,000,000.00
      expect(formatPrice(100000000, "usd")).toBe("$1,000,000.00");
    });

    it("formats over 1 million in EUR", () => {
      const result = formatPrice(100000000, "eur");
      expect(result).toContain("€");
      expect(result).toContain("1,000,000.00");
    });

    it("formats over 1 million in GBP", () => {
      const result = formatPrice(100000000, "gbp");
      expect(result).toContain("£");
      expect(result).toContain("1,000,000.00");
    });

    it("formats $5,000,000.00 in USD", () => {
      expect(formatPrice(500000000, "usd")).toBe("$5,000,000.00");
    });

    it("formats exactly 1 million in JPY", () => {
      const result = formatPrice(100000000, "jpy");
      expect(result).toContain("¥");
      expect(result).toContain("1,000,000.00");
    });

    it("formats $99,999,999.99 in USD", () => {
      expect(formatPrice(9999999999, "usd")).toBe("$99,999,999.99");
    });
  });
});
