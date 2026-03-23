"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listOrders } from "@/lib/medusa/customer";
import { formatPrice } from "@/lib/format-price";

interface OrderSummary {
  id: string;
  display_id: number;
  created_at: string;
  status: string;
  total: number;
  currency_code: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listOrders()
      .then(({ orders: fetchedOrders }) =>
        setOrders((fetchedOrders ?? []) as unknown as OrderSummary[])
      )
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">No orders yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Once you place an order, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Order History</h2>
      <div className="mt-4 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
          >
            <div>
              <p className="font-medium">Order #{order.display_id}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{order.status}</Badge>
              <span className="font-medium">
                {formatPrice(order.total, order.currency_code)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
