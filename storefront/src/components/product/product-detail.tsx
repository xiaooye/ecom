"use client";

import { useState, useMemo } from "react";
import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { AddToCart } from "./add-to-cart";
import { QuantitySelector } from "./quantity-selector";
import { WishlistButton } from "./wishlist-button";
import { ProductTabs } from "./product-tabs";
import { ShareButtons } from "./share-buttons";
import { SizeChartModal } from "./size-chart-modal";
import { BackInStock } from "./back-in-stock";
import { formatPrice } from "@/lib/format-price";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const options = product.options ?? [];
  const images = product.images ?? [];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      options.forEach((opt) => {
        if (opt.values.length > 0) {
          initial[opt.title] = opt.values[0].value;
        }
      });
      return initial;
    }
  );

  const selectedVariant = useMemo(() => {
    const variants = product.variants ?? [];
    return variants.find((v) => {
      if (!v.options) return false;
      return Object.entries(selectedOptions).every(
        ([key, value]) => v.options![key] === value
      );
    });
  }, [product.variants, selectedOptions]);

  const [quantity, setQuantity] = useState(1);
  const price = selectedVariant?.calculated_price;
  const inStock = (selectedVariant?.inventory_quantity ?? 0) > 0;

  const handleOptionChange = (title: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [title]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery images={images} title={product.title} />

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
            <ShareButtons title={product.title} handle={product.handle} />
          </div>
          {price && (
            <p className="mt-2 text-2xl">
              {formatPrice(price.calculated_amount, price.currency_code)}
            </p>
          )}
        </div>

        {options.length > 0 && (
          <>
            <Separator />
            <div className="flex items-end justify-between">
              <VariantSelector
                options={options}
                selectedOptions={selectedOptions}
                onOptionChange={handleOptionChange}
              />
            </div>
            <SizeChartModal />
          </>
        )}

        <Separator />

        {inStock ? (
          <>
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <AddToCart
              variantId={selectedVariant?.id ?? null}
              available={inStock}
              productTitle={product.title}
              quantity={quantity}
            />
          </>
        ) : (
          <BackInStock />
        )}

        <WishlistButton
          product={{
            id: product.id,
            title: product.title,
            handle: "",
            thumbnail: images[0]?.url ?? null,
          }}
          variant="default"
        />

        {selectedVariant?.sku && (
          <p className="text-sm text-muted-foreground">
            SKU: {selectedVariant.sku}
          </p>
        )}

      </div>

      {/* Full-width tabs below the grid */}
      <div className="col-span-full">
        <ProductTabs description={product.description} />
      </div>
    </div>
  );
}
