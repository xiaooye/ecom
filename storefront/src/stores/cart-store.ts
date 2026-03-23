"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cartId: string | null;
  setCartId: (id: string | null) => void;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      setCartId: (id) => set({ cartId: id }),
      open: false,
      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),
      toggleCart: () => set((state) => ({ open: !state.open })),
    }),
    {
      name: "webstore-cart",
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);
