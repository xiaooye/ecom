"use client";

import { toast } from "sonner";
import Image from "next/image";

/**
 * Custom rich toast presets for e-commerce actions.
 * Each toast has a unique visual style matching the action type.
 */

/** Toast with product thumbnail shown when item added to cart */
export function toastCartAdded(product: {
  title: string;
  thumbnail?: string | null;
  price?: string;
}) {
  toast.custom(
    (id) => (
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-lg">
        {product.thumbnail && (
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Added to cart</p>
          <p className="truncate text-xs text-muted-foreground">
            {product.title}
          </p>
          {product.price && (
            <p className="text-xs font-semibold">{product.price}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          &times;
        </button>
      </div>
    ),
    { duration: 3000 }
  );
}

/** Toast for order status updates */
export function toastOrderStatus(orderId: string, status: string) {
  const statusEmoji: Record<string, string> = {
    confirmed: "✓",
    shipped: "📦",
    delivered: "🏠",
  };

  toast.success(
    `Order #${orderId} — ${status}`,
    {
      description: `Your order has been ${status.toLowerCase()}.`,
      icon: statusEmoji[status.toLowerCase()] || "📋",
      duration: 5000,
    }
  );
}

/** Toast for promo code applied */
export function toastPromoApplied(code: string, discount: string) {
  toast.success(`Code "${code}" applied!`, {
    description: `You save ${discount} on this order.`,
    duration: 4000,
  });
}

/** Toast for wishlist action */
export function toastWishlist(productName: string, added: boolean) {
  toast(added ? "Added to wishlist" : "Removed from wishlist", {
    description: productName,
    duration: 2000,
  });
}
