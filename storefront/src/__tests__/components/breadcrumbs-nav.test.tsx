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
}));

describe("Breadcrumbs navigation", () => {
  const items = [
    { label: "Shop", href: "/products" },
    { label: "Outerwear", href: "/products/outerwear" },
    { label: "Winter Jacket" },
  ];

  it("home icon links to /", () => {
    render(<Breadcrumbs items={items} />);

    const homeIcon = screen.getByTestId("home-icon");
    const homeLink = homeIcon.closest("a");
    expect(homeLink).not.toBeNull();
    expect(homeLink?.getAttribute("href")).toBe("/");
  });

  it("items with href are clickable links", () => {
    render(<Breadcrumbs items={items} />);

    const shopLink = screen.getByText("Shop");
    expect(shopLink.closest("a")).not.toBeNull();
    expect(shopLink.closest("a")?.getAttribute("href")).toBe("/products");

    const outerwearLink = screen.getByText("Outerwear");
    expect(outerwearLink.closest("a")).not.toBeNull();
    expect(outerwearLink.closest("a")?.getAttribute("href")).toBe(
      "/products/outerwear"
    );
  });

  it("items without href are plain text (current page)", () => {
    render(<Breadcrumbs items={items} />);

    const currentPage = screen.getByText("Winter Jacket");
    expect(currentPage.tagName).toBe("SPAN");
    expect(currentPage.closest("a")).toBeNull();
  });

  it("renders correct chevron separators between items", () => {
    render(<Breadcrumbs items={items} />);

    const chevrons = screen.getAllByTestId("chevron-icon");
    // One chevron per breadcrumb item (3 items = 3 chevrons, each before its label)
    expect(chevrons).toHaveLength(items.length);
  });

  it("has nav element with Breadcrumb aria-label", () => {
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();
  });

  it("renders a single item without href as plain text", () => {
    render(<Breadcrumbs items={[{ label: "Current Page" }]} />);

    const item = screen.getByText("Current Page");
    expect(item.tagName).toBe("SPAN");
    expect(item.closest("a")).toBeNull();
  });

  it("renders empty breadcrumbs with just home icon", () => {
    render(<Breadcrumbs items={[]} />);
    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.queryAllByTestId("chevron-icon")).toHaveLength(0);
  });
});
