import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about WebStore and our mission.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "About Us" }]} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">About Us</h1>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          WebStore was founded with a simple mission: to bring quality,
          affordable clothing to everyone. We believe fashion should be
          accessible, sustainable, and fun.
        </p>
        <p>
          Our team carefully curates each collection, working with trusted
          suppliers who share our commitment to quality materials and ethical
          production practices.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Our Values</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Quality First:</strong> Every piece is made to last with
            premium materials.
          </li>
          <li>
            <strong>Fair Pricing:</strong> No markups, no games. Just honest
            prices.
          </li>
          <li>
            <strong>Sustainability:</strong> We&apos;re committed to reducing
            our environmental impact.
          </li>
          <li>
            <strong>Customer Focus:</strong> Your satisfaction is our top
            priority.
          </li>
        </ul>
      </div>
    </div>
  );
}
