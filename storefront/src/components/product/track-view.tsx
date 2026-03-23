"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

interface TrackViewProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string | null;
  };
}

export function TrackView({ product }: TrackViewProps) {
  const addProduct = useRecentlyViewedStore((s) => s.addProduct);

  useEffect(() => {
    addProduct(product);
  }, [product, addProduct]);

  return null;
}
