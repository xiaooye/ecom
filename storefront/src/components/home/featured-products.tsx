import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";

export async function FeaturedProducts() {
  const { products } = await listProducts({ limit: 8 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Featured Products</h2>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-medium hover:underline"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
