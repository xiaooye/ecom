"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/stores/cart-store";
import { getCart } from "@/lib/medusa/cart";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default function CartPage() {
  const cartId = useCartStore((s) => s.cartId);
  interface CartData {
    items?: Array<{
      id: string;
      title: string;
      quantity: number;
      thumbnail?: string | null;
      variant?: { title?: string };
      unit_price: number;
      total: number;
      product?: { handle?: string };
    }>;
    currency_code?: string;
    subtotal?: number;
    shipping_total?: number;
    tax_total?: number;
    total?: number;
  }
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!cartId) {
      setLoading(false);
      return;
    }
    try {
      const { cart: fetchedCart } = await getCart(cartId);
      setCart(fetchedCart as unknown as CartData);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items ?? [];
  const currencyCode = cart?.currency_code || "usd";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y">
            {items.map((item) => (
              <CartItem
                key={item.id}
                cartId={cartId!}
                item={item}
                currencyCode={currencyCode}
                onUpdate={fetchCart}
              />
            ))}
          </div>
        </div>

        <div>
          <CartSummary
            subtotal={cart?.subtotal}
            shippingTotal={cart?.shipping_total}
            taxTotal={cart?.tax_total}
            total={cart?.total}
            currencyCode={currencyCode}
          />
          <Separator className="my-4" />
          <Button asChild size="lg" className="w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="mt-2 w-full">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
