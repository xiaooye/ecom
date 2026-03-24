import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Home: (props: Record<string, unknown>) => (
    <svg data-testid="home-icon" {...props} />
  ),
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="chevron-icon" {...props} />
  ),
  Star: (props: Record<string, unknown>) => (
    <svg data-testid="star-icon" {...props} />
  ),
  StarHalf: (props: Record<string, unknown>) => (
    <svg data-testid="star-half-icon" {...props} />
  ),
  Minus: (props: Record<string, unknown>) => (
    <svg data-testid="minus-icon" {...props} />
  ),
  Plus: (props: Record<string, unknown>) => (
    <svg data-testid="plus-icon" {...props} />
  ),
}));

describe("Breadcrumbs", () => {
  const items = [
    { label: "Products", href: "/products" },
    { label: "T-Shirts", href: "/products/t-shirts" },
    { label: "Classic Tee" },
  ];

  it("renders home icon", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
  });

  it("renders all items", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
  });

  it("last item is not a link", () => {
    render(<Breadcrumbs items={items} />);
    const lastItem = screen.getByText("Classic Tee");
    expect(lastItem.tagName).toBe("SPAN");
    expect(lastItem.closest("a")).toBeNull();
  });

  it("middle items are links", () => {
    render(<Breadcrumbs items={items} />);
    const productsLink = screen.getByText("Products");
    expect(productsLink.closest("a")).not.toBeNull();
    expect(productsLink.closest("a")?.getAttribute("href")).toBe("/products");

    const tShirtsLink = screen.getByText("T-Shirts");
    expect(tShirtsLink.closest("a")).not.toBeNull();
    expect(tShirtsLink.closest("a")?.getAttribute("href")).toBe(
      "/products/t-shirts"
    );
  });

  it("generates JSON-LD script tag", () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const jsonLd = JSON.parse(script!.textContent || "{}");
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(4); // Home + 3 items
  });
});
