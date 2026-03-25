import { describe, it, expect, beforeEach } from "vitest";
import { useWishlistStore } from "@/stores/wishlist-store";

function makeItem(id: string, title?: string) {
  return {
    id,
    title: title ?? `Item ${id}`,
    handle: `item-${id}`,
    thumbnail: `/img/${id}.jpg`,
  };
}

describe("wishlist-store advanced", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  describe("adding 20 items works", () => {
    it("stores all 20 items", () => {
      for (let i = 1; i <= 20; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      expect(useWishlistStore.getState().items).toHaveLength(20);
    });

    it("each of the 20 items is findable", () => {
      for (let i = 1; i <= 20; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      for (let i = 1; i <= 20; i++) {
        expect(useWishlistStore.getState().isInWishlist(String(i))).toBe(true);
      }
    });
  });

  describe("removing from middle of list works", () => {
    it("removes the middle item and keeps others", () => {
      useWishlistStore.getState().addItem(makeItem("a"));
      useWishlistStore.getState().addItem(makeItem("b"));
      useWishlistStore.getState().addItem(makeItem("c"));
      useWishlistStore.getState().addItem(makeItem("d"));
      useWishlistStore.getState().addItem(makeItem("e"));

      useWishlistStore.getState().removeItem("c");

      const { items } = useWishlistStore.getState();
      expect(items).toHaveLength(4);
      expect(items.map((i) => i.id)).toEqual(["a", "b", "d", "e"]);
    });

    it("removes second item from a list of 5", () => {
      for (let i = 1; i <= 5; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      useWishlistStore.getState().removeItem("2");
      const ids = useWishlistStore.getState().items.map((i) => i.id);
      expect(ids).toEqual(["1", "3", "4", "5"]);
    });

    it("removes fourth item from a list of 5", () => {
      for (let i = 1; i <= 5; i++) {
        useWishlistStore.getState().addItem(makeItem(String(i)));
      }
      useWishlistStore.getState().removeItem("4");
      const ids = useWishlistStore.getState().items.map((i) => i.id);
      expect(ids).toEqual(["1", "2", "3", "5"]);
    });
  });

  describe("toggleItem rapid fire (toggle same item 10 times)", () => {
    it("ends with item removed after 10 toggles (even count)", () => {
      const item = makeItem("toggle-target");
      for (let i = 0; i < 10; i++) {
        useWishlistStore.getState().toggleItem(item);
      }
      // 10 toggles: add, remove, add, remove... ends removed
      expect(useWishlistStore.getState().items).toHaveLength(0);
    });

    it("ends with item added after 11 toggles (odd count)", () => {
      const item = makeItem("toggle-target");
      for (let i = 0; i < 11; i++) {
        useWishlistStore.getState().toggleItem(item);
      }
      expect(useWishlistStore.getState().items).toHaveLength(1);
      expect(useWishlistStore.getState().items[0].id).toBe("toggle-target");
    });

    it("rapid toggle does not create duplicates", () => {
      const item = makeItem("rapid");
      for (let i = 0; i < 10; i++) {
        useWishlistStore.getState().toggleItem(item);
      }
      // Even number of toggles, should be empty
      const { items } = useWishlistStore.getState();
      expect(items.filter((i) => i.id === "rapid")).toHaveLength(0);

      // One more toggle adds it
      useWishlistStore.getState().toggleItem(item);
      expect(useWishlistStore.getState().items.filter((i) => i.id === "rapid")).toHaveLength(1);
    });
  });

  describe("adding items with minimal required fields", () => {
    it("accepts item with null thumbnail", () => {
      const item = { id: "min1", title: "Minimal", handle: "minimal", thumbnail: null };
      useWishlistStore.getState().addItem(item);
      expect(useWishlistStore.getState().items).toHaveLength(1);
      expect(useWishlistStore.getState().items[0].thumbnail).toBeNull();
    });

    it("accepts item without thumbnail field", () => {
      const item = { id: "min2", title: "No Thumb", handle: "no-thumb" };
      useWishlistStore.getState().addItem(item);
      expect(useWishlistStore.getState().items).toHaveLength(1);
      expect(useWishlistStore.getState().items[0].thumbnail).toBeUndefined();
    });

    it("accepts item with empty string title", () => {
      const item = { id: "min3", title: "", handle: "empty-title" };
      useWishlistStore.getState().addItem(item);
      expect(useWishlistStore.getState().items).toHaveLength(1);
      expect(useWishlistStore.getState().items[0].title).toBe("");
    });
  });

  describe("items order is preserved", () => {
    it("items are in insertion order", () => {
      const items = ["first", "second", "third", "fourth", "fifth"];
      items.forEach((name) => {
        useWishlistStore.getState().addItem(makeItem(name, `Title ${name}`));
      });

      const storedIds = useWishlistStore.getState().items.map((i) => i.id);
      expect(storedIds).toEqual(items);
    });

    it("order is preserved after removing an item", () => {
      const items = ["a", "b", "c", "d"];
      items.forEach((id) => {
        useWishlistStore.getState().addItem(makeItem(id));
      });

      useWishlistStore.getState().removeItem("b");

      const storedIds = useWishlistStore.getState().items.map((i) => i.id);
      expect(storedIds).toEqual(["a", "c", "d"]);
    });

    it("order is preserved after adding duplicate (no change)", () => {
      useWishlistStore.getState().addItem(makeItem("x"));
      useWishlistStore.getState().addItem(makeItem("y"));
      useWishlistStore.getState().addItem(makeItem("z"));
      useWishlistStore.getState().addItem(makeItem("x")); // duplicate

      const storedIds = useWishlistStore.getState().items.map((i) => i.id);
      expect(storedIds).toEqual(["x", "y", "z"]);
    });
  });
});
