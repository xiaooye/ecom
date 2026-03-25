"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, ShoppingBag, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useRegionStore } from "@/stores/region-store";
import { createCart, addToCart } from "@/lib/medusa/cart";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BundleProduct {
  product: Product;
  /** Specific variant to add. Falls back to first available variant. */
  variantId?: string;
}

interface ProductBundleProps {
  title?: string;
  products: BundleProduct[];
  /** Discount percentage for the bundle (0-100). */
  discountPercent?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * "Frequently Bought Together" product bundle component.
 * Shows 2-3 products connected by + signs, a total bundle price with
 * discount, and a single "Add Bundle to Cart" button.
 */
export function ProductBundle({
  title = "Frequently Bought Together",
  products,
  discountPercent = 0,
  className,
}: ProductBundleProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const { cartId, setCartId, openCart } = useCartStore();
  const regionId = useRegionStore((s) => s.regionId);

  // Resolve variant IDs and prices
  const resolved = products.map((bp) => {
    const variants = bp.product.variants ?? [];
    const variant = bp.variantId
      ? variants.find((v) => v.id === bp.variantId)
      : variants[0];

    const price = variant?.calculated_price;
    return {
      product: bp.product,
      variantId: variant?.id ?? null,
      amount: price?.calculated_amount ?? 0,
      currencyCode: price?.currency_code ?? "usd",
    };
  });

  const totalOriginal = resolved.reduce((sum, r) => sum + r.amount, 0);
  const discountAmount = Math.round(totalOriginal * (discountPercent / 100));
  const totalBundle = totalOriginal - discountAmount;
  const currencyCode = resolved[0]?.currencyCode ?? "usd";

  const allAvailable = resolved.every((r) => r.variantId !== null);

  const handleAddBundle = () => {
    if (!allAvailable) return;

    startTransition(async () => {
      try {
        let currentCartId = cartId;

        if (!currentCartId && regionId) {
          const { cart } = await createCart(regionId);
          currentCartId = cart.id;
          setCartId(cart.id);
        }

        if (!currentCartId) return;

        // Add each product sequentially
        for (const item of resolved) {
          if (item.variantId) {
            await addToCart(currentCartId, item.variantId, 1);
          }
        }

        setAdded(true);
        openCart();
        toast.success("Bundle added to cart");
        setTimeout(() => setAdded(false), 2000);
      } catch {
        toast.error("Failed to add bundle. Please try again.");
      }
    });
  };

  return (
    <div className={cn("rounded-2xl border bg-card p-6", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* Product row */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {resolved.map((item, i) => (
          <div key={item.product.id} className="flex items-center gap-2">
            {/* Plus separator */}
            {i > 0 && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            {/* Product mini card */}
            <motion.div
              className="flex w-28 flex-col items-center gap-2 rounded-xl border bg-background p-3 text-center sm:w-36"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                {item.product.thumbnail ? (
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <span className="line-clamp-2 text-xs font-medium leading-tight">
                {item.product.title}
              </span>

              <span className="text-xs text-muted-foreground">
                {formatPrice(item.amount, currencyCode)}
              </span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Price summary */}
      <div className="mt-6 flex flex-col items-center gap-1 border-t pt-4">
        {discountPercent > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground line-through">
              {formatPrice(totalOriginal, currencyCode)}
            </span>
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              Save {discountPercent}%
            </span>
          </div>
        )}
        <span className="text-xl font-bold">
          Bundle Price: {formatPrice(totalBundle, currencyCode)}
        </span>
      </div>

      {/* Add to cart */}
      <div className="mt-4 flex justify-center">
        <Button
          size="lg"
          className="w-full max-w-sm"
          onClick={handleAddBundle}
          disabled={!allAvailable || isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : added ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <ShoppingBag className="mr-2 h-4 w-4" />
          )}
          {added ? "Added!" : "Add Bundle to Cart"}
        </Button>
      </div>
    </div>
  );
}
