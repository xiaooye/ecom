import { describe, it, expect, beforeEach } from "vitest";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

function makeRecentProduct(id: string) {
  return {
    id,
    title: `Product ${id}`,
    handle: `product-${id}`,
    thumbnail: `/img/${id}.jpg`,
  };
}

describe("recently-viewed-store", () => {
  beforeEach(() => {
    useRecentlyViewedStore.setState({ products: [] });
  });

  it("initial state has empty products", () => {
    expect(useRecentlyViewedStore.getState().products).toEqual([]);
  });

  it("addProduct adds to front of list", () => {
    const { addProduct } = useRecentlyViewedStore.getState();
    addProduct(makeRecentProduct("1"));
    addProduct(makeRecentProduct("2"));
    const { products } = useRecentlyViewedStore.getState();
    expect(products[0].id).toBe("2");
    expect(products[1].id).toBe("1");
  });

  it("addProduct moves existing to front (deduplicates)", () => {
    const store = useRecentlyViewedStore.getState();
    store.addProduct(makeRecentProduct("1"));
    store.addProduct(makeRecentProduct("2"));
    store.addProduct(makeRecentProduct("3"));
    // Re-add product 1, it should move to front
    useRecentlyViewedStore.getState().addProduct(makeRecentProduct("1"));
    const { products } = useRecentlyViewedStore.getState();
    expect(products).toHaveLength(3);
    expect(products[0].id).toBe("1");
    expect(products[1].id).toBe("3");
    expect(products[2].id).toBe("2");
  });

  it("max 10 items maintained", () => {
    for (let i = 1; i <= 12; i++) {
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct(String(i)));
    }
    const { products } = useRecentlyViewedStore.getState();
    expect(products).toHaveLength(10);
    // Most recent should be first
    expect(products[0].id).toBe("12");
    // Oldest within the limit should be last
    expect(products[9].id).toBe("3");
  });
});
