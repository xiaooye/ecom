"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrder } from "@/lib/medusa/customer";
import { formatPrice } from "@/lib/format-price";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Awaited<ReturnType<typeof getOrder>>["order"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id)
      .then(({ order: fetchedOrder }) => setOrder(fetchedOrder))
      .catch(() => router.push("/account/orders"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) return null;

  const currencyCode = order.currency_code || "usd";

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => router.push("/account/orders")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Order #{order.display_id}
        </h2>
        <Badge variant="secondary">{order.status}</Badge>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        Placed on {new Date(order.created_at).toLocaleDateString()}
      </p>

      <Separator className="my-6" />

      <h3 className="font-semibold">Items</h3>
      <div className="mt-4 space-y-4">
        {(order.items ?? []).map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatPrice(item.total, currencyCode)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(order.subtotal, currencyCode)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{formatPrice(order.shipping_total, currencyCode)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(order.tax_total, currencyCode)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total, currencyCode)}</span>
        </div>
      </div>
    </div>
  );
}
