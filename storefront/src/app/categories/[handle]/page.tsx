import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategoryByHandle, getProductsList } from "@/lib/medusa/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { PaginationControls } from "@/components/product/pagination-controls";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface CategoryPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { handle } = await params;
  try {
    const category = await getCategoryByHandle(handle);
    if (!category) return { title: "Category Not Found" };
    return {
      title: `${category.name} — Shop`,
      description: `Browse our ${category.name} collection.`,
    };
  } catch {
    return { title: "Category Not Found" };
  }
}

async function CategoryProducts({
  categoryId,
  searchParams,
}: {
  categoryId: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const offset = Number(params.offset || "0");
  const order = (params.order as string) || "created_at";

  let products: Product[] = [];
  let count = 0;

  try {
    const response = await getProductsList({
      limit: ITEMS_PER_PAGE,
      offset,
      order,
      category_id: [categoryId],
    });
    products = (response.products ?? []) as Product[];
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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { handle } = await params;

  let category;
  try {
    category = await getCategoryByHandle(handle);
  } catch {
    notFound();
  }

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/products" },
          { label: category.name },
        ]}
      />

      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
        <Suspense>
          <ProductFilters />
        </Suspense>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                  <Skeleton className="mt-1 h-4 w-1/2" />
                </div>
              ))}
            </div>
          }
        >
          <CategoryProducts
            categoryId={category.id}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}
