import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AddToCart } from "@/components/product/add-to-cart";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ShoppingBag: ({ className, ...props }: Record<string, unknown>) => (
    <svg
      data-testid="shopping-bag-icon"
      className={className as string}
      {...props}
    />
  ),
  Loader2: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="loader-icon" className={className as string} {...props} />
  ),
  Check: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="check-icon" className={className as string} {...props} />
  ),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock cart-store
vi.mock("@/stores/cart-store", () => ({
  useCartStore: () => ({
    cartId: null,
    setCartId: vi.fn(),
    openCart: vi.fn(),
  }),
}));

// Mock region-store
vi.mock("@/stores/region-store", () => ({
  useRegionStore: (selector: (s: { regionId: string | null }) => unknown) =>
    selector({ regionId: "reg_us" }),
}));

// Mock medusa cart functions
vi.mock("@/lib/medusa/cart", () => ({
  createCart: vi.fn(),
  addToCart: vi.fn(),
}));

describe("AddToCart", () => {
  it('shows "Add to Cart" text', () => {
    render(<AddToCart variantId="var_1" available={true} />);
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it('shows "Out of Stock" when not available', () => {
    render(<AddToCart variantId="var_1" available={false} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("button is disabled when no variantId", () => {
    render(<AddToCart variantId={null} available={true} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows ShoppingBag icon", () => {
    render(<AddToCart variantId="var_1" available={true} />);
    expect(screen.getByTestId("shopping-bag-icon")).toBeInTheDocument();
  });

  it("out of stock button is disabled", () => {
    render(<AddToCart variantId="var_1" available={false} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("button is enabled when variantId is provided and available", () => {
    render(<AddToCart variantId="var_1" available={true} />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("renders as full-width button", () => {
    render(<AddToCart variantId="var_1" available={true} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-full");
  });
});
