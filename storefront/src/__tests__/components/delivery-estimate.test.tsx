import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeliveryEstimate } from "@/components/product/delivery-estimate";

// Mock lucide-react Truck icon
vi.mock("lucide-react", () => ({
  Truck: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="truck-icon" className={className as string} {...props} />
  ),
}));

describe("DeliveryEstimate", () => {
  it("renders the truck icon", () => {
    render(<DeliveryEstimate />);
    expect(screen.getByTestId("truck-icon")).toBeInTheDocument();
  });

  it("shows a date range with 'Get it' prefix", () => {
    render(<DeliveryEstimate />);
    expect(screen.getByText(/Get it/)).toBeInTheDocument();
  });

  it("displays two dates separated by a dash", () => {
    render(<DeliveryEstimate />);
    const container = screen.getByText(/Get it/);
    const strongElements = container.querySelectorAll("strong");
    expect(strongElements).toHaveLength(2);
  });

  it("shows dates that are in the future", () => {
    render(<DeliveryEstimate />);
    const today = new Date();

    // The component uses minDays=3, maxDays=5
    const minDate = new Date(today.getTime() + 3 * 86400000);
    const maxDate = new Date(today.getTime() + 5 * 86400000);

    const format = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const container = screen.getByText(/Get it/);
    const strongElements = container.querySelectorAll("strong");

    expect(strongElements[0].textContent).toBe(format(minDate));
    expect(strongElements[1].textContent).toBe(format(maxDate));

    // Both dates must be after today
    expect(minDate.getTime()).toBeGreaterThan(today.getTime());
    expect(maxDate.getTime()).toBeGreaterThan(today.getTime());
  });
});
