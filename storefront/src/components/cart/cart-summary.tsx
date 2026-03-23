import { formatPrice } from "@/lib/format-price";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal?: number;
  shippingTotal?: number;
  taxTotal?: number;
  total?: number;
  currencyCode: string;
}

export function CartSummary({
  subtotal = 0,
  shippingTotal,
  taxTotal,
  total = 0,
  currencyCode,
}: CartSummaryProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal, currencyCode)}</span>
        </div>
        {shippingTotal != null && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {shippingTotal === 0
                ? "Free"
                : formatPrice(shippingTotal, currencyCode)}
            </span>
          </div>
        )}
        {taxTotal != null && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatPrice(taxTotal, currencyCode)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(total, currencyCode)}</span>
        </div>
      </div>
    </div>
  );
}
