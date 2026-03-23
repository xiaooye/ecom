import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">
            New Season
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            New Season Arrivals
          </h1>
          <p className="mt-4 text-lg text-neutral-300">
            Discover the latest trends in fashion. Quality clothing crafted for
            comfort and style.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-neutral-200">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/categories/shirts">Browse Shirts</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
