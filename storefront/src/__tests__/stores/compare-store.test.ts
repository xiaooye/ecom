import { describe, it, expect, beforeEach } from "vitest";
import { useCompareStore } from "@/stores/compare-store";
import type { Product } from "@/lib/types";

function makeProduct(id: string): Product {
  return {
    id,
    title: `Product ${id}`,
    handle: `product-${id}`,
    thumbnail: `/img/${id}.jpg`,
  };
}

describe("compare-store", () => {
  beforeEach(() => {
    useCompareStore.setState({ products: [] });
  });

  it("initial state has empty products", () => {
    expect(useCompareStore.getState().products).toEqual([]);
  });

  it("addProduct adds to list", () => {
    const result = useCompareStore.getState().addProduct(makeProduct("1"));
    expect(result).toBe(true);
    expect(useCompareStore.getState().products).toHaveLength(1);
    expect(useCompareStore.getState().products[0].id).toBe("1");
  });

  it("addProduct returns false when at max (3)", () => {
    const store = useCompareStore.getState();
    store.addProduct(makeProduct("1"));
    store.addProduct(makeProduct("2"));
    store.addProduct(makeProduct("3"));
    const result = useCompareStore.getState().addProduct(makeProduct("4"));
    expect(result).toBe(false);
    expect(useCompareStore.getState().products).toHaveLength(3);
  });

  it("addProduct prevents duplicates", () => {
    const store = useCompareStore.getState();
    store.addProduct(makeProduct("1"));
    const result = useCompareStore.getState().addProduct(makeProduct("1"));
    expect(result).toBe(false);
    expect(useCompareStore.getState().products).toHaveLength(1);
  });

  it("removeProduct removes by id", () => {
    const store = useCompareStore.getState();
    store.addProduct(makeProduct("1"));
    store.addProduct(makeProduct("2"));
    useCompareStore.getState().removeProduct("1");
    const { products } = useCompareStore.getState();
    expect(products).toHaveLength(1);
    expect(products[0].id).toBe("2");
  });

  it("clearAll empties the list", () => {
    const store = useCompareStore.getState();
    store.addProduct(makeProduct("1"));
    store.addProduct(makeProduct("2"));
    useCompareStore.getState().clearAll();
    expect(useCompareStore.getState().products).toEqual([]);
  });

  it("isInCompare returns true for added product", () => {
    useCompareStore.getState().addProduct(makeProduct("1"));
    expect(useCompareStore.getState().isInCompare("1")).toBe(true);
  });

  it("isInCompare returns false for non-added product", () => {
    expect(useCompareStore.getState().isInCompare("999")).toBe(false);
  });
});
