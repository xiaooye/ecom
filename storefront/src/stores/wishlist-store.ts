"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),
      isInWishlist: (productId) => get().items.some((i) => i.id === productId),
      toggleItem: (item) => {
        const state = get();
        if (state.items.some((i) => i.id === item.id)) {
          set({ items: state.items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...state.items, item] });
        }
      },
    }),
    {
      name: "webstore-wishlist",
    }
  )
);
