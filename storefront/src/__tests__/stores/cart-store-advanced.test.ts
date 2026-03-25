import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cart-store";

describe("cart-store advanced", () => {
  beforeEach(() => {
    useCartStore.setState({ cartId: null, open: false });
  });

  describe("multiple rapid setCartId calls (last one wins)", () => {
    it("retains only the last cartId after rapid updates", () => {
      const store = useCartStore.getState();
      store.setCartId("cart_1");
      useCartStore.getState().setCartId("cart_2");
      useCartStore.getState().setCartId("cart_3");
      useCartStore.getState().setCartId("cart_4");
      useCartStore.getState().setCartId("cart_final");
      expect(useCartStore.getState().cartId).toBe("cart_final");
    });

    it("handles 20 rapid setCartId calls", () => {
      for (let i = 0; i < 20; i++) {
        useCartStore.getState().setCartId(`cart_${i}`);
      }
      expect(useCartStore.getState().cartId).toBe("cart_19");
    });
  });

  describe("toggle cart open/close cycle multiple times", () => {
    it("toggleCart 6 times returns to closed", () => {
      for (let i = 0; i < 6; i++) {
        useCartStore.getState().toggleCart();
      }
      expect(useCartStore.getState().open).toBe(false);
    });

    it("toggleCart 7 times ends at open", () => {
      for (let i = 0; i < 7; i++) {
        useCartStore.getState().toggleCart();
      }
      expect(useCartStore.getState().open).toBe(true);
    });

    it("openCart/closeCart cycle 5 times works correctly", () => {
      for (let i = 0; i < 5; i++) {
        useCartStore.getState().openCart();
        expect(useCartStore.getState().open).toBe(true);
        useCartStore.getState().closeCart();
        expect(useCartStore.getState().open).toBe(false);
      }
    });
  });

  describe("setCartId to null clears the cart", () => {
    it("clearing a previously set cartId results in null", () => {
      useCartStore.getState().setCartId("cart_abc");
      expect(useCartStore.getState().cartId).toBe("cart_abc");
      useCartStore.getState().setCartId(null);
      expect(useCartStore.getState().cartId).toBeNull();
    });

    it("setting null when already null is a no-op", () => {
      expect(useCartStore.getState().cartId).toBeNull();
      useCartStore.getState().setCartId(null);
      expect(useCartStore.getState().cartId).toBeNull();
    });
  });

  describe("state resets properly after clearing", () => {
    it("resetting state returns to initial values", () => {
      useCartStore.getState().setCartId("cart_xyz");
      useCartStore.getState().openCart();
      expect(useCartStore.getState().cartId).toBe("cart_xyz");
      expect(useCartStore.getState().open).toBe(true);

      // Reset
      useCartStore.setState({ cartId: null, open: false });
      expect(useCartStore.getState().cartId).toBeNull();
      expect(useCartStore.getState().open).toBe(false);
    });

    it("clearing cartId does not affect open state", () => {
      useCartStore.getState().setCartId("cart_123");
      useCartStore.getState().openCart();
      useCartStore.getState().setCartId(null);
      expect(useCartStore.getState().cartId).toBeNull();
      expect(useCartStore.getState().open).toBe(true);
    });
  });

  describe("openCart -> closeCart -> openCart sequence", () => {
    it("completes the open-close-open sequence correctly", () => {
      useCartStore.getState().openCart();
      expect(useCartStore.getState().open).toBe(true);

      useCartStore.getState().closeCart();
      expect(useCartStore.getState().open).toBe(false);

      useCartStore.getState().openCart();
      expect(useCartStore.getState().open).toBe(true);
    });

    it("openCart is idempotent", () => {
      useCartStore.getState().openCart();
      useCartStore.getState().openCart();
      useCartStore.getState().openCart();
      expect(useCartStore.getState().open).toBe(true);
    });

    it("closeCart is idempotent", () => {
      useCartStore.getState().closeCart();
      useCartStore.getState().closeCart();
      useCartStore.getState().closeCart();
      expect(useCartStore.getState().open).toBe(false);
    });

    it("toggle after openCart closes it", () => {
      useCartStore.getState().openCart();
      useCartStore.getState().toggleCart();
      expect(useCartStore.getState().open).toBe(false);
    });

    it("toggle after closeCart opens it", () => {
      useCartStore.getState().openCart();
      useCartStore.getState().closeCart();
      useCartStore.getState().toggleCart();
      expect(useCartStore.getState().open).toBe(true);
    });
  });
});
