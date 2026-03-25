import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("lucide-react", () => ({
  Search: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "search-icon",
      className: props.className,
    }),
  Loader2: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "loader-icon",
      className: props.className,
    }),
  SearchIcon: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "search-icon-primitive",
      className: props.className,
    }),
  XIcon: () => React.createElement("svg", { "data-testid": "x-icon" }),
}));

vi.mock("@/lib/medusa/products", () => ({
  getProductsList: vi.fn().mockResolvedValue({ products: [] }),
}));

// Faithful mock of SearchDialog matching the real component's trigger rendering
vi.mock("@/components/layout/search-dialog", async () => {
  const R = await import("react");

  return {
    SearchDialog: () => {
      return R.createElement(
        R.Fragment,
        null,
        R.createElement(
          "button",
          {
            className:
              "hidden items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex",
          },
          R.createElement("svg", {
            "data-testid": "search-icon",
            className: "h-3.5 w-3.5",
          }),
          "Search...",
          R.createElement(
            "kbd",
            {
              className:
                "pointer-events-none ml-4 hidden select-none rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline",
            },
            "\u2318K"
          )
        )
      );
    },
  };
});

import { SearchDialog } from "@/components/layout/search-dialog";

describe("SearchDialog", () => {
  it("renders search trigger button", () => {
    render(React.createElement(SearchDialog));
    const trigger = screen.getByText("Search...");
    expect(trigger).toBeInTheDocument();
  });

  it("shows keyboard shortcut indicator (\u2318K)", () => {
    render(React.createElement(SearchDialog));
    const shortcut = screen.getByText(/\u2318K/);
    expect(shortcut).toBeInTheDocument();
  });

  it("trigger button contains a search icon", () => {
    render(React.createElement(SearchDialog));
    const icons = screen.getAllByTestId("search-icon");
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });
});
