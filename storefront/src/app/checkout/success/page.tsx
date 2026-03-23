import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-2xl font-bold">Order Confirmed!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for your purchase. You&apos;ll receive an email confirmation
        shortly.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button asChild>
          <Link href="/account/orders">View Orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
