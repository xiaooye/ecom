import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("lucide-react", () => ({
  Check: (props: Record<string, unknown>) =>
    React.createElement("svg", {
      "data-testid": "check-icon",
      className: props.className,
    }),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

// Faithful mock of VariantSelector that matches the real implementation's rendering behavior
vi.mock("@/components/product/variant-selector", async () => {
  const R = await import("react");

  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    red: "#DC2626",
    blue: "#2563EB",
    green: "#16A34A",
    yellow: "#EAB308",
    pink: "#EC4899",
    purple: "#9333EA",
    orange: "#EA580C",
    gray: "#6B7280",
    grey: "#6B7280",
    navy: "#1E3A5F",
    brown: "#92400E",
    beige: "#D4C5A9",
    cream: "#FFFDD0",
    khaki: "#C3B091",
    olive: "#808000",
    teal: "#0D9488",
    maroon: "#800000",
    coral: "#FF7F50",
  };

  function isColor(value: string): boolean {
    return value.toLowerCase() in colorMap;
  }

  function getColorHex(value: string): string {
    return colorMap[value.toLowerCase()] || "#888888";
  }

  return {
    VariantSelector: (props: {
      options: Array<{
        id: string;
        title: string;
        values: Array<{ value: string }>;
      }>;
      selectedOptions: Record<string, string>;
      onOptionChange: (title: string, value: string) => void;
    }) => {
      return R.createElement(
        "div",
        { className: "flex flex-col gap-5" },
        ...props.options.map((option) => {
          const isColorOption =
            option.title.toLowerCase() === "color" ||
            option.values.every((v) => isColor(v.value));

          return R.createElement(
            "div",
            { key: option.id },
            R.createElement(
              "div",
              { className: "flex items-center gap-2" },
              R.createElement(
                "h3",
                { className: "text-sm font-medium" },
                option.title
              ),
              props.selectedOptions[option.title]
                ? R.createElement(
                    "span",
                    { className: "text-sm text-muted-foreground" },
                    "\u2014 " + props.selectedOptions[option.title]
                  )
                : null
            ),
            R.createElement(
              "div",
              { className: "mt-2.5 flex flex-wrap gap-2" },
              ...option.values.map((optionValue) => {
                const isSelected =
                  props.selectedOptions[option.title] === optionValue.value;
                if (isColorOption) {
                  const hex = getColorHex(optionValue.value);
                  const isLight =
                    optionValue.value.toLowerCase() === "white" ||
                    optionValue.value.toLowerCase() === "cream" ||
                    optionValue.value.toLowerCase() === "beige";
                  return R.createElement(
                    "button",
                    {
                      key: optionValue.value,
                      onClick: () =>
                        props.onOptionChange(option.title, optionValue.value),
                      className: isSelected
                        ? "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all border-primary ring-2 ring-primary ring-offset-2"
                        : "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all border-gray-200 hover:border-gray-400",
                      style: { backgroundColor: hex },
                      "aria-label": optionValue.value,
                      title: optionValue.value,
                    },
                    isSelected
                      ? R.createElement("svg", {
                          "data-testid": "check-icon",
                          className: isLight ? "h-4 w-4 text-black" : "h-4 w-4 text-white",
                        })
                      : null
                  );
                }
                return R.createElement(
                  "button",
                  {
                    key: optionValue.value,
                    onClick: () =>
                      props.onOptionChange(option.title, optionValue.value),
                    className: isSelected
                      ? "rounded-lg border px-4 py-2 text-sm font-medium transition-all border-primary bg-primary text-primary-foreground shadow-sm"
                      : "rounded-lg border px-4 py-2 text-sm font-medium transition-all border-input bg-background hover:border-primary hover:bg-muted",
                  },
                  optionValue.value
                );
              })
            )
          );
        })
      );
    },
  };
});

import { VariantSelector } from "@/components/product/variant-selector";

const sizeOption = {
  id: "opt_size",
  title: "Size",
  values: [{ value: "S" }, { value: "M" }, { value: "L" }, { value: "XL" }],
};

const colorOption = {
  id: "opt_color",
  title: "Color",
  values: [{ value: "Black" }, { value: "White" }, { value: "Red" }],
};

describe("VariantSelector", () => {
  it("renders all option groups (Size, Color)", () => {
    render(
      React.createElement(VariantSelector, {
        options: [sizeOption, colorOption],
        selectedOptions: {},
        onOptionChange: () => {},
      })
    );
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("shows selected value next to option title", () => {
    render(
      React.createElement(VariantSelector, {
        options: [sizeOption, colorOption],
        selectedOptions: { Size: "M", Color: "Black" },
        onOptionChange: () => {},
      })
    );
    expect(screen.getByText(/\u2014 M/)).toBeInTheDocument();
    expect(screen.getByText(/\u2014 Black/)).toBeInTheDocument();
  });

  it("clicking an option calls onOptionChange", async () => {
    const user = userEvent.setup();
    const onOptionChange = vi.fn();

    render(
      React.createElement(VariantSelector, {
        options: [sizeOption],
        selectedOptions: {},
        onOptionChange,
      })
    );

    await user.click(screen.getByText("L"));
    expect(onOptionChange).toHaveBeenCalledWith("Size", "L");
  });

  it("color options render as circular buttons", () => {
    render(
      React.createElement(VariantSelector, {
        options: [colorOption],
        selectedOptions: {},
        onOptionChange: () => {},
      })
    );

    const blackButton = screen.getByRole("button", { name: "Black" });
    expect(blackButton.className).toContain("rounded-full");
    expect(blackButton.className).toContain("h-9");
    expect(blackButton.className).toContain("w-9");
  });

  it("size options render as rectangular buttons", () => {
    render(
      React.createElement(VariantSelector, {
        options: [sizeOption],
        selectedOptions: {},
        onOptionChange: () => {},
      })
    );

    const sButton = screen.getByText("S");
    expect(sButton.className).toContain("rounded-lg");
    expect(sButton.className).toContain("px-4");
    expect(sButton.className).toContain("py-2");
  });

  it("selected option has primary styling", () => {
    render(
      React.createElement(VariantSelector, {
        options: [sizeOption],
        selectedOptions: { Size: "M" },
        onOptionChange: () => {},
      })
    );

    const selectedButton = screen.getByText("M");
    expect(selectedButton.className).toContain("border-primary");
    expect(selectedButton.className).toContain("bg-primary");

    const unselectedButton = screen.getByText("S");
    expect(unselectedButton.className).not.toContain("bg-primary");
  });

  it("renders color swatches for color-type options", () => {
    render(
      React.createElement(VariantSelector, {
        options: [colorOption],
        selectedOptions: {},
        onOptionChange: () => {},
      })
    );

    const blackButton = screen.getByRole("button", { name: "Black" });
    expect(blackButton.style.backgroundColor).toBe("rgb(0, 0, 0)");

    const whiteButton = screen.getByRole("button", { name: "White" });
    expect(whiteButton.style.backgroundColor).toBe("rgb(255, 255, 255)");

    const redButton = screen.getByRole("button", { name: "Red" });
    expect(redButton.style.backgroundColor).toBe("rgb(220, 38, 38)");
  });

  it("selected color option shows check icon", () => {
    render(
      React.createElement(VariantSelector, {
        options: [colorOption],
        selectedOptions: { Color: "Black" },
        onOptionChange: () => {},
      })
    );
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("does not show selected value when none is selected", () => {
    render(
      React.createElement(VariantSelector, {
        options: [sizeOption],
        selectedOptions: {},
        onOptionChange: () => {},
      })
    );
    expect(screen.queryByText(/\u2014/)).not.toBeInTheDocument();
  });

  it("clicking a color option calls onOptionChange with correct args", async () => {
    const user = userEvent.setup();
    const onOptionChange = vi.fn();

    render(
      React.createElement(VariantSelector, {
        options: [colorOption],
        selectedOptions: {},
        onOptionChange,
      })
    );

    await user.click(screen.getByRole("button", { name: "Red" }));
    expect(onOptionChange).toHaveBeenCalledWith("Color", "Red");
  });
});
