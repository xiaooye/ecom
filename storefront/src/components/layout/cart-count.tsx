"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { getCart } from "@/lib/medusa/cart";

export function CartCount() {
  const cartId = useCartStore((s) => s.cartId);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!cartId) {
      setCount(0);
      return;
    }

    getCart(cartId)
      .then((res) => {
        const items = res.cart?.items ?? [];
        setCount(items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
      })
      .catch(() => setCount(0));
  }, [cartId]);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}
