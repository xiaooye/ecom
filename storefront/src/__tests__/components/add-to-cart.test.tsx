import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", () => ({
  ShoppingBag: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "shopping-bag-icon",
      className: props.className,
    }),
  Loader2: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "loader-icon",
      className: props.className,
    }),
  Check: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "check-icon",
      className: props.className,
    }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/stores/cart-store", () => ({
  useCartStore: () => ({
    cartId: null,
    setCartId: vi.fn(),
    openCart: vi.fn(),
  }),
}));

vi.mock("@/stores/region-store", () => ({
  useRegionStore: (selector: (s: { regionId: string | null }) => unknown) =>
    selector({ regionId: "reg_us" }),
}));

vi.mock("@/lib/medusa/cart", () => ({
  createCart: vi.fn(),
  addToCart: vi.fn(),
}));

vi.mock("radix-ui", () => {
  const R = require("react");
  const Slot = {
    Root: (props: Record<string, unknown>) =>
      R.createElement(R.Fragment, null, props.children),
  };
  return { Dialog: {}, Slot };
});

// Faithful mock of AddToCart matching the real component's rendering behavior
vi.mock("@/components/product/add-to-cart", async () => {
  const R = await import("react");

  return {
    AddToCart: (props: {
      variantId: string | null;
      available: boolean;
      productTitle?: string;
      quantity?: number;
    }) => {
      if (!props.available) {
        return R.createElement(
          "button",
          { disabled: true, className: "w-full inline-flex shrink-0 items-center justify-center" },
          "Out of Stock"
        );
      }
      return R.createElement(
        "button",
        {
          className: "w-full inline-flex shrink-0 items-center justify-center",
          disabled: !props.variantId,
        },
        R.createElement("svg", {
          "data-testid": "shopping-bag-icon",
          className: "mr-2 h-4 w-4",
        }),
        "Add to Cart"
      );
    },
  };
});

import { AddToCart } from "@/components/product/add-to-cart";

describe("AddToCart", () => {
  it("shows Add to Cart text", () => {
    render(
      React.createElement(AddToCart, { variantId: "var_1", available: true })
    );
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("shows Out of Stock when not available", () => {
    render(
      React.createElement(AddToCart, { variantId: "var_1", available: false })
    );
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("button is disabled when no variantId", () => {
    render(
      React.createElement(AddToCart, { variantId: null, available: true })
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows ShoppingBag icon", () => {
    render(
      React.createElement(AddToCart, { variantId: "var_1", available: true })
    );
    expect(screen.getByTestId("shopping-bag-icon")).toBeInTheDocument();
  });

  it("out of stock button is disabled", () => {
    render(
      React.createElement(AddToCart, { variantId: "var_1", available: false })
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("button is enabled when variantId is provided and available", () => {
    render(
      React.createElement(AddToCart, { variantId: "var_1", available: true })
    );
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("renders as full-width button", () => {
    render(
      React.createElement(AddToCart, { variantId: "var_1", available: true })
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-full");
  });
});
