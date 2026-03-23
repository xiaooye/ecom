"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getProductsList } from "@/lib/medusa/products";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Array<{
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
  }>>([]);
  const [isPending, startTransition] = useTransition();
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = (q: string) => {
    startTransition(async () => {
      try {
        const response = await getProductsList({ q, limit: 20 });
        setProducts(response.products ?? []);
      } catch {
        setProducts([]);
      }
      setSearched(true);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Search</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-10"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </button>
      </form>

      <div className="mt-8">
        {isPending ? (
          <p className="text-muted-foreground">Searching...</p>
        ) : searched ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {products.length} result{products.length !== 1 ? "s" : ""} for
              &ldquo;{initialQuery || query}&rdquo;
            </p>
            <ProductGrid products={products} />
          </>
        ) : null}
      </div>
    </div>
  );
}
