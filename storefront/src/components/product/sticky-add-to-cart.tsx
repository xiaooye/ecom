"use client";

import { useEffect, useState, useTransition } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useCartStore } from "@/stores/cart-store";
import { useRegionStore } from "@/stores/region-store";
import { createCart, addToCart } from "@/lib/medusa/cart";

interface StickyAddToCartProps {
  title: string;
  price?: number | null;
  currencyCode?: string;
  variantId: string | null;
  available: boolean;
}

export function StickyAddToCart({
  title,
  price,
  currencyCode = "usd",
  variantId,
  available,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { cartId, setCartId, openCart } = useCartStore();
  const regionId = useRegionStore((s) => s.regionId);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAdd = () => {
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
        openCart();
        toast.success(`${title} added to cart`);
      } catch {
        toast.error("Failed to add to cart");
      }
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-16 left-0 right-0 z-30 border-t bg-background/95 shadow-lg backdrop-blur-lg md:hidden"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{title}</p>
              {price != null && (
                <p className="text-sm font-bold">
                  {formatPrice(price, currencyCode)}
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="shrink-0"
              disabled={!variantId || !available || isPending}
              onClick={handleAdd}
            >
              {isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="mr-1 h-4 w-4" />
              )}
              {available ? "Add to Cart" : "Sold Out"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
