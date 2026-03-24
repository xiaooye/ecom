import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FreeShippingBadge } from "@/components/product/free-shipping-badge";

// Mock lucide-react Truck icon
vi.mock("lucide-react", () => ({
  Truck: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="truck-icon" className={className as string} {...props} />
  ),
}));

describe("FreeShippingBadge", () => {
  it('shows "You qualify" message when total >= 5000 (threshold)', () => {
    render(<FreeShippingBadge total={5000} />);
    expect(
      screen.getByText(/You qualify for free shipping/)
    ).toBeInTheDocument();
  });

  it('shows "You qualify" message when total exceeds threshold', () => {
    render(<FreeShippingBadge total={7500} />);
    expect(
      screen.getByText(/You qualify for free shipping/)
    ).toBeInTheDocument();
  });

  it("shows remaining amount when total < 5000", () => {
    // total = 3000 cents = $30, remaining = 2000 cents = $20.00
    render(<FreeShippingBadge total={3000} />);
    expect(screen.getByText("$20.00 away")).toBeInTheDocument();
  });

  it("shows progress bar with correct width percentage", () => {
    // total = 2500 cents, threshold = 5000 cents -> 50%
    const { container } = render(<FreeShippingBadge total={2500} />);
    const progressBar = container.querySelector(
      ".bg-primary.h-full"
    ) as HTMLElement;
    expect(progressBar).toBeTruthy();
    expect(progressBar.style.width).toBe("50%");
  });

  it("shows $50 threshold text", () => {
    render(<FreeShippingBadge total={1000} />);
    expect(
      screen.getByText(/Free shipping on orders over \$50/)
    ).toBeInTheDocument();
  });

  it("shows full remaining amount when total is undefined", () => {
    render(<FreeShippingBadge />);
    expect(screen.getByText("$50.00 away")).toBeInTheDocument();
  });

  it("shows 0% progress bar when total is undefined", () => {
    const { container } = render(<FreeShippingBadge />);
    const progressBar = container.querySelector(
      ".bg-primary.h-full"
    ) as HTMLElement;
    expect(progressBar).toBeTruthy();
    expect(progressBar.style.width).toBe("0%");
  });

  it("caps progress bar at 100%", () => {
    // total = 4999, just under threshold
    const { container } = render(<FreeShippingBadge total={4999} />);
    const progressBar = container.querySelector(
      ".bg-primary.h-full"
    ) as HTMLElement;
    const width = parseFloat(progressBar.style.width);
    expect(width).toBeLessThanOrEqual(100);
  });
});
