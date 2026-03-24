import { test, expect } from "@playwright/test";

test.describe("Compare page", () => {
  test("empty compare page shows empty state", async ({ page }) => {
    await page.goto("/compare");

    // Heading
    await expect(
      page.getByRole("heading", { name: /no products to compare/i })
    ).toBeVisible();

    // Description
    await expect(
      page.getByText(/add products to compare from the shop/i)
    ).toBeVisible();

    // CTA button
    const browseLink = page.getByRole("link", { name: /browse products/i });
    await expect(browseLink).toBeVisible();
    await expect(browseLink).toHaveAttribute("href", "/products");
  });

  test("empty compare CTA navigates to products page", async ({ page }) => {
    await page.goto("/compare");
    await page.getByRole("link", { name: /browse products/i }).click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("compare page with pre-populated products shows comparison table", async ({
    page,
  }) => {
    // Pre-populate the compare store via localStorage
    await page.goto("/");
    await page.evaluate(() => {
      const products = [
        {
          id: "prod_1",
          title: "Classic Shirt",
          handle: "classic-shirt",
          thumbnail: null,
          description: "A classic cotton shirt",
          variants: [
            {
              calculated_price: {
                calculated_amount: 2999,
                currency_code: "usd",
              },
            },
          ],
        },
        {
          id: "prod_2",
          title: "Modern Pants",
          handle: "modern-pants",
          thumbnail: null,
          description: "Modern fit pants",
          variants: [
            {
              calculated_price: {
                calculated_amount: 4999,
                currency_code: "usd",
              },
            },
          ],
        },
      ];
      localStorage.setItem(
        "compare-store",
        JSON.stringify({
          state: { products },
          version: 0,
        })
      );
    });

    await page.goto("/compare");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Compare Products" })
    ).toBeVisible();

    // Product titles in the table
    await expect(page.getByText("Classic Shirt")).toBeVisible();
    await expect(page.getByText("Modern Pants")).toBeVisible();

    // Comparison row labels
    await expect(page.getByText("Price")).toBeVisible();
    await expect(page.getByText("Variants")).toBeVisible();
    await expect(page.getByText("Description")).toBeVisible();

    // Remove buttons
    const removeButtons = page.getByRole("button", { name: "Remove" });
    await expect(removeButtons).toHaveCount(2);
  });

  test("compare page breadcrumb is visible with products", async ({ page }) => {
    // Pre-populate
    await page.goto("/");
    await page.evaluate(() => {
      const products = [
        {
          id: "prod_1",
          title: "Test Product",
          handle: "test",
          thumbnail: null,
          description: "Desc",
          variants: [],
        },
      ];
      localStorage.setItem(
        "compare-store",
        JSON.stringify({ state: { products }, version: 0 })
      );
    });

    await page.goto("/compare");
    const breadcrumb = page.getByLabel("Breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText("Compare")).toBeVisible();
  });
});
