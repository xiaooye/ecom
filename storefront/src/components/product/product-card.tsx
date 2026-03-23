import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";

interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.variants?.[0]?.calculated_price;

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
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
      <div className="mt-3">
        <h3 className="text-sm font-medium group-hover:underline">
          {product.title}
        </h3>
        {price && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatPrice(price.calculated_amount, price.currency_code)}
          </p>
        )}
      </div>
    </Link>
  );
}
