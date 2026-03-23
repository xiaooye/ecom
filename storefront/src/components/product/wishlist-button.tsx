"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string | null;
  };
  variant?: "icon" | "default";
}

export function WishlistButton({ product, variant = "icon" }: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasInWishlist = inWishlist;
    toggleItem(product);
    toast.success(wasInWishlist ? `${product.title} removed from wishlist` : `${product.title} added to wishlist`);
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleToggle}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "h-4 w-4",
            inWishlist && "fill-red-500 text-red-500"
          )}
        />
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleToggle} className="w-full">
      <Heart
        className={cn(
          "mr-2 h-4 w-4",
          inWishlist && "fill-red-500 text-red-500"
        )}
      />
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
