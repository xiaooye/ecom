"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
}

interface RecentlyViewedState {
  products: RecentProduct[];
  addProduct: (product: RecentProduct) => void;
}

const MAX_RECENT = 10;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => {
          const filtered = state.products.filter((p) => p.id !== product.id);
          return { products: [product, ...filtered].slice(0, MAX_RECENT) };
        }),
    }),
    {
      name: "webstore-recently-viewed",
    }
  )
);
