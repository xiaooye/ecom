"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ComparisonProduct {
  product: Product;
  /** Material / fabric info */
  material?: string;
  /** Average rating out of 5 */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Callback when Add to Cart is clicked */
  onAddToCart?: (product: Product) => void;
}

interface ProductComparisonTableProps {
  items: ComparisonProduct[];
  className?: string;
}

/**
 * Full comparison table component that renders products side-by-side
 * with rows for image, title, price, material, sizes, rating,
 * and an add-to-cart button per product.
 */
export function ProductComparisonTable({
  items,
  className,
}: ProductComparisonTableProps) {
  if (items.length === 0) return null;

  const rows: {
    label: string;
    render: (item: ComparisonProduct) => React.ReactNode;
  }[] = [
    {
      label: "Image",
      render: (item) => (
        <div className="mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-lg bg-gray-100">
          {item.product.thumbnail ? (
            <Image
              src={item.product.thumbnail}
              alt={item.product.title}
              width={200}
              height={267}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Product",
      render: (item) => (
        <p className="text-sm font-semibold">{item.product.title}</p>
      ),
    },
    {
      label: "Price",
      render: (item) => {
        const price = item.product.variants?.[0]?.calculated_price;
        return (
          <p className="text-base font-bold">
            {price
              ? formatPrice(price.calculated_amount, price.currency_code)
              : "N/A"}
          </p>
        );
      },
    },
    {
      label: "Material",
      render: (item) => (
        <p className="text-sm text-muted-foreground">
          {item.material ?? "Not specified"}
        </p>
      ),
    },
    {
      label: "Sizes",
      render: (item) => {
        const sizeOption = item.product.options?.find(
          (o) => o.title.toLowerCase() === "size"
        );
        const sizes = sizeOption?.values.map((v) => v.value) ?? [];
        return sizes.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1">
            {sizes.map((size) => (
              <span
                key={size}
                className="inline-flex h-7 min-w-[28px] items-center justify-center rounded border px-1.5 text-xs font-medium"
              >
                {size}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">N/A</p>
        );
      },
    },
    {
      label: "Rating",
      render: (item) => {
        const rating = item.rating ?? 0;
        const count = item.reviewCount ?? 0;
        return (
          <div className="flex items-center justify-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            {count > 0 && (
              <span className="text-xs text-muted-foreground">({count})</span>
            )}
          </div>
        );
      },
    },
    {
      label: "",
      render: (item) => (
        <Button
          size="sm"
          className="w-full"
          onClick={() => item.onAddToCart?.(item.product)}
        >
          Add to Cart
        </Button>
      ),
    },
  ];

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* Label column header */}
            <th className="w-[120px] p-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" />
            {items.map((item) => (
              <th key={item.product.id} className="p-3 text-center" />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row.label || `action-${rowIdx}`}
              className={cn(
                "border-b border-border/50",
                rowIdx % 2 === 0 && "bg-muted/30"
              )}
            >
              <td className="p-3 text-left text-sm font-medium text-muted-foreground">
                {row.label}
              </td>
              {items.map((item) => (
                <td
                  key={item.product.id}
                  className="min-w-[180px] p-3 text-center align-middle"
                >
                  {row.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
