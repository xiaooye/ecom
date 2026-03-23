import type { Metadata } from "next";
import { Suspense } from "react";
import { getProductsList } from "@/lib/medusa/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { PaginationControls } from "@/components/product/pagination-controls";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete collection of clothing and accessories.",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const offset = Number(params.offset || "0");
  const order = (params.order as string) || "created_at";
  const q = params.q as string | undefined;
  const categoryId = params.category_id as string | undefined;

  let products: Array<{
    id: string;
    title: string;
    handle: string;
    thumbnail?: string | null;
    variants?: Array<{
      calculated_price?: {
        calculated_amount?: number;
        currency_code?: string;
      };
    }>;
  }> = [];
  let count = 0;

  try {
    const response = await getProductsList({
      limit: ITEMS_PER_PAGE,
      offset,
      order,
      q,
      ...(categoryId ? { category_id: [categoryId] } : {}),
    });
    products = response.products ?? [];
    count = response.count ?? 0;
  } catch {
    // Backend not available
  }

  return (
    <>
      <ProductGrid products={products} />
      <PaginationControls total={count} limit={ITEMS_PER_PAGE} />
    </>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-1 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage(props: ProductsPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Shop" }]} />

      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
        <Suspense>
          <ProductFilters />
        </Suspense>
      </div>

      <div className="mt-8">
        <Suspense fallback={<ProductsGridSkeleton />}>
          <ProductsContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
