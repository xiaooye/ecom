import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
      <h1 className="font-display mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Privacy Policy</h1>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: March 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Information We Collect
          </h2>
          <p className="mt-2">
            We collect information you provide when creating an account, placing
            an order, or contacting us. This includes your name, email, shipping
            address, and payment information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Provide customer support</li>
            <li>Improve our products and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Data Security
          </h2>
          <p className="mt-2">
            We use industry-standard encryption (SSL/TLS) to protect your data
            in transit. Payment information is processed securely through Stripe
            and never stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Your Rights
          </h2>
          <p className="mt-2">
            You can access, update, or delete your personal information at any
            time through your account settings, or by contacting us at
            privacy@thread.store.
          </p>
        </section>
      </div>
    </div>
  );
}
