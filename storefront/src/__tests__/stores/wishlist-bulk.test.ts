import { describe, it, expect, beforeEach } from "vitest";
import { useWishlistStore } from "@/stores/wishlist-store";

function makeItem(id: string) {
  return {
    id,
    title: `Item ${id}`,
    handle: `item-${id}`,
    thumbnail: `/img/${id}.jpg`,
  };
}

describe("wishlist-store bulk operations", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  describe("add 50 items one by one, all preserved", () => {
    it("stores all 50 items", () => {
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      expect(useWishlistStore.getState().items).toHaveLength(50);
    });

    it("each of the 50 items is findable via isInWishlist", () => {
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      for (let i = 1; i <= 50; i++) {
        expect(useWishlistStore.getState().isInWishlist(String(i))).toBe(true);
      }
    });

    it("all 50 items have correct data", () => {
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      const items = useWishlistStore.getState().items;
      for (let i = 0; i < 50; i++) {
        expect(items[i].id).toBe(String(i + 1));
        expect(items[i].title).toBe(`Item ${i + 1}`);
        expect(items[i].handle).toBe(`item-${i + 1}`);
      }
    });
  });

  describe("remove all items one by one, empty at end", () => {
    it("removing all 50 items leaves empty list", () => {
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      expect(useWishlistStore.getState().items).toHaveLength(50);

      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().removeItem(String(i));
      }
      expect(useWishlistStore.getState().items).toHaveLength(0);
    });

    it("isInWishlist returns false for all removed items", () => {
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().removeItem(String(i));
      }
      for (let i = 1; i <= 50; i++) {
        expect(useWishlistStore.getState().isInWishlist(String(i))).toBe(false);
      }
    });

    it("removing in reverse order also works", () => {
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      for (let i = 50; i >= 1; i--) {
        useWishlistStore.getState().removeItem(String(i));
      }
      expect(useWishlistStore.getState().items).toHaveLength(0);
    });
  });

  describe("toggle all 50 items (all removed)", () => {
    it("toggling 50 added items removes them all", () => {
      // First add all 50 items
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      expect(useWishlistStore.getState().items).toHaveLength(50);

      // Now toggle all 50 items (since they are present, toggle removes them)
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().toggleItem(makeItem(String(i)));
      }
      expect(useWishlistStore.getState().items).toHaveLength(0);
    });

    it("toggling items not in list adds them all", () => {
      // Toggle 50 items that are not in the list (should add all)
      for (let i = 1; i <= 50; i++) {
        useWishlistStore.getState().toggleItem(makeItem(String(i)));
      }
      expect(useWishlistStore.getState().items).toHaveLength(50);
    });

    it("double toggle each item leaves list empty", () => {
      for (let i = 1; i <= 50; i++) {
        const item = makeItem(String(i));
        useWishlistStore.getState().toggleItem(item); // add
        useWishlistStore.getState().toggleItem(item); // remove
      }
      expect(useWishlistStore.getState().items).toHaveLength(0);
    });
  });

  describe("isInWishlist performance with large list (100 items check < 10ms)", () => {
    it("checking 100 items completes in under 10ms", () => {
      // Add 100 items
      for (let i = 1; i <= 100; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      expect(useWishlistStore.getState().items).toHaveLength(100);

      const start = performance.now();
      for (let i = 1; i <= 100; i++) {
        useWishlistStore.getState().isInWishlist(String(i));
      }
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(10);
    });

    it("checking non-existent items is also fast", () => {
      // Add 100 items
      for (let i = 1; i <= 100; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }

      const start = performance.now();
      for (let i = 101; i <= 200; i++) {
        useWishlistStore.getState().isInWishlist(String(i));
      }
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(10);
    });
  });
});
