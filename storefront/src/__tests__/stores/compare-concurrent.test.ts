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

describe("compare-store concurrent operations", () => {
  beforeEach(() => {
    useCompareStore.setState({ products: [] });
  });

  describe("rapid add/remove cycles (add1, remove1, add2, remove2...)", () => {
    it("alternating add/remove leaves store empty", () => {
      for (let i = 1; i <= 10; i++) {
        useCompareStore.getState().addProduct(makeProduct(String(i)));
        useCompareStore.getState().removeProduct(String(i));
      }
      expect(useCompareStore.getState().products).toHaveLength(0);
    });

    it("add/remove cycle does not corrupt state", () => {
      for (let i = 1; i <= 10; i++) {
        const id = String(i);
        useCompareStore.getState().addProduct(makeProduct(id));
        expect(useCompareStore.getState().isInCompare(id)).toBe(true);
        useCompareStore.getState().removeProduct(id);
        expect(useCompareStore.getState().isInCompare(id)).toBe(false);
      }
    });

    it("add two, remove first, add another - consistent state", () => {
      useCompareStore.getState().addProduct(makeProduct("a"));
      useCompareStore.getState().addProduct(makeProduct("b"));
      useCompareStore.getState().removeProduct("a");
      useCompareStore.getState().addProduct(makeProduct("c"));

      const ids = useCompareStore.getState().products.map((p) => p.id);
      expect(ids).toEqual(["b", "c"]);
    });
  });

  describe("state is consistent after 20 operations", () => {
    it("20 mixed operations produce correct final state", () => {
      // Operations: add 1-3, remove 1, add 4, remove 2, add 5, remove 3,
      // add 6, remove 4, add 7, remove 5, add 8, remove 6, add 9, remove 7,
      // add 10, remove 8, add 11, remove 9
      // After: should have products 10, 11
      useCompareStore.getState().addProduct(makeProduct("1"));
      useCompareStore.getState().addProduct(makeProduct("2"));
      useCompareStore.getState().addProduct(makeProduct("3"));
      useCompareStore.getState().removeProduct("1");
      useCompareStore.getState().addProduct(makeProduct("4"));
      useCompareStore.getState().removeProduct("2");
      useCompareStore.getState().addProduct(makeProduct("5"));
      useCompareStore.getState().removeProduct("3");
      useCompareStore.getState().addProduct(makeProduct("6"));
      useCompareStore.getState().removeProduct("4");
      useCompareStore.getState().addProduct(makeProduct("7"));
      useCompareStore.getState().removeProduct("5");
      useCompareStore.getState().addProduct(makeProduct("8"));
      useCompareStore.getState().removeProduct("6");
      useCompareStore.getState().addProduct(makeProduct("9"));
      useCompareStore.getState().removeProduct("7");
      useCompareStore.getState().addProduct(makeProduct("10"));
      useCompareStore.getState().removeProduct("8");
      useCompareStore.getState().addProduct(makeProduct("11"));
      useCompareStore.getState().removeProduct("9");

      const ids = useCompareStore.getState().products.map((p) => p.id);
      expect(ids).toEqual(["10", "11"]);
      expect(useCompareStore.getState().products).toHaveLength(2);
    });

    it("20 add attempts with max 3 keeps exactly 3", () => {
      // First 3 succeed, rest fail
      for (let i = 1; i <= 20; i++) {
        useCompareStore.getState().addProduct(makeProduct(String(i)));
      }
      expect(useCompareStore.getState().products).toHaveLength(3);
      const ids = useCompareStore.getState().products.map((p) => p.id);
      expect(ids).toEqual(["1", "2", "3"]);
    });

    it("clear then add 20 keeps exactly 3", () => {
      useCompareStore.getState().addProduct(makeProduct("old1"));
      useCompareStore.getState().addProduct(makeProduct("old2"));
      useCompareStore.getState().clearAll();

      for (let i = 1; i <= 20; i++) {
        useCompareStore.getState().addProduct(makeProduct(`new-${i}`));
      }
      expect(useCompareStore.getState().products).toHaveLength(3);
      expect(useCompareStore.getState().products[0].id).toBe("new-1");
      expect(useCompareStore.getState().products[1].id).toBe("new-2");
      expect(useCompareStore.getState().products[2].id).toBe("new-3");
    });
  });

  describe("products array length never exceeds 3", () => {
    it("trying to add 10 products never exceeds 3", () => {
      for (let i = 1; i <= 10; i++) {
        useCompareStore.getState().addProduct(makeProduct(String(i)));
        expect(useCompareStore.getState().products.length).toBeLessThanOrEqual(3);
      }
    });

    it("rapid remove/add cycles never exceed 3", () => {
      // Fill to max
      useCompareStore.getState().addProduct(makeProduct("1"));
      useCompareStore.getState().addProduct(makeProduct("2"));
      useCompareStore.getState().addProduct(makeProduct("3"));

      for (let i = 4; i <= 20; i++) {
        // Remove one, add one
        useCompareStore.getState().removeProduct(String(i - 3));
        useCompareStore.getState().addProduct(makeProduct(String(i)));
        expect(useCompareStore.getState().products.length).toBeLessThanOrEqual(3);
      }
    });

    it("concurrent duplicate adds never exceed 3", () => {
      useCompareStore.getState().addProduct(makeProduct("x"));
      useCompareStore.getState().addProduct(makeProduct("y"));
      useCompareStore.getState().addProduct(makeProduct("z"));

      // Try adding duplicates and new items
      useCompareStore.getState().addProduct(makeProduct("x"));
      useCompareStore.getState().addProduct(makeProduct("y"));
      useCompareStore.getState().addProduct(makeProduct("new1"));
      useCompareStore.getState().addProduct(makeProduct("new2"));

      expect(useCompareStore.getState().products.length).toBeLessThanOrEqual(3);
    });
  });
});
