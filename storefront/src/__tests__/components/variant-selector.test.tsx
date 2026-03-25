import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VariantSelector } from "@/components/product/variant-selector";

// Mock lucide-react Check icon
vi.mock("lucide-react", () => ({
  Check: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="check-icon" className={className as string} {...props} />
  ),
}));

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
      <VariantSelector
        options={[sizeOption, colorOption]}
        selectedOptions={{}}
        onOptionChange={() => {}}
      />
    );

    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("shows selected value next to option title", () => {
    render(
      <VariantSelector
        options={[sizeOption, colorOption]}
        selectedOptions={{ Size: "M", Color: "Black" }}
        onOptionChange={() => {}}
      />
    );

    expect(screen.getByText(/— M/)).toBeInTheDocument();
    expect(screen.getByText(/— Black/)).toBeInTheDocument();
  });

  it("clicking an option calls onOptionChange", async () => {
    const user = userEvent.setup();
    const onOptionChange = vi.fn();

    render(
      <VariantSelector
        options={[sizeOption]}
        selectedOptions={{}}
        onOptionChange={onOptionChange}
      />
    );

    await user.click(screen.getByText("L"));

    expect(onOptionChange).toHaveBeenCalledWith("Size", "L");
  });

  it("color options render as circular buttons", () => {
    render(
      <VariantSelector
        options={[colorOption]}
        selectedOptions={{}}
        onOptionChange={() => {}}
      />
    );

    const blackButton = screen.getByRole("button", { name: "Black" });
    expect(blackButton.className).toContain("rounded-full");
    expect(blackButton.className).toContain("h-9");
    expect(blackButton.className).toContain("w-9");
  });

  it("size options render as rectangular buttons", () => {
    render(
      <VariantSelector
        options={[sizeOption]}
        selectedOptions={{}}
        onOptionChange={() => {}}
      />
    );

    const sButton = screen.getByText("S");
    expect(sButton.className).toContain("rounded-lg");
    expect(sButton.className).toContain("px-4");
    expect(sButton.className).toContain("py-2");
  });

  it("selected option has primary styling", () => {
    render(
      <VariantSelector
        options={[sizeOption]}
        selectedOptions={{ Size: "M" }}
        onOptionChange={() => {}}
      />
    );

    const selectedButton = screen.getByText("M");
    expect(selectedButton.className).toContain("border-primary");
    expect(selectedButton.className).toContain("bg-primary");

    // Non-selected button should not have primary bg
    const unselectedButton = screen.getByText("S");
    expect(unselectedButton.className).not.toContain("bg-primary");
  });

  it("renders color swatches for color-type options", () => {
    render(
      <VariantSelector
        options={[colorOption]}
        selectedOptions={{}}
        onOptionChange={() => {}}
      />
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
      <VariantSelector
        options={[colorOption]}
        selectedOptions={{ Color: "Black" }}
        onOptionChange={() => {}}
      />
    );

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("does not show selected value when none is selected", () => {
    render(
      <VariantSelector
        options={[sizeOption]}
        selectedOptions={{}}
        onOptionChange={() => {}}
      />
    );

    // The "—" separator should not appear
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });

  it("clicking a color option calls onOptionChange with correct args", async () => {
    const user = userEvent.setup();
    const onOptionChange = vi.fn();

    render(
      <VariantSelector
        options={[colorOption]}
        selectedOptions={{}}
        onOptionChange={onOptionChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Red" }));

    expect(onOptionChange).toHaveBeenCalledWith("Color", "Red");
  });
});
