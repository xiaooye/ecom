"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCompareStore } from "@/stores/compare-store";
import { formatPrice } from "@/lib/format-price";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default function ComparePage() {
  const { products, removeProduct } = useCompareStore();

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-16">
          <ArrowLeftRight className="h-16 w-16 text-muted-foreground" />
          <h1 className="font-display mt-4 text-2xl font-bold">No products to compare</h1>
          <p className="mt-2 text-muted-foreground">
            Add products to compare from the shop.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const rows = [
    { label: "Price", render: (p: typeof products[0]) => {
      const price = (p.variants ?? [])[0]?.calculated_price;
      return price ? formatPrice(price.calculated_amount, price.currency_code) : "—";
    }},
    { label: "Variants", render: (p: typeof products[0]) => `${(p.variants ?? []).length} options` },
    { label: "Description", render: (p: typeof products[0]) => p.description || "—" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Compare" }]} />
      <h1 className="font-display mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Compare Products
      </h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="w-32" />
              {products.map((p) => (
                <th key={p.id} className="px-4 pb-6 text-center">
                  <div className="mx-auto w-40">
                    <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
                      {p.thumbnail ? (
                        <Image
                          src={p.thumbnail}
                          alt={p.title}
                          width={160}
                          height={160}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/products/${p.handle}`}
                      className="mt-2 block text-sm font-semibold hover:underline"
                    >
                      {p.title}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-xs text-muted-foreground"
                      onClick={() => removeProduct(p.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="border-t py-4 pr-4 text-sm font-medium text-muted-foreground">
                  {row.label}
                </td>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="border-t px-4 py-4 text-center text-sm"
                  >
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
