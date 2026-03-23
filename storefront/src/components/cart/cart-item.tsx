"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { updateLineItem, removeLineItem } from "@/lib/medusa/cart";

interface CartItemProps {
  cartId: string;
  item: {
    id: string;
    title: string;
    quantity: number;
    thumbnail?: string | null;
    variant?: {
      title?: string;
    };
    unit_price: number;
    total: number;
    product?: {
      handle?: string;
    };
  };
  currencyCode: string;
  onUpdate: () => void;
}

export function CartItem({ cartId, item, currencyCode, onUpdate }: CartItemProps) {
  const [isPending, startTransition] = useTransition();

  const updateQuantity = (newQuantity: number) => {
    startTransition(async () => {
      try {
        if (newQuantity <= 0) {
          await removeLineItem(cartId, item.id);
        } else {
          await updateLineItem(cartId, item.id, newQuantity);
        }
        onUpdate();
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await removeLineItem(cartId, item.id);
        onUpdate();
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
    });
  };

  return (
    <div className="flex gap-4 py-4">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium">{item.title}</h3>
            {item.variant?.title && (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.variant.title}
              </p>
            )}
          </div>
          <p className="text-sm font-medium">
            {formatPrice(item.total, currencyCode)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.quantity - 1)}
              disabled={isPending}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">
              {isPending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.quantity + 1)}
              disabled={isPending}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
