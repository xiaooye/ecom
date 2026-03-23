import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustBadges } from "@/components/home/trust-badges";
import { Testimonials } from "@/components/home/testimonials";
import { StatsSection } from "@/components/home/stats-section";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { Skeleton } from "@/components/ui/skeleton";

function ProductsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-48" />
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-1 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryGrid />
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <StatsSection />
      <Testimonials />
      <NewsletterCta />
    </>
  );
}
