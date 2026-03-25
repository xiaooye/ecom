import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";

// Mock lucide-react icons — the component uses Check, Mail, Truck, CreditCard
vi.mock("lucide-react", () => ({
  Check: (props: Record<string, unknown>) => (
    <svg data-testid="check-icon" {...props} />
  ),
  Mail: (props: Record<string, unknown>) => (
    <svg data-testid="mail-icon" {...props} />
  ),
  Truck: (props: Record<string, unknown>) => (
    <svg data-testid="truck-icon" {...props} />
  ),
  CreditCard: (props: Record<string, unknown>) => (
    <svg data-testid="credit-card-icon" {...props} />
  ),
}));

describe("CheckoutStepper", () => {
  it("shows all 3 steps (Information, Shipping, Payment)", () => {
    render(<CheckoutStepper currentStep="information" />);

    expect(screen.getByText("Information")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("current step is highlighted with primary color", () => {
    render(<CheckoutStepper currentStep="shipping" />);

    const shippingLabel = screen.getByText("Shipping");
    expect(shippingLabel.className).toContain("text-primary");
  });

  it("completed steps show check icon", () => {
    render(<CheckoutStepper currentStep="payment" />);

    // When on payment step, information and shipping are completed
    // They should have check icons instead of their original icons
    const checkIcons = screen.getAllByTestId("check-icon");
    expect(checkIcons).toHaveLength(2); // information + shipping are completed
  });

  it("future steps are dimmed with muted-foreground", () => {
    render(<CheckoutStepper currentStep="information" />);

    // Shipping and Payment are future steps
    const shippingLabel = screen.getByText("Shipping");
    expect(shippingLabel.className).toContain("text-muted-foreground");

    const paymentLabel = screen.getByText("Payment");
    expect(paymentLabel.className).toContain("text-muted-foreground");
  });

  it("completed step circle has primary background", () => {
    render(<CheckoutStepper currentStep="shipping" />);

    // Information step is completed, its circle should have bg-primary
    const checkIcon = screen.getByTestId("check-icon");
    const circle = checkIcon.closest(
      ".flex.h-10.w-10.items-center.justify-center.rounded-full"
    );
    expect(circle?.className).toContain("bg-primary");
    expect(circle?.className).toContain("border-primary");
  });

  it("current step circle has primary/10 background", () => {
    render(<CheckoutStepper currentStep="shipping" />);

    // The truck icon is the current step's icon
    const truckIcon = screen.getByTestId("truck-icon");
    const circle = truckIcon.closest(
      ".flex.h-10.w-10.items-center.justify-center.rounded-full"
    );
    expect(circle?.className).toContain("bg-primary/10");
    expect(circle?.className).toContain("border-primary");
  });

  it("future step circle has muted border", () => {
    render(<CheckoutStepper currentStep="information" />);

    // Payment step icon (CreditCard) is future
    const creditCardIcon = screen.getByTestId("credit-card-icon");
    const circle = creditCardIcon.closest(
      ".flex.h-10.w-10.items-center.justify-center.rounded-full"
    );
    expect(circle?.className).toContain("border-muted");
    expect(circle?.className).toContain("text-muted-foreground");
  });

  it("shows original icon for current and future steps", () => {
    render(<CheckoutStepper currentStep="information" />);

    // Information is current — shows Mail icon
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
    // Shipping is future — shows Truck icon
    expect(screen.getByTestId("truck-icon")).toBeInTheDocument();
    // Payment is future — shows CreditCard icon
    expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument();
    // No check icons (nothing is completed)
    expect(screen.queryAllByTestId("check-icon")).toHaveLength(0);
  });

  it("when on last step, all previous steps show check icons", () => {
    render(<CheckoutStepper currentStep="payment" />);

    // 2 completed steps show check icons
    expect(screen.getAllByTestId("check-icon")).toHaveLength(2);
    // Current step shows CreditCard icon
    expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument();
    // No mail or truck icons (replaced by check)
    expect(screen.queryByTestId("mail-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("truck-icon")).not.toBeInTheDocument();
  });
});
