import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductBadge } from "@/components/product/product-badge";

describe("ProductBadge", () => {
  it('renders "New" for new variant', () => {
    render(<ProductBadge variant="new" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it('renders "Sold Out" for out-of-stock variant', () => {
    render(<ProductBadge variant="out-of-stock" />);
    expect(screen.getByText("Sold Out")).toBeInTheDocument();
  });

  it('renders "Sale" for sale variant', () => {
    render(<ProductBadge variant="sale" />);
    expect(screen.getByText("Sale")).toBeInTheDocument();
  });

  it("applies correct CSS class for new variant", () => {
    render(<ProductBadge variant="new" />);
    const badge = screen.getByText("New");
    expect(badge.className).toContain("bg-emerald-500");
  });

  it("applies correct CSS class for sale variant", () => {
    render(<ProductBadge variant="sale" />);
    const badge = screen.getByText("Sale");
    expect(badge.className).toContain("bg-red-500");
  });

  it("applies correct CSS class for out-of-stock variant", () => {
    render(<ProductBadge variant="out-of-stock" />);
    const badge = screen.getByText("Sold Out");
    expect(badge.className).toContain("bg-neutral-500");
  });
});
