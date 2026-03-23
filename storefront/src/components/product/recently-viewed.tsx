"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const products = useRecentlyViewedStore((s) => s.products);
  const filtered = products.filter((p) => p.id !== excludeId);

  if (filtered.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold tracking-tight">Recently Viewed</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group flex-shrink-0"
          >
            <div className="h-36 w-28 overflow-hidden rounded-lg bg-gray-100">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={112}
                  height={144}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <p className="mt-2 w-28 truncate text-xs font-medium group-hover:underline">
              {product.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
