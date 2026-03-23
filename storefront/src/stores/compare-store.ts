"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

const MAX_COMPARE = 3;

interface CompareState {
  products: Product[];
  addProduct: (product: Product) => boolean;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const state = get();
        if (state.products.length >= MAX_COMPARE) return false;
        if (state.products.some((p) => p.id === product.id)) return false;
        set({ products: [...state.products, product] });
        return true;
      },
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
      clearAll: () => set({ products: [] }),
      isInCompare: (productId) =>
        get().products.some((p) => p.id === productId),
    }),
    { name: "webstore-compare" }
  )
);
