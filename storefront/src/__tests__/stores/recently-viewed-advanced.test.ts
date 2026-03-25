import { describe, it, expect, beforeEach } from "vitest";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

function makeProduct(id: string, thumbnail?: string | null) {
  return {
    id,
    title: `Product ${id}`,
    handle: `product-${id}`,
    thumbnail: thumbnail !== undefined ? thumbnail : `/img/${id}.jpg`,
  };
}

describe("recently-viewed-store advanced", () => {
  beforeEach(() => {
    useRecentlyViewedStore.setState({ products: [] });
  });

  describe("adding 15 items keeps only 10 (max)", () => {
    it("stores exactly 10 items after adding 15", () => {
      for (let i = 1; i <= 15; i++) {
        useRecentlyViewedStore.getState().addProduct(makeProduct(String(i)));
      }
      expect(useRecentlyViewedStore.getState().products).toHaveLength(10);
    });

    it("keeps the 10 most recently added items", () => {
      for (let i = 1; i <= 15; i++) {
        useRecentlyViewedStore.getState().addProduct(makeProduct(String(i)));
      }
      const { products } = useRecentlyViewedStore.getState();
      // Most recent first: 15, 14, 13, ..., 6
      expect(products[0].id).toBe("15");
      expect(products[9].id).toBe("6");
    });

    it("the oldest 5 items are dropped", () => {
      for (let i = 1; i <= 15; i++) {
        useRecentlyViewedStore.getState().addProduct(makeProduct(String(i)));
      }
      const ids = useRecentlyViewedStore.getState().products.map((p) => p.id);
      // Items 1-5 should not be in the list
      expect(ids).not.toContain("1");
      expect(ids).not.toContain("2");
      expect(ids).not.toContain("3");
      expect(ids).not.toContain("4");
      expect(ids).not.toContain("5");
    });
  });

  describe("same product re-added moves to front", () => {
    it("re-adding product moves it to index 0", () => {
      useRecentlyViewedStore.getState().addProduct(makeProduct("1"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("2"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("3"));

      // Re-add product 1
      useRecentlyViewedStore.getState().addProduct(makeProduct("1"));

      const { products } = useRecentlyViewedStore.getState();
      expect(products[0].id).toBe("1");
      expect(products).toHaveLength(3);
    });

    it("re-adding does not create a duplicate", () => {
      useRecentlyViewedStore.getState().addProduct(makeProduct("a"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("b"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("a"));

      const ids = useRecentlyViewedStore.getState().products.map((p) => p.id);
      expect(ids.filter((id) => id === "a")).toHaveLength(1);
    });

    it("re-adding last item moves it to front, others shift", () => {
      useRecentlyViewedStore.getState().addProduct(makeProduct("1"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("2"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("3"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("4"));

      // Re-add product 1 (was at position 3, the last)
      useRecentlyViewedStore.getState().addProduct(makeProduct("1"));

      const ids = useRecentlyViewedStore.getState().products.map((p) => p.id);
      expect(ids).toEqual(["1", "4", "3", "2"]);
    });
  });

  describe("products maintain complete data (id, title, handle, thumbnail)", () => {
    it("all fields are preserved after adding", () => {
      const product = {
        id: "prod_123",
        title: "Luxury Cotton Shirt",
        handle: "luxury-cotton-shirt",
        thumbnail: "https://example.com/shirt.jpg",
      };
      useRecentlyViewedStore.getState().addProduct(product);

      const stored = useRecentlyViewedStore.getState().products[0];
      expect(stored.id).toBe("prod_123");
      expect(stored.title).toBe("Luxury Cotton Shirt");
      expect(stored.handle).toBe("luxury-cotton-shirt");
      expect(stored.thumbnail).toBe("https://example.com/shirt.jpg");
    });

    it("multiple products each maintain their data", () => {
      const products = [
        { id: "p1", title: "T-Shirt", handle: "t-shirt", thumbnail: "/img/ts.jpg" },
        { id: "p2", title: "Jeans", handle: "jeans", thumbnail: "/img/jeans.jpg" },
        { id: "p3", title: "Sneakers", handle: "sneakers", thumbnail: "/img/snk.jpg" },
      ];

      products.forEach((p) => {
        useRecentlyViewedStore.getState().addProduct(p);
      });

      const stored = useRecentlyViewedStore.getState().products;
      // Products are stored most recent first
      expect(stored[0].title).toBe("Sneakers");
      expect(stored[0].handle).toBe("sneakers");
      expect(stored[1].title).toBe("Jeans");
      expect(stored[2].title).toBe("T-Shirt");
    });

    it("data is preserved after re-add (moved to front)", () => {
      const original = {
        id: "data-check",
        title: "Original Title",
        handle: "original-handle",
        thumbnail: "/original.jpg",
      };
      useRecentlyViewedStore.getState().addProduct(original);
      useRecentlyViewedStore.getState().addProduct(makeProduct("other"));

      // Re-add with updated data
      const updated = {
        id: "data-check",
        title: "Updated Title",
        handle: "updated-handle",
        thumbnail: "/updated.jpg",
      };
      useRecentlyViewedStore.getState().addProduct(updated);

      const stored = useRecentlyViewedStore.getState().products[0];
      expect(stored.title).toBe("Updated Title");
      expect(stored.handle).toBe("updated-handle");
      expect(stored.thumbnail).toBe("/updated.jpg");
    });
  });

  describe("empty thumbnail is stored as null", () => {
    it("null thumbnail is preserved", () => {
      useRecentlyViewedStore.getState().addProduct(makeProduct("null-thumb", null));
      const stored = useRecentlyViewedStore.getState().products[0];
      expect(stored.thumbnail).toBeNull();
    });

    it("product with null thumbnail coexists with ones that have thumbnails", () => {
      useRecentlyViewedStore.getState().addProduct(makeProduct("with-thumb"));
      useRecentlyViewedStore.getState().addProduct(makeProduct("no-thumb", null));

      const { products } = useRecentlyViewedStore.getState();
      expect(products).toHaveLength(2);
      expect(products[0].thumbnail).toBeNull();
      expect(products[1].thumbnail).toBe("/img/with-thumb.jpg");
    });
  });
});
