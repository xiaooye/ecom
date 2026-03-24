import { describe, it, expect } from "vitest";
import { productSearchParams } from "@/lib/search-params";

describe("productSearchParams", () => {
  it("has a q parameter", () => {
    expect(productSearchParams.q).toBeDefined();
  });

  it("q defaults to empty string", () => {
    // nuqs parsers have a defaultValue property when withDefault is used
    expect(productSearchParams.q.defaultValue).toBe("");
  });

  it('order defaults to "created_at"', () => {
    expect(productSearchParams.order.defaultValue).toBe("created_at");
  });

  it("offset defaults to 0", () => {
    expect(productSearchParams.offset.defaultValue).toBe(0);
  });

  it("min_price defaults to empty string", () => {
    expect(productSearchParams.min_price.defaultValue).toBe("");
  });

  it("max_price defaults to empty string", () => {
    expect(productSearchParams.max_price.defaultValue).toBe("");
  });

  it("category_id defaults to empty string", () => {
    expect(productSearchParams.category_id.defaultValue).toBe("");
  });

  it("has all expected parameter keys", () => {
    const keys = Object.keys(productSearchParams);
    expect(keys).toContain("q");
    expect(keys).toContain("order");
    expect(keys).toContain("offset");
    expect(keys).toContain("min_price");
    expect(keys).toContain("max_price");
    expect(keys).toContain("category_id");
  });
});
