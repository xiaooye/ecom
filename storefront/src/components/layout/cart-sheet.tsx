"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { getCart, updateLineItem, removeLineItem } from "@/lib/medusa/cart";
import { formatPrice } from "@/lib/format-price";

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  thumbnail?: string | null;
  variant?: { title?: string | null };
  total: number;
}

export function CartSheet() {
  const { cartId, open, closeCart } = useCartStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [currencyCode, setCurrencyCode] = useState("usd");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchCart = useCallback(async () => {
    if (!cartId) return;
    setLoading(true);
    try {
      const { cart } = await getCart(cartId);
      setItems((cart.items ?? []) as unknown as CartItem[]);
      setSubtotal(cart.subtotal ?? 0);
      setCurrencyCode(cart.currency_code ?? "usd");
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    if (open && cartId) fetchCart();
  }, [open, cartId, fetchCart]);

  const updateQty = (itemId: string, qty: number) => {
    if (!cartId) return;
    startTransition(async () => {
      try {
        if (qty <= 0) {
          await removeLineItem(cartId, itemId);
        } else {
          await updateLineItem(cartId, itemId, qty);
        }
        await fetchCart();
      } catch {
        // ignore
      }
    });
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={closeCart} asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 py-3"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {item.title}
                        </p>
                        {item.variant?.title && (
                          <p className="text-xs text-muted-foreground">
                            {item.variant.title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-md border text-xs hover:bg-muted"
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            disabled={isPending}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-md border text-xs hover:bg-muted"
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            disabled={isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {formatPrice(item.total, currencyCode)}
                          </span>
                          <button
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => updateQty(item.id, 0)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(subtotal, currencyCode)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" onClick={closeCart}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  onClick={closeCart}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
