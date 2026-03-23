"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format-price";
import { useWishlistStore } from "@/stores/wishlist-store";
import { QuickView, QuickViewTrigger } from "./quick-view";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const variants = product.variants ?? [];
  const price = variants[0]?.calculated_price;
  const { isInWishlist, toggleItem } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

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
    <Link href={`/products/${product.handle}`} className="group relative">
      <motion.div
        className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={400}
            height={533}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}

        {/* Action buttons overlay */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleWishlist}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
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
        {price && (
          <p className="mt-1 text-sm font-semibold">
            {formatPrice(price.calculated_amount, price.currency_code)}
          </p>
        )}
      </div>
    </Link>
    <QuickView product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
