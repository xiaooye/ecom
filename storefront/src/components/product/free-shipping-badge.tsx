import { Truck } from "lucide-react";

export function FreeShippingBadge({ total }: { total?: number }) {
  const threshold = 5000; // $50 in cents
  const remaining = total != null ? Math.max(0, threshold - total) : threshold;

  if (remaining === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
        <Truck className="h-4 w-4" />
        You qualify for free shipping!
      </div>
    );
  }

  const pct = total != null ? Math.min(100, (total / threshold) * 100) : 0;

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Free shipping on orders over $50</span>
        <span className="font-medium">${(remaining / 100).toFixed(2)} away</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
