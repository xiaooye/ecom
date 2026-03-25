import { describe, it, expect, beforeEach } from "vitest";

describe("store persistence via Zustand persist middleware", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("cart store persists cartId to localStorage key 'webstore-cart'", () => {
    it("writes to the correct localStorage key after setCartId", async () => {
      // Dynamically import to ensure fresh module state interacts with localStorage
      const { useCartStore } = await import("@/stores/cart-store");
      useCartStore.setState({ cartId: null, open: false });

      useCartStore.getState().setCartId("cart_persist_test");

      // Zustand persist writes to localStorage asynchronously within the same tick
      // but since our storage mock is synchronous, it should be available
      const stored = localStorage.getItem("webstore-cart");
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.cartId).toBe("cart_persist_test");
    });

    it("only persists cartId, not open state (partialize)", async () => {
      const { useCartStore } = await import("@/stores/cart-store");
      useCartStore.setState({ cartId: null, open: false });

      useCartStore.getState().setCartId("cart_partial");
      useCartStore.getState().openCart();

      const stored = localStorage.getItem("webstore-cart");
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      // cartId should be persisted
      expect(parsed.state.cartId).toBe("cart_partial");
      // open should NOT be persisted (partialize excludes it)
      expect(parsed.state.open).toBeUndefined();
    });
  });

  describe("wishlist store persists items to 'webstore-wishlist'", () => {
    it("writes wishlist items to the correct localStorage key", async () => {
      const { useWishlistStore } = await import("@/stores/wishlist-store");
      useWishlistStore.setState({ items: [] });

      useWishlistStore.getState().addItem({
        id: "wish_1",
        title: "Test Shirt",
        handle: "test-shirt",
        thumbnail: "/img/shirt.jpg",
      });

      const stored = localStorage.getItem("webstore-wishlist");
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.items).toHaveLength(1);
      expect(parsed.state.items[0].id).toBe("wish_1");
    });

    it("persists multiple items", async () => {
      const { useWishlistStore } = await import("@/stores/wishlist-store");
      useWishlistStore.setState({ items: [] });

      useWishlistStore.getState().addItem({
        id: "w1",
        title: "Item 1",
        handle: "item-1",
      });
      useWishlistStore.getState().addItem({
        id: "w2",
        title: "Item 2",
        handle: "item-2",
      });

      const stored = localStorage.getItem("webstore-wishlist");
      const parsed = JSON.parse(stored!);
      expect(parsed.state.items).toHaveLength(2);
    });
  });

  describe("region store persists to 'webstore-region'", () => {
    it("writes region data to the correct localStorage key", async () => {
      const { useRegionStore } = await import("@/stores/region-store");
      useRegionStore.setState({ regionId: null, countryCode: "us", currencyCode: "usd" });

      useRegionStore.getState().setRegion("reg_eu", "de", "eur");

      const stored = localStorage.getItem("webstore-region");
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.regionId).toBe("reg_eu");
      expect(parsed.state.countryCode).toBe("de");
      expect(parsed.state.currencyCode).toBe("eur");
    });

    it("updates persisted data when region changes", async () => {
      const { useRegionStore } = await import("@/stores/region-store");
      useRegionStore.setState({ regionId: null, countryCode: "us", currencyCode: "usd" });

      useRegionStore.getState().setRegion("reg_us", "us", "usd");
      useRegionStore.getState().setRegion("reg_uk", "gb", "gbp");

      const stored = localStorage.getItem("webstore-region");
      const parsed = JSON.parse(stored!);
      expect(parsed.state.regionId).toBe("reg_uk");
      expect(parsed.state.countryCode).toBe("gb");
      expect(parsed.state.currencyCode).toBe("gbp");
    });
  });
});
