import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCompareStore } from "@/stores/compare-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import type { Product } from "@/lib/types";

const wishlistItem = {
  id: "prod_1",
  title: "Classic T-Shirt",
  handle: "classic-t-shirt",
  thumbnail: "/img/tshirt.jpg",
};

const wishlistItem2 = {
  id: "prod_2",
  title: "Denim Jacket",
  handle: "denim-jacket",
  thumbnail: "/img/jacket.jpg",
};

function makeProduct(id: string): Product {
  return {
    id,
    title: `Product ${id}`,
    handle: `product-${id}`,
    thumbnail: `/img/${id}.jpg`,
  };
}

function makeRecentProduct(id: string) {
  return {
    id,
    title: `Product ${id}`,
    handle: `product-${id}`,
    thumbnail: `/img/${id}.jpg`,
  };
}

describe("All stores integration", () => {
  beforeEach(() => {
    useCartStore.setState({ cartId: null, open: false });
    useWishlistStore.setState({ items: [] });
    useCompareStore.setState({ products: [] });
    useRecentlyViewedStore.setState({ products: [] });
  });

  it("cart and wishlist stores can operate independently", () => {
    // Set cart state
    useCartStore.getState().setCartId("cart_abc");
    useCartStore.getState().openCart();

    // Set wishlist state
    useWishlistStore.getState().addItem(wishlistItem);

    // Verify both stores have their respective state
    expect(useCartStore.getState().cartId).toBe("cart_abc");
    expect(useCartStore.getState().open).toBe(true);
    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().items[0].id).toBe("prod_1");
  });

  it("adding to wishlist does not affect cart", () => {
    // Set initial cart state
    useCartStore.getState().setCartId("cart_123");
    const cartIdBefore = useCartStore.getState().cartId;
    const cartOpenBefore = useCartStore.getState().open;

    // Add items to wishlist
    useWishlistStore.getState().addItem(wishlistItem);
    useWishlistStore.getState().addItem(wishlistItem2);

    // Cart state should be unchanged
    expect(useCartStore.getState().cartId).toBe(cartIdBefore);
    expect(useCartStore.getState().open).toBe(cartOpenBefore);
  });

  it("adding to cart does not affect wishlist", () => {
    // Pre-populate wishlist
    useWishlistStore.getState().addItem(wishlistItem);
    const wishlistCountBefore = useWishlistStore.getState().items.length;

    // Modify cart state
    useCartStore.getState().setCartId("cart_new");
    useCartStore.getState().openCart();
    useCartStore.getState().closeCart();
    useCartStore.getState().toggleCart();

    // Wishlist should be unchanged
    expect(useWishlistStore.getState().items.length).toBe(wishlistCountBefore);
    expect(useWishlistStore.getState().items[0].id).toBe("prod_1");
  });

  it("compare store enforces max 3 products", () => {
    const store = useCompareStore.getState();
    expect(store.addProduct(makeProduct("1"))).toBe(true);
    expect(store.addProduct(makeProduct("2"))).toBe(true);
    expect(store.addProduct(makeProduct("3"))).toBe(true);

    // 4th should be rejected
    const result = useCompareStore.getState().addProduct(makeProduct("4"));
    expect(result).toBe(false);
    expect(useCompareStore.getState().products).toHaveLength(3);

    // After removing one, we can add again
    useCompareStore.getState().removeProduct("1");
    const result2 = useCompareStore.getState().addProduct(makeProduct("4"));
    expect(result2).toBe(true);
    expect(useCompareStore.getState().products).toHaveLength(3);
  });

  it("recently viewed deduplication across rapid adds", () => {
    const store = useRecentlyViewedStore.getState();

    // Simulate rapidly viewing the same product multiple times
    store.addProduct(makeRecentProduct("1"));
    useRecentlyViewedStore.getState().addProduct(makeRecentProduct("2"));
    useRecentlyViewedStore.getState().addProduct(makeRecentProduct("1"));
    useRecentlyViewedStore.getState().addProduct(makeRecentProduct("3"));
    useRecentlyViewedStore.getState().addProduct(makeRecentProduct("1"));

    const { products } = useRecentlyViewedStore.getState();

    // Should have exactly 3 unique products (no duplicates)
    expect(products).toHaveLength(3);

    // Product "1" should be at the front (most recently viewed)
    expect(products[0].id).toBe("1");

    // Each product should appear exactly once
    const ids = products.map((p) => p.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  it("all stores maintain their state independently after mixed operations", () => {
    // Operate on all stores in interleaved fashion
    useCartStore.getState().setCartId("cart_mixed");
    useWishlistStore.getState().addItem(wishlistItem);
    useCompareStore.getState().addProduct(makeProduct("c1"));
    useRecentlyViewedStore.getState().addProduct(makeRecentProduct("r1"));

    useCartStore.getState().openCart();
    useWishlistStore.getState().addItem(wishlistItem2);
    useCompareStore.getState().addProduct(makeProduct("c2"));
    useRecentlyViewedStore.getState().addProduct(makeRecentProduct("r2"));

    // Verify all stores have correct state
    expect(useCartStore.getState().cartId).toBe("cart_mixed");
    expect(useCartStore.getState().open).toBe(true);
    expect(useWishlistStore.getState().items).toHaveLength(2);
    expect(useCompareStore.getState().products).toHaveLength(2);
    expect(useRecentlyViewedStore.getState().products).toHaveLength(2);
  });
});
