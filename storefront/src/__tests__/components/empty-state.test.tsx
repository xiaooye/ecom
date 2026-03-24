import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/shared/empty-state";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Create a mock icon component matching the LucideIcon interface
const MockIcon = ({ className, ...props }: Record<string, unknown>) => (
  <svg data-testid="mock-icon" className={className as string} {...props} />
);

describe("EmptyState", () => {
  it("renders the icon", () => {
    render(
      <EmptyState
        icon={MockIcon as any}
        title="No items"
        description="Your list is empty."
      />
    );
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(
      <EmptyState
        icon={MockIcon as any}
        title="No items found"
        description="Try a different search."
      />
    );
    expect(
      screen.getByRole("heading", { name: "No items found" })
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(
      <EmptyState
        icon={MockIcon as any}
        title="Empty"
        description="There are no results to display."
      />
    );
    expect(
      screen.getByText("There are no results to display.")
    ).toBeInTheDocument();
  });

  it("renders action button when actionLabel and actionHref provided", () => {
    render(
      <EmptyState
        icon={MockIcon as any}
        title="No products"
        description="Start shopping."
        actionLabel="Browse Products"
        actionHref="/products"
      />
    );
    const link = screen.getByRole("link", { name: "Browse Products" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/products");
  });

  it("does not render a button when no action props are provided", () => {
    render(
      <EmptyState
        icon={MockIcon as any}
        title="Empty"
        description="Nothing here."
      />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not render a button when only actionLabel is provided without actionHref", () => {
    render(
      <EmptyState
        icon={MockIcon as any}
        title="Empty"
        description="Nothing here."
        actionLabel="Go somewhere"
      />
    );
    expect(
      screen.queryByRole("link", { name: "Go somewhere" })
    ).not.toBeInTheDocument();
  });
});
