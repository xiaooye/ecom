"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VariantSelector } from "./variant-selector";
import { AddToCart } from "./add-to-cart";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/lib/types";

interface QuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickView({ product, open, onOpenChange }: QuickViewProps) {
  const options = (product.options ?? []).filter(
    (o) => o.values && o.values.length > 0
  );

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      options.forEach((opt) => {
        if (opt.values.length > 0) {
          initial[opt.title] = opt.values[0].value;
        }
      });
      return initial;
    }
  );

  const selectedVariant = useMemo(() => {
    const variants = product.variants ?? [];
    return variants.find((v) => {
      if (!v.options) return false;
      return Object.entries(selectedOptions).every(
        ([key, value]) => v.options![key] === value
      );
    });
  }, [product.variants, selectedOptions]);

  const price = selectedVariant?.calculated_price;
  const inStock = (selectedVariant?.inventory_quantity ?? 0) > 0;
  const thumbnail = product.thumbnail || (product.images?.[0]?.url ?? null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="aspect-square bg-gray-100">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={product.title}
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 p-6">
            <div>
              <h2 className="text-xl font-bold">{product.title}</h2>
              {price && (
                <p className="mt-1 text-lg font-semibold">
                  {formatPrice(price.calculated_amount, price.currency_code)}
                </p>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {product.description}
              </p>
            )}

            {options.length > 0 && (
              <>
                <Separator />
                <VariantSelector
                  options={options}
                  selectedOptions={selectedOptions}
                  onOptionChange={(title, value) =>
                    setSelectedOptions((prev) => ({ ...prev, [title]: value }))
                  }
                />
              </>
            )}

            <div className="mt-auto flex flex-col gap-2">
              <AddToCart
                variantId={selectedVariant?.id ?? null}
                available={inStock}
                productTitle={product.title}
              />
              <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
                <Link href={`/products/${product.handle}`}>View Full Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Trigger button to open quick view */
export function QuickViewTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
      aria-label="Quick view"
    >
      <Eye className="h-4 w-4 text-gray-600" />
    </button>
  );
}
