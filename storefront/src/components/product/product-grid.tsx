import { ProductCard } from "./product-card";

interface Product {
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
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
