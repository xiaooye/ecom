import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/lib/data/products";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";
import { ProductJsonLd } from "@/components/shared/product-json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { TrackView } from "@/components/product/track-view";
import type { Product } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;

  const product = await getProduct(handle);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      images: product.thumbnail ? [product.thumbnail] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  const product = await getProduct(handle);
  if (!product) notFound();

  const price = product.variants?.[0]?.calculated_price;

  // Fetch related products
  const { products: allProducts } = await listProducts({ limit: 5 });
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/products" },
          { label: product.title },
        ]}
      />

      <div className="mt-6">
        <ProductDetail product={product as unknown as Product} />
      </div>

      <ProductJsonLd
        name={product.title}
        description={product.description || ""}
        image={(product.images ?? []).map((img: { url: string }) => img.url)}
        sku={product.variants?.[0]?.sku || undefined}
        price={price?.calculated_amount ?? undefined}
        currency={price?.currency_code || undefined}
        url={`/products/${handle}`}
      />

      <TrackView
        product={{
          id: product.id,
          title: product.title,
          handle: product.handle ?? handle,
          thumbnail: product.thumbnail,
        }}
      />

      {relatedProducts.length > 0 && (
        <>
          <Separator className="my-16" />
          <section>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              You May Also Like
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
