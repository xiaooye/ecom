import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cart-store";

describe("cart-store", () => {
  beforeEach(() => {
    // Reset the store to its initial state between tests
    useCartStore.setState({
      cartId: null,
      open: false,
    });
  });

  it("initial state has null cartId", () => {
    const { cartId } = useCartStore.getState();
    expect(cartId).toBeNull();
  });

  it("setCartId updates cartId", () => {
    const { setCartId } = useCartStore.getState();
    setCartId("cart_abc123");
    expect(useCartStore.getState().cartId).toBe("cart_abc123");
  });

  it("setCartId can set back to null", () => {
    const { setCartId } = useCartStore.getState();
    setCartId("cart_abc123");
    setCartId(null);
    expect(useCartStore.getState().cartId).toBeNull();
  });

  it("initial state has open=false", () => {
    const { open } = useCartStore.getState();
    expect(open).toBe(false);
  });

  it("openCart sets open to true", () => {
    const { openCart } = useCartStore.getState();
    openCart();
    expect(useCartStore.getState().open).toBe(true);
  });

  it("closeCart sets open to false", () => {
    const { openCart, closeCart } = useCartStore.getState();
    openCart();
    closeCart();
    expect(useCartStore.getState().open).toBe(false);
  });

  it("toggleCart flips open state", () => {
    const { toggleCart } = useCartStore.getState();
    expect(useCartStore.getState().open).toBe(false);

    toggleCart();
    expect(useCartStore.getState().open).toBe(true);

    toggleCart();
    expect(useCartStore.getState().open).toBe(false);
  });
});
