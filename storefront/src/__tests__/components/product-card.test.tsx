import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/product/product-card";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { Product } from "@/lib/types";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: React.PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
    header: ({
      children,
      className,
      ...props
    }: React.PropsWithChildren<{ className?: string }>) => (
      <header className={className}>{children}</header>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => <img src={src} alt={alt} />,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string; className?: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Heart: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="heart-icon" className={className as string} {...props} />
  ),
  Eye: (props: Record<string, unknown>) => (
    <svg data-testid="eye-icon" {...props} />
  ),
}));

// Mock quick-view component
vi.mock("@/components/product/quick-view", () => ({
  QuickView: () => null,
  QuickViewTrigger: () => null,
}));

// Mock product-badge component
vi.mock("@/components/product/product-badge", () => ({
  ProductBadge: ({ variant }: { variant: string }) => (
    <span data-testid={`badge-${variant}`}>{variant}</span>
  ),
}));

const mockProduct: Product = {
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

const mockProductNoImage: Product = {
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
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Classic T-Shirt")).toBeInTheDocument();
  });

  it("renders product thumbnail image", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole("img", { name: "Classic T-Shirt" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe("https://example.com/tshirt.jpg");
  });

  it("renders formatted price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("links to correct product handle URL", () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/products/classic-t-shirt");
  });

  it('shows "No image" when no thumbnail', () => {
    render(<ProductCard product={mockProductNoImage} />);
    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("does not render price when no variants", () => {
    const productNoVariants: Product = {
      id: "prod_789",
      title: "No Variant Product",
      handle: "no-variant",
      variants: [],
    };
    render(<ProductCard product={productNoVariants} />);
    expect(screen.getByText("No Variant Product")).toBeInTheDocument();
    // Should not have any price text
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });
});
