"use client";

import { useState, useTransition } from "react";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { createCart, addToCart } from "@/lib/medusa/cart";
import { useRegionStore } from "@/stores/region-store";

interface AddToCartProps {
  variantId: string | null;
  available: boolean;
  productTitle?: string;
}

export function AddToCart({ variantId, available, productTitle }: AddToCartProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const { cartId, setCartId, openCart } = useCartStore();
  const regionId = useRegionStore((s) => s.regionId);

  const handleAddToCart = () => {
    if (!variantId) return;

    startTransition(async () => {
      try {
        let currentCartId = cartId;

        if (!currentCartId && regionId) {
          const { cart } = await createCart(regionId);
          currentCartId = cart.id;
          setCartId(cart.id);
        }

        if (!currentCartId) return;

        await addToCart(currentCartId, variantId, 1);
        setAdded(true);
        openCart();
        toast.success(productTitle ? `${productTitle} added to cart` : "Added to cart");
        setTimeout(() => setAdded(false), 2000);
      } catch {
        toast.error("Failed to add to cart. Please try again.");
      }
    });
  };

  if (!available) {
    return (
      <Button disabled size="lg" className="w-full">
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAddToCart}
      disabled={!variantId || isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : added ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <ShoppingBag className="mr-2 h-4 w-4" />
      )}
      {added ? "Added!" : "Add to Cart"}
    </Button>
  );
}
