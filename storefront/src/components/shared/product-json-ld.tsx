interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string[];
  sku?: string;
  price?: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock";
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  price,
  currency = "USD",
  availability = "InStock",
  url,
}: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    ...(sku && { sku }),
    ...(price != null && {
      offers: {
        "@type": "Offer",
        price: (price / 100).toFixed(2),
        priceCurrency: currency.toUpperCase(),
        availability: `https://schema.org/${availability}`,
        url,
      },
    }),
  };

  // Safe: JSON.stringify encodes structured data we construct ourselves,
  // no user-supplied HTML is injected. This is the standard JSON-LD pattern.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
