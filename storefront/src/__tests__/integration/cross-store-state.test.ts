import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCompareStore } from "@/stores/compare-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { useRegionStore } from "@/stores/region-store";
import type { Product } from "@/lib/types";

function makeWishlistItem(id: string) {
  return {
    id,
    title: `Wishlist Item ${id}`,
    handle: `wishlist-item-${id}`,
    thumbnail: `/img/wish-${id}.jpg`,
  };
}

function makeProduct(id: string): Product {
  return {
    id,
    title: `Compare Product ${id}`,
    handle: `compare-product-${id}`,
    thumbnail: `/img/compare-${id}.jpg`,
  };
}

function makeRecentProduct(id: string) {
  return {
    id,
    title: `Recent Product ${id}`,
    handle: `recent-product-${id}`,
    thumbnail: `/img/recent-${id}.jpg`,
  };
}

describe("cross-store state independence", () => {
  beforeEach(() => {
    useCartStore.setState({ cartId: null, open: false });
    useWishlistStore.setState({ items: [] });
    useCompareStore.setState({ products: [] });
    useRecentlyViewedStore.setState({ products: [] });
    useRegionStore.setState({
      regionId: null,
      countryCode: "us",
      currencyCode: "usd",
    });
  });

  describe("wishlist items persist independently of cart state", () => {
    it("modifying cart does not affect wishlist items", () => {
      useWishlistStore.getState().addItem(makeWishlistItem("w1"));
      useWishlistStore.getState().addItem(makeWishlistItem("w2"));

      // Modify cart state extensively
      useCartStore.getState().setCartId("cart_new");
      useCartStore.getState().openCart();
      useCartStore.getState().closeCart();
      useCartStore.getState().setCartId(null);
      useCartStore.getState().toggleCart();

      // Wishlist should be completely unchanged
      expect(useWishlistStore.getState().items).toHaveLength(2);
      expect(useWishlistStore.getState().items[0].id).toBe("w1");
      expect(useWishlistStore.getState().items[1].id).toBe("w2");
    });

    it("clearing cart does not clear wishlist", () => {
      useWishlistStore.getState().addItem(makeWishlistItem("persist-1"));
      useCartStore.getState().setCartId("cart_to_clear");

      // Clear cart
      useCartStore.getState().setCartId(null);

      expect(useCartStore.getState().cartId).toBeNull();
      expect(useWishlistStore.getState().items).toHaveLength(1);
      expect(useWishlistStore.getState().isInWishlist("persist-1")).toBe(true);
    });
  });

  describe("region change doesn't affect wishlist", () => {
    it("changing region preserves all wishlist items", () => {
      useWishlistStore.getState().addItem(makeWishlistItem("before-region-1"));
      useWishlistStore.getState().addItem(makeWishlistItem("before-region-2"));
      useWishlistStore.getState().addItem(makeWishlistItem("before-region-3"));

      // Change region multiple times
      useRegionStore.getState().setRegion("reg_eu", "de", "eur");
      useRegionStore.getState().setRegion("reg_uk", "gb", "gbp");
      useRegionStore.getState().setRegion("reg_jp", "jp", "jpy");

      // Wishlist should be completely unchanged
      expect(useWishlistStore.getState().items).toHaveLength(3);
      expect(useWishlistStore.getState().isInWishlist("before-region-1")).toBe(true);
      expect(useWishlistStore.getState().isInWishlist("before-region-2")).toBe(true);
      expect(useWishlistStore.getState().isInWishlist("before-region-3")).toBe(true);
    });

    it("region state is correct after wishlist operations", () => {
      useRegionStore.getState().setRegion("reg_eu", "de", "eur");

      // Perform wishlist operations
      useWishlistStore.getState().addItem(makeWishlistItem("x"));
      useWishlistStore.getState().toggleItem(makeWishlistItem("y"));
      useWishlistStore.getState().removeItem("x");

      // Region should be unchanged
      const regionState = useRegionStore.getState();
      expect(regionState.regionId).toBe("reg_eu");
      expect(regionState.countryCode).toBe("de");
      expect(regionState.currencyCode).toBe("eur");
    });
  });

  describe("compare store independent of recently viewed", () => {
    it("adding to compare does not affect recently viewed", () => {
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("r1"));
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("r2"));

      // Add to compare
      useCompareStore.getState().addProduct(makeProduct("c1"));
      useCompareStore.getState().addProduct(makeProduct("c2"));
      useCompareStore.getState().addProduct(makeProduct("c3"));

      // Recently viewed should be unchanged
      expect(useRecentlyViewedStore.getState().products).toHaveLength(2);
      expect(useRecentlyViewedStore.getState().products[0].id).toBe("r2");
      expect(useRecentlyViewedStore.getState().products[1].id).toBe("r1");
    });

    it("clearing compare does not affect recently viewed", () => {
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("keep"));
      useCompareStore.getState().addProduct(makeProduct("discard"));

      useCompareStore.getState().clearAll();

      expect(useCompareStore.getState().products).toHaveLength(0);
      expect(useRecentlyViewedStore.getState().products).toHaveLength(1);
      expect(useRecentlyViewedStore.getState().products[0].id).toBe("keep");
    });

    it("adding to recently viewed does not affect compare", () => {
      useCompareStore.getState().addProduct(makeProduct("stable"));

      for (let i = 1; i <= 15; i++) {
        useRecentlyViewedStore
          .getState()
          .addProduct(makeRecentProduct(String(i)));
      }

      expect(useCompareStore.getState().products).toHaveLength(1);
      expect(useCompareStore.getState().products[0].id).toBe("stable");
    });
  });

  describe("all 5 stores can be used simultaneously without interference", () => {
    it("operating on all 5 stores simultaneously preserves each store's state", () => {
      // Set up all stores
      useCartStore.getState().setCartId("cart_sim");
      useCartStore.getState().openCart();
      useWishlistStore.getState().addItem(makeWishlistItem("sim-w1"));
      useWishlistStore.getState().addItem(makeWishlistItem("sim-w2"));
      useCompareStore.getState().addProduct(makeProduct("sim-c1"));
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("sim-r1"));
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("sim-r2"));
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("sim-r3"));
      useRegionStore.getState().setRegion("reg_sim", "fr", "eur");

      // Verify all stores have correct independent state
      expect(useCartStore.getState().cartId).toBe("cart_sim");
      expect(useCartStore.getState().open).toBe(true);
      expect(useWishlistStore.getState().items).toHaveLength(2);
      expect(useCompareStore.getState().products).toHaveLength(1);
      expect(useRecentlyViewedStore.getState().products).toHaveLength(3);
      expect(useRegionStore.getState().regionId).toBe("reg_sim");
      expect(useRegionStore.getState().countryCode).toBe("fr");
      expect(useRegionStore.getState().currencyCode).toBe("eur");
    });

    it("modifying one store does not alter any other store", () => {
      // Set initial state for all stores
      useCartStore.getState().setCartId("cart_check");
      useWishlistStore.getState().addItem(makeWishlistItem("check-w"));
      useCompareStore.getState().addProduct(makeProduct("check-c"));
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("check-r"));
      useRegionStore.getState().setRegion("reg_check", "gb", "gbp");

      // Snapshot all states
      const cartBefore = { ...useCartStore.getState() };
      const wishlistBefore = [...useWishlistStore.getState().items];
      const compareBefore = [...useCompareStore.getState().products];
      const recentBefore = [...useRecentlyViewedStore.getState().products];

      // Modify only the region store
      useRegionStore.getState().setRegion("reg_new", "jp", "jpy");

      // Verify only region changed
      expect(useCartStore.getState().cartId).toBe(cartBefore.cartId);
      expect(useCartStore.getState().open).toBe(cartBefore.open);
      expect(useWishlistStore.getState().items).toEqual(wishlistBefore);
      expect(useCompareStore.getState().products).toEqual(compareBefore);
      expect(useRecentlyViewedStore.getState().products).toEqual(recentBefore);
      expect(useRegionStore.getState().regionId).toBe("reg_new");
    });

    it("interleaved operations across all stores produce correct results", () => {
      // Interleave operations across all 5 stores
      useCartStore.getState().setCartId("interleave");
      useWishlistStore.getState().addItem(makeWishlistItem("il-1"));
      useRegionStore.getState().setRegion("reg_il", "it", "eur");
      useCompareStore.getState().addProduct(makeProduct("il-c1"));
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("il-r1"));
      useWishlistStore.getState().addItem(makeWishlistItem("il-2"));
      useCartStore.getState().openCart();
      useCompareStore.getState().addProduct(makeProduct("il-c2"));
      useRecentlyViewedStore.getState().addProduct(makeRecentProduct("il-r2"));
      useWishlistStore.getState().toggleItem(makeWishlistItem("il-1"));
      useCartStore.getState().closeCart();

      // Final state check
      expect(useCartStore.getState().cartId).toBe("interleave");
      expect(useCartStore.getState().open).toBe(false);
      expect(useWishlistStore.getState().items).toHaveLength(1);
      expect(useWishlistStore.getState().items[0].id).toBe("il-2");
      expect(useCompareStore.getState().products).toHaveLength(2);
      expect(useRecentlyViewedStore.getState().products).toHaveLength(2);
      expect(useRegionStore.getState().countryCode).toBe("it");
    });
  });
});
