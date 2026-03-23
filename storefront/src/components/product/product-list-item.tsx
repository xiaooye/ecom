"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/lib/types";

export function ProductListItem({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const price = variants[0]?.calculated_price;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={112}
            height={112}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium group-hover:underline">{product.title}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>
        {price && (
          <p className="text-sm font-semibold">
            {formatPrice(price.calculated_amount, price.currency_code)}
          </p>
        )}
      </div>
    </Link>
  );
}
