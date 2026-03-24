import { describe, it, expect, beforeEach } from "vitest";
import { useWishlistStore } from "@/stores/wishlist-store";

const mockItem1 = {
  id: "prod_1",
  title: "Classic T-Shirt",
  handle: "classic-t-shirt",
  thumbnail: "/img/tshirt.jpg",
};

const mockItem2 = {
  id: "prod_2",
  title: "Denim Jacket",
  handle: "denim-jacket",
  thumbnail: "/img/jacket.jpg",
};

describe("wishlist-store", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  it("initial state has empty items array", () => {
    const { items } = useWishlistStore.getState();
    expect(items).toEqual([]);
  });

  it("addItem adds product to list", () => {
    const { addItem } = useWishlistStore.getState();
    addItem(mockItem1);
    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().items[0].id).toBe("prod_1");
  });

  it("addItem prevents duplicates", () => {
    const { addItem } = useWishlistStore.getState();
    addItem(mockItem1);
    addItem(mockItem1);
    expect(useWishlistStore.getState().items).toHaveLength(1);
  });

  it("removeItem removes by id", () => {
    const { addItem } = useWishlistStore.getState();
    addItem(mockItem1);
    addItem(mockItem2);
    useWishlistStore.getState().removeItem("prod_1");
    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("prod_2");
  });

  it("isInWishlist returns true for added items", () => {
    const { addItem } = useWishlistStore.getState();
    addItem(mockItem1);
    expect(useWishlistStore.getState().isInWishlist("prod_1")).toBe(true);
  });

  it("isInWishlist returns false for non-added items", () => {
    expect(useWishlistStore.getState().isInWishlist("prod_999")).toBe(false);
  });

  it("toggleItem adds if not present", () => {
    useWishlistStore.getState().toggleItem(mockItem1);
    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().items[0].id).toBe("prod_1");
  });

  it("toggleItem removes if present", () => {
    const { addItem } = useWishlistStore.getState();
    addItem(mockItem1);
    useWishlistStore.getState().toggleItem(mockItem1);
    expect(useWishlistStore.getState().items).toHaveLength(0);
  });
});
