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

describe("compare-store edge cases", () => {
  beforeEach(() => {
    useCompareStore.setState({ products: [] });
  });

  describe("adding same product twice returns false", () => {
    it("second add of the same product returns false", () => {
      const product = makeProduct("dup-1");
      const first = useCompareStore.getState().addProduct(product);
      const second = useCompareStore.getState().addProduct(product);
      expect(first).toBe(true);
      expect(second).toBe(false);
    });

    it("list length stays at 1 after duplicate add", () => {
      const product = makeProduct("dup-2");
      useCompareStore.getState().addProduct(product);
      useCompareStore.getState().addProduct(product);
      expect(useCompareStore.getState().products).toHaveLength(1);
    });

    it("three attempts to add the same product result in length 1", () => {
      const product = makeProduct("dup-3");
      useCompareStore.getState().addProduct(product);
      useCompareStore.getState().addProduct(product);
      useCompareStore.getState().addProduct(product);
      expect(useCompareStore.getState().products).toHaveLength(1);
      expect(useCompareStore.getState().products[0].id).toBe("dup-3");
    });
  });

  describe("removing non-existent product doesn't throw", () => {
    it("removing from empty store does not throw", () => {
      expect(() => {
        useCompareStore.getState().removeProduct("nonexistent");
      }).not.toThrow();
    });

    it("removing non-existent id from populated store does not throw", () => {
      useCompareStore.getState().addProduct(makeProduct("real"));
      expect(() => {
        useCompareStore.getState().removeProduct("fake");
      }).not.toThrow();
      expect(useCompareStore.getState().products).toHaveLength(1);
    });

    it("products remain unchanged after removing non-existent id", () => {
      useCompareStore.getState().addProduct(makeProduct("a"));
      useCompareStore.getState().addProduct(makeProduct("b"));
      useCompareStore.getState().removeProduct("z");
      const ids = useCompareStore.getState().products.map((p) => p.id);
      expect(ids).toEqual(["a", "b"]);
    });
  });

  describe("clearAll when already empty works", () => {
    it("clearAll on empty store does not throw", () => {
      expect(() => {
        useCompareStore.getState().clearAll();
      }).not.toThrow();
    });

    it("clearAll on empty store results in empty array", () => {
      useCompareStore.getState().clearAll();
      expect(useCompareStore.getState().products).toEqual([]);
    });

    it("double clearAll does not throw", () => {
      useCompareStore.getState().addProduct(makeProduct("1"));
      useCompareStore.getState().clearAll();
      expect(() => {
        useCompareStore.getState().clearAll();
      }).not.toThrow();
      expect(useCompareStore.getState().products).toEqual([]);
    });
  });

  describe("add 3 -> remove 1 -> add 1 works (back to 3)", () => {
    it("can add back to max after removing one", () => {
      useCompareStore.getState().addProduct(makeProduct("p1"));
      useCompareStore.getState().addProduct(makeProduct("p2"));
      useCompareStore.getState().addProduct(makeProduct("p3"));
      expect(useCompareStore.getState().products).toHaveLength(3);

      useCompareStore.getState().removeProduct("p2");
      expect(useCompareStore.getState().products).toHaveLength(2);

      const result = useCompareStore.getState().addProduct(makeProduct("p4"));
      expect(result).toBe(true);
      expect(useCompareStore.getState().products).toHaveLength(3);
    });

    it("correct products remain after add-remove-add cycle", () => {
      useCompareStore.getState().addProduct(makeProduct("x"));
      useCompareStore.getState().addProduct(makeProduct("y"));
      useCompareStore.getState().addProduct(makeProduct("z"));

      useCompareStore.getState().removeProduct("x");

      useCompareStore.getState().addProduct(makeProduct("w"));

      const ids = useCompareStore.getState().products.map((p) => p.id);
      expect(ids).toEqual(["y", "z", "w"]);
    });

    it("cannot exceed max after add-remove-add cycle", () => {
      useCompareStore.getState().addProduct(makeProduct("1"));
      useCompareStore.getState().addProduct(makeProduct("2"));
      useCompareStore.getState().addProduct(makeProduct("3"));

      useCompareStore.getState().removeProduct("1");
      useCompareStore.getState().addProduct(makeProduct("4"));

      // Now at max again, should reject
      const result = useCompareStore.getState().addProduct(makeProduct("5"));
      expect(result).toBe(false);
      expect(useCompareStore.getState().products).toHaveLength(3);
    });
  });

  describe("isInCompare after clearAll returns false", () => {
    it("isInCompare returns false for previously added product after clearAll", () => {
      useCompareStore.getState().addProduct(makeProduct("check-1"));
      expect(useCompareStore.getState().isInCompare("check-1")).toBe(true);

      useCompareStore.getState().clearAll();
      expect(useCompareStore.getState().isInCompare("check-1")).toBe(false);
    });

    it("isInCompare returns false for all cleared products", () => {
      useCompareStore.getState().addProduct(makeProduct("a"));
      useCompareStore.getState().addProduct(makeProduct("b"));
      useCompareStore.getState().addProduct(makeProduct("c"));

      useCompareStore.getState().clearAll();

      expect(useCompareStore.getState().isInCompare("a")).toBe(false);
      expect(useCompareStore.getState().isInCompare("b")).toBe(false);
      expect(useCompareStore.getState().isInCompare("c")).toBe(false);
    });

    it("can add and find a product after clearAll", () => {
      useCompareStore.getState().addProduct(makeProduct("old"));
      useCompareStore.getState().clearAll();

      const result = useCompareStore.getState().addProduct(makeProduct("new"));
      expect(result).toBe(true);
      expect(useCompareStore.getState().isInCompare("new")).toBe(true);
      expect(useCompareStore.getState().isInCompare("old")).toBe(false);
    });
  });
});
