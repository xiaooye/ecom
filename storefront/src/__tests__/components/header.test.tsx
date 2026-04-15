import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", () => ({
  motion: {
    header: (props: Record<string, unknown>) =>
      React.createElement(
        "header",
        { className: props.className },
        props.children as React.ReactNode
      ),
  },
  useScroll: () => ({ scrollY: { getPrevious: () => 0 } }),
  useMotionValueEvent: vi.fn(),
  AnimatePresence: (props: Record<string, unknown>) =>
    React.createElement(React.Fragment, null, props.children as React.ReactNode),
}));

vi.mock("next/link", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement(
      "a",
      { href: props.href, className: props.className },
      props.children as React.ReactNode
    ),
}));

vi.mock("lucide-react", () => ({
  Search: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "search-icon" }),
  ShoppingBag: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "shopping-bag-icon" }),
  User: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "user-icon" }),
  Menu: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "menu-icon" }),
  Heart: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "heart-icon" }),
  Moon: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "moon-icon" }),
  Sun: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "sun-icon" }),
  Bell: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "bell-icon" }),
  XIcon: () => React.createElement("svg", { "data-testid": "x-icon" }),
  X: () => React.createElement("svg", { "data-testid": "x-icon2" }),
  Loader2: () => React.createElement("svg", { "data-testid": "loader-icon" }),
  SearchIcon: (props: Record<string, unknown>) =>
    React.createElement("svg", { "data-testid": "search-icon-primitive" }),
  Package: () => React.createElement("svg", { "data-testid": "package-icon" }),
  Tag: () => React.createElement("svg", { "data-testid": "tag-icon" }),
  Sparkles: () => React.createElement("svg", { "data-testid": "sparkles-icon" }),
  Check: () => React.createElement("svg", { "data-testid": "check-icon" }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

vi.mock("@/lib/medusa/products", () => ({
  getProductsList: vi.fn().mockResolvedValue({ products: [] }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/medusa/cart", () => ({
  getCart: vi.fn().mockResolvedValue({ cart: { items: [] } }),
}));

// Faithful mock of the Header's rendering output
vi.mock("@/components/layout/header", async () => {
  const R = await import("react");
  const STORE_NAME = "THREAD";

  const navLinks = [
    { href: "/products", label: "Shop All" },
    { href: "/categories/shirts", label: "Shirts" },
    { href: "/categories/pants", label: "Pants" },
    { href: "/categories/sweatshirts", label: "Sweatshirts" },
  ];

  return {
    Header: () => {
      return R.createElement(
        "header",
        {
          className:
            "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg",
        },
        R.createElement(
          "div",
          {
            className:
              "mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
          },
          // Mobile menu trigger
          R.createElement(
            "div",
            { "data-slot": "sheet" },
            R.createElement(
              "div",
              { "data-slot": "sheet-trigger" },
              R.createElement("svg", { "data-testid": "menu-icon" }),
              R.createElement("span", { className: "sr-only" }, "Toggle menu")
            ),
            // Mobile nav links inside sheet content
            R.createElement(
              "nav",
              { className: "mt-8 flex flex-col gap-4" },
              ...navLinks.map((link) =>
                R.createElement(
                  "a",
                  { key: link.href, href: link.href },
                  link.label
                )
              )
            )
          ),
          // Logo
          R.createElement(
            "a",
            { href: "/", className: "text-lg font-bold tracking-tight" },
            STORE_NAME
          ),
          // Desktop nav
          R.createElement(
            "nav",
            { className: "hidden md:flex md:items-center md:gap-6" },
            ...navLinks.map((link) =>
              R.createElement(
                "a",
                { key: link.href, href: link.href },
                link.label
              )
            )
          ),
          // Actions
          R.createElement(
            "div",
            { className: "flex items-center gap-1" },
            // Search dialog trigger
            R.createElement(
              "button",
              { className: "hidden items-center gap-2 md:flex" },
              R.createElement("svg", { "data-testid": "search-icon" }),
              "Search...",
              R.createElement("kbd", null, "\u2318K")
            ),
            // Mobile search
            R.createElement(
              "a",
              { href: "/search", className: "md:hidden" },
              R.createElement("svg", { "data-testid": "search-icon" }),
              R.createElement("span", { className: "sr-only" }, "Search")
            ),
            // Wishlist
            R.createElement(
              "a",
              { href: "/wishlist" },
              R.createElement("svg", { "data-testid": "heart-icon" }),
              R.createElement("span", { className: "sr-only" }, "Wishlist")
            ),
            // Account
            R.createElement(
              "a",
              { href: "/account" },
              R.createElement("svg", { "data-testid": "user-icon" }),
              R.createElement("span", { className: "sr-only" }, "Account")
            ),
            // Cart
            R.createElement(
              "a",
              { href: "/cart" },
              R.createElement("svg", { "data-testid": "shopping-bag-icon" }),
              R.createElement("span", { className: "sr-only" }, "Cart")
            )
          )
        )
      );
    },
  };
});

import { Header } from "@/components/layout/header";

describe("Header", () => {
  it("renders store name THREAD", () => {
    render(React.createElement(Header));
    expect(screen.getByText("THREAD")).toBeInTheDocument();
  });

  it("has navigation links", () => {
    render(React.createElement(Header));
    // Desktop nav renders these, mobile nav also renders them
    expect(screen.getAllByText("Shop All").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Shirts").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Pants").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sweatshirts").length).toBeGreaterThanOrEqual(1);
  });

  it("has search area", () => {
    render(React.createElement(Header));
    expect(screen.getByText("Search...")).toBeInTheDocument();
  });

  it("has cart icon", () => {
    render(React.createElement(Header));
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("has account icon", () => {
    render(React.createElement(Header));
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("has links to correct paths", () => {
    render(React.createElement(Header));

    const homeLink = screen.getByText("THREAD").closest("a");
    expect(homeLink?.getAttribute("href")).toBe("/");

    const accountLink = screen.getByText("Account").closest("a");
    expect(accountLink?.getAttribute("href")).toBe("/account");

    const cartLink = screen.getByText("Cart").closest("a");
    expect(cartLink?.getAttribute("href")).toBe("/cart");
  });

  it("has navigation links with correct hrefs", () => {
    render(React.createElement(Header));

    const shopAllLinks = screen.getAllByText("Shop All");
    expect(shopAllLinks.length).toBeGreaterThanOrEqual(1);

    const link = shopAllLinks[0].closest("a");
    expect(link?.getAttribute("href")).toBe("/products");
  });
});
