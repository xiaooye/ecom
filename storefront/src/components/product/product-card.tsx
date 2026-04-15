"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format-price";
import { useWishlistStore } from "@/stores/wishlist-store";
import { QuickView, QuickViewTrigger } from "./quick-view";
import { ProductBadge } from "./product-badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const variants = product.variants ?? [];
  const price = variants[0]?.calculated_price;
  const { isInWishlist, toggleItem } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  // Secondary image for hover swap
  const images = product.images ?? [];
  const secondaryImage = images.length > 1 ? images[1].url : null;

  // Color options for swatches
  const colorOption = product.options?.find(
    (o) => o.title.toLowerCase() === "color",
  );

  // Determine badge
  const allOutOfStock =
    variants.length > 0 &&
    variants.every((v) => (v.inventory_quantity ?? 0) <= 0);
  const isNew = product.created_at
    ? Date.now() - new Date(product.created_at as string).getTime() <
      14 * 86400000
    : false;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      title: product.title,
      handle: product.handle,
      thumbnail: product.thumbnail,
    });
  };

  return (
    <>
      <Link
        href={`/products/${product.handle}`}
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="card-hover aspect-[3/4] overflow-hidden rounded-xl bg-secondary"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {allOutOfStock && <ProductBadge variant="out-of-stock" />}
          {!allOutOfStock && isNew && <ProductBadge variant="new" />}

          {product.thumbnail ? (
            <div className="relative h-full w-full">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={400}
                height={533}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-500",
                  isHovered && secondaryImage ? "opacity-0" : "opacity-100",
                )}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={`${product.title} — alternate view`}
                  width={400}
                  height={533}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                />
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="font-display text-4xl font-bold text-muted-foreground/40">
                {product.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Action buttons overlay */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleWishlist}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-all hover:bg-background hover:shadow-md"
              aria-label={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  inWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground",
                )}
              />
            </button>
            <QuickViewTrigger onClick={() => setQuickViewOpen(true)} />
          </div>
        </motion.div>

        <div className="mt-3">
          <h3 className="text-sm font-medium group-hover:underline">
            {product.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {price && (
              <p className="text-sm font-semibold">
                {formatPrice(price.calculated_amount, price.currency_code)}
              </p>
            )}
          </div>
          {/* Color swatches */}
          {colorOption && colorOption.values.length > 1 && (
            <div className="mt-2 flex gap-1.5">
              {colorOption.values.map((v) => (
                <span
                  key={v.value}
                  title={v.value}
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: colorNameToHex(v.value) }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
      <QuickView
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}

/** Maps common color names to hex values for the swatch dots */
function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    black: "#1a1a1a",
    white: "#f5f5f5",
    navy: "#1e3a5f",
    blue: "#3b6ea5",
    indigo: "#3f4d7a",
    olive: "#5c6b3c",
    khaki: "#c3b091",
    sand: "#c9b89e",
    charcoal: "#36454f",
    oatmeal: "#d8cfc0",
    cream: "#f5f0e1",
    sage: "#8a9a5b",
    forest: "#2d4a2c",
    natural: "#e8dcc8",
    tan: "#d2b48c",
    "dark brown": "#4a3728",
    camel: "#c19a6b",
    burgundy: "#6c2a2a",
  };
  return map[name.toLowerCase()] ?? "#9ca3af";
}
