import { describe, it, expect } from "vitest";
import {
  MEDUSA_BACKEND_URL,
  ITEMS_PER_PAGE,
  DEFAULT_REGION,
  STORE_NAME,
} from "@/lib/constants";

describe("constants validation", () => {
  describe("MEDUSA_BACKEND_URL is a valid URL string", () => {
    it("is a string", () => {
      expect(typeof MEDUSA_BACKEND_URL).toBe("string");
    });

    it("starts with http:// or https://", () => {
      expect(MEDUSA_BACKEND_URL).toMatch(/^https?:\/\//);
    });

    it("can be parsed as a valid URL", () => {
      expect(() => new URL(MEDUSA_BACKEND_URL)).not.toThrow();
    });

    it("has a valid hostname", () => {
      const url = new URL(MEDUSA_BACKEND_URL);
      expect(url.hostname.length).toBeGreaterThan(0);
    });
  });

  describe("ITEMS_PER_PAGE is a positive integer > 0", () => {
    it("is a number", () => {
      expect(typeof ITEMS_PER_PAGE).toBe("number");
    });

    it("is greater than 0", () => {
      expect(ITEMS_PER_PAGE).toBeGreaterThan(0);
    });

    it("is an integer", () => {
      expect(Number.isInteger(ITEMS_PER_PAGE)).toBe(true);
    });

    it("is a finite number", () => {
      expect(Number.isFinite(ITEMS_PER_PAGE)).toBe(true);
    });
  });

  describe("DEFAULT_REGION is a 2-letter lowercase string", () => {
    it("is a string", () => {
      expect(typeof DEFAULT_REGION).toBe("string");
    });

    it("has exactly 2 characters", () => {
      expect(DEFAULT_REGION).toHaveLength(2);
    });

    it("is all lowercase", () => {
      expect(DEFAULT_REGION).toBe(DEFAULT_REGION.toLowerCase());
    });

    it("contains only alphabetic characters", () => {
      expect(DEFAULT_REGION).toMatch(/^[a-z]{2}$/);
    });
  });

  describe("STORE_NAME is a non-empty string", () => {
    it("is a string", () => {
      expect(typeof STORE_NAME).toBe("string");
    });

    it("is non-empty", () => {
      expect(STORE_NAME.length).toBeGreaterThan(0);
    });

    it("does not consist of only whitespace", () => {
      expect(STORE_NAME.trim().length).toBeGreaterThan(0);
    });
  });

  describe("all exports are defined (not undefined)", () => {
    it("MEDUSA_BACKEND_URL is defined", () => {
      expect(MEDUSA_BACKEND_URL).toBeDefined();
    });

    it("ITEMS_PER_PAGE is defined", () => {
      expect(ITEMS_PER_PAGE).toBeDefined();
    });

    it("DEFAULT_REGION is defined", () => {
      expect(DEFAULT_REGION).toBeDefined();
    });

    it("STORE_NAME is defined", () => {
      expect(STORE_NAME).toBeDefined();
    });

    it("none of the exports are null", () => {
      expect(MEDUSA_BACKEND_URL).not.toBeNull();
      expect(ITEMS_PER_PAGE).not.toBeNull();
      expect(DEFAULT_REGION).not.toBeNull();
      expect(STORE_NAME).not.toBeNull();
    });
  });
});
