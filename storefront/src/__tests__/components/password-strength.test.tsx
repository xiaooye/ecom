import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PasswordStrength } from "@/components/account/password-strength";

describe("PasswordStrength", () => {
  it("returns null for empty password", () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows "Weak" for a short password', () => {
    render(<PasswordStrength password="abc" />);
    expect(
      screen.getByText(/Password strength:.*Weak/)
    ).toBeInTheDocument();
  });

  it('shows "Strong" for a complex password', () => {
    // length >= 12 (+2), has lower+upper (+1), has digit (+1) = score 4 => "Strong"
    render(<PasswordStrength password="MyPassword12" />);
    expect(
      screen.getByText(/Password strength:.*Strong/)
    ).toBeInTheDocument();
  });

  it('shows "Very Strong" for a highly complex password', () => {
    // length >= 12 (+2), lower+upper (+1), digit (+1), special (+1) = score 5 => "Very Strong"
    render(<PasswordStrength password="MyP@ssword12!" />);
    expect(
      screen.getByText(/Password strength:.*Very Strong/)
    ).toBeInTheDocument();
  });

  it('shows "Fair" for a medium password', () => {
    // length >= 8 (+1), has lower+upper (+1) = score 2 => "Fair"
    render(<PasswordStrength password="Abcdefgh" />);
    expect(
      screen.getByText(/Password strength:.*Fair/)
    ).toBeInTheDocument();
  });

  it("shows correct number of filled bars for Weak (score 1)", () => {
    // "abc" => length < 8 (0), no upper (0), no digit (0), no special (0) => score 0 => Weak
    // Actually score 0 <= 1, so label = "Weak"
    const { container } = render(<PasswordStrength password="abc" />);
    const bars = container.querySelectorAll(".rounded-full.h-1");
    expect(bars).toHaveLength(5);

    // score 0: no filled bars (all should be bg-muted)
    const filledBars = Array.from(bars).filter(
      (bar) => !bar.classList.contains("bg-muted")
    );
    expect(filledBars).toHaveLength(0);
  });

  it("shows correct number of filled bars for Strong (score 4)", () => {
    // "MyPassword12" => >=8 (+1), >=12 (+1), lower+upper (+1), digit (+1) = score 4
    const { container } = render(
      <PasswordStrength password="MyPassword12" />
    );
    const bars = container.querySelectorAll(".rounded-full.h-1");
    expect(bars).toHaveLength(5);

    const filledBars = Array.from(bars).filter((bar) =>
      bar.classList.contains("bg-green-500")
    );
    expect(filledBars).toHaveLength(4);
  });

  it("always renders exactly 5 bars", () => {
    const { container } = render(
      <PasswordStrength password="test" />
    );
    const bars = container.querySelectorAll(".rounded-full.h-1");
    expect(bars).toHaveLength(5);
  });
});
