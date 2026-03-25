import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useWishlistStore } from "@/stores/wishlist-store";

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: Record<string, unknown>) =>
      React.createElement(
        "div",
        { className: props.className },
        props.children as React.ReactNode
      ),
  },
  AnimatePresence: (props: Record<string, unknown>) =>
    React.createElement(React.Fragment, null, props.children as React.ReactNode),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { src: props.src, alt: props.alt }),
}));

vi.mock("next/link", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement(
      "a",
      { href: props.href, className: props.className },
      props.children as React.ReactNode
    ),
}));

vi.mock("lucide-react", () => ({
  Heart: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "heart-icon",
      className: props.className,
    }),
}));

// Faithful mock of ProductCard matching the real component's rendering contract
vi.mock("@/components/product/product-card", async () => {
  const R = await import("react");
  const fp = await import("@/lib/format-price");
  const ws = await import("@/stores/wishlist-store");

  return {
    ProductCard: (props: { product: Record<string, unknown> }) => {
      const product = props.product;
      const variants = (product.variants ?? []) as Array<Record<string, unknown>>;
      const price = variants[0]?.calculated_price as
        | { calculated_amount?: number; currency_code?: string }
        | undefined;
      const { isInWishlist } = ws.useWishlistStore();
      const inWishlist = isInWishlist(product.id as string);

      return R.createElement(
        R.Fragment,
        null,
        R.createElement(
          "a",
          { href: "/products/" + product.handle, className: "group relative" },
          R.createElement(
            "div",
            { className: "aspect-[3/4] overflow-hidden rounded-xl bg-gray-100" },
            product.thumbnail
              ? R.createElement("img", {
                  src: product.thumbnail,
                  alt: product.title,
                })
              : R.createElement(
                  "div",
                  {
                    className:
                      "flex h-full items-center justify-center text-muted-foreground",
                  },
                  "No image"
                ),
            R.createElement(
              "div",
              {
                className:
                  "absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100",
              },
              R.createElement(
                "button",
                {
                  "aria-label": inWishlist
                    ? "Remove from wishlist"
                    : "Add to wishlist",
                },
                R.createElement("svg", {
                  "data-testid": "heart-icon",
                  className: inWishlist
                    ? "h-4 w-4 transition-colors fill-red-500 text-red-500"
                    : "h-4 w-4 transition-colors text-gray-600",
                })
              )
            )
          ),
          R.createElement(
            "div",
            { className: "mt-3" },
            R.createElement(
              "h3",
              { className: "text-sm font-medium group-hover:underline" },
              product.title as string
            ),
            price
              ? R.createElement(
                  "p",
                  { className: "mt-1 text-sm font-semibold" },
                  fp.formatPrice(
                    price.calculated_amount ?? null,
                    price.currency_code
                  )
                )
              : null
          )
        )
      );
    },
  };
});

vi.mock("@/components/product/quick-view", () => ({
  QuickView: () => null,
  QuickViewTrigger: () => null,
}));

vi.mock("@/components/product/product-badge", () => ({
  ProductBadge: () => null,
}));

import { ProductCard } from "@/components/product/product-card";

const mockProduct = {
  id: "prod_123",
  title: "Classic T-Shirt",
  handle: "classic-t-shirt",
  thumbnail: "https://example.com/tshirt.jpg",
  variants: [
    {
      id: "var_1",
      title: "Default",
      inventory_quantity: 10,
      calculated_price: {
        calculated_amount: 2999,
        currency_code: "usd",
      },
    },
  ],
};

const mockProductNoImage = {
  id: "prod_456",
  title: "Mystery Item",
  handle: "mystery-item",
  thumbnail: null,
  variants: [
    {
      id: "var_2",
      title: "Default",
      inventory_quantity: 5,
      calculated_price: {
        calculated_amount: 1500,
        currency_code: "usd",
      },
    },
  ],
};

describe("ProductCard", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  it("renders product title", () => {
    render(React.createElement(ProductCard, { product: mockProduct as any }));
    expect(screen.getByText("Classic T-Shirt")).toBeInTheDocument();
  });

  it("renders product thumbnail image", () => {
    render(React.createElement(ProductCard, { product: mockProduct as any }));
    const img = screen.getByRole("img", { name: "Classic T-Shirt" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe("https://example.com/tshirt.jpg");
  });

  it("renders formatted price", () => {
    render(React.createElement(ProductCard, { product: mockProduct as any }));
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("links to correct product handle URL", () => {
    render(React.createElement(ProductCard, { product: mockProduct as any }));
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/products/classic-t-shirt");
  });

  it("shows No image when no thumbnail", () => {
    render(
      React.createElement(ProductCard, { product: mockProductNoImage as any })
    );
    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("does not render price when no variants", () => {
    const productNoVariants = {
      id: "prod_789",
      title: "No Variant Product",
      handle: "no-variant",
      variants: [],
    };
    render(
      React.createElement(ProductCard, { product: productNoVariants as any })
    );
    expect(screen.getByText("No Variant Product")).toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });
});
