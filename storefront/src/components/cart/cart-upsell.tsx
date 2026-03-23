"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpsellProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  price?: string;
}

const sampleUpsells: UpsellProduct[] = [
  { id: "u1", title: "Matching Belt", handle: "belt", price: "$24.99" },
  { id: "u2", title: "Cotton Socks (3-pack)", handle: "socks", price: "$12.99" },
  { id: "u3", title: "Canvas Tote Bag", handle: "tote", price: "$19.99" },
];

export function CartUpsell() {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Complete Your Look</h3>
      <div className="mt-3 space-y-3">
        {sampleUpsells.map((product) => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/60">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[8px] text-muted-foreground">
                  {product.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${product.handle}`}
                className="text-xs font-medium hover:underline truncate block"
              >
                {product.title}
              </Link>
              <p className="text-xs text-muted-foreground">{product.price}</p>
            </div>
            <Button variant="outline" size="icon" className="h-7 w-7 shrink-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
