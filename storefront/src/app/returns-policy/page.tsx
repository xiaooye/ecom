import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Our returns and exchanges policy.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Returns & Exchanges" }]} />
      <h1 className="font-display mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Returns & Exchanges
      </h1>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Return Policy
          </h2>
          <p className="mt-2">
            We accept returns within 30 days of delivery. Items must be unworn,
            unwashed, and in their original condition with all tags attached.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            How to Return
          </h2>
          <ol className="mt-2 list-decimal space-y-2 pl-6">
            <li>Log in to your account and go to Order History.</li>
            <li>Select the order and items you wish to return.</li>
            <li>Print the prepaid return label.</li>
            <li>Pack items securely and drop off at any carrier location.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Exchanges</h2>
          <p className="mt-2">
            Need a different size or color? Place a new order and return the
            original item. This ensures you get your new item as quickly as
            possible.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Refunds</h2>
          <p className="mt-2">
            Refunds are processed within 5-7 business days after we receive your
            return. The refund will be issued to your original payment method.
          </p>
        </section>
      </div>
    </div>
  );
}
