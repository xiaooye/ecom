"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Wishlist" }]} />
        <div className="flex flex-col items-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Your wishlist is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Save items you love for later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Wishlist ({items.length})
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            <Link href={`/products/${item.handle}`}>
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={400}
                    height={533}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <h3 className="mt-3 text-sm font-medium group-hover:underline">
                {item.title}
              </h3>
            </Link>

            <div className="mt-2 flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/products/${item.handle}`}>
                  <ShoppingBag className="mr-2 h-3 w-3" />
                  View
                </Link>
              </Button>
              <WishlistButton product={item} variant="icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
