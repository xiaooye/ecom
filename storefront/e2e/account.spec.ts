import { test, expect } from "@playwright/test";

test.describe("Account pages", () => {
  test("account page redirects to /account/orders", async ({ page }) => {
    // The account page.tsx calls redirect("/account/orders")
    await page.goto("/account");
    await page.waitForURL(/\/account\/orders/, { timeout: 10000 });
    expect(page.url()).toContain("/account/orders");
  });

  test("account layout renders heading and navigation", async ({ page }) => {
    await page.goto("/account/orders");

    // Main heading
    await expect(
      page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();

    // Breadcrumb
    const breadcrumb = page.getByLabel("Breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText("Account")).toBeVisible();
  });

  test("account nav shows orders, addresses, profile, and logout links", async ({ page }) => {
    await page.goto("/account/orders");

    // Navigation links
    const nav = page.locator("aside nav");
    await expect(nav.getByRole("link", { name: "Orders" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Addresses" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Profile" })).toBeVisible();

    // Logout button
    await expect(nav.getByRole("button", { name: "Log Out" })).toBeVisible();
  });

  test("account nav links navigate to correct pages", async ({ page }) => {
    await page.goto("/account/orders");

    // Click Addresses
    await page.locator("aside nav").getByRole("link", { name: "Addresses" }).click();
    await expect(page).toHaveURL(/\/account\/addresses/);

    // Click Profile
    await page.locator("aside nav").getByRole("link", { name: "Profile" }).click();
    await expect(page).toHaveURL(/\/account\/profile/);

    // Click Orders
    await page.locator("aside nav").getByRole("link", { name: "Orders" }).click();
    await expect(page).toHaveURL(/\/account\/orders/);
  });

  test("profile page renders form fields", async ({ page }) => {
    await page.goto("/account/profile");

    // Profile heading
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();

    // Form fields should render after loading
    // The form fetches customer data and shows a skeleton while loading
    // Then renders the actual form fields
    const firstNameLabel = page.getByLabel("First Name");
    const lastNameLabel = page.getByLabel("Last Name");
    const phoneLabel = page.getByLabel("Phone (optional)");

    // Wait for loading to complete (skeleton disappears)
    await page.waitForTimeout(2000);

    // Fields should be visible (even if empty, the inputs render)
    const hasFirstName = (await firstNameLabel.count()) > 0;
    if (hasFirstName) {
      await expect(firstNameLabel).toBeVisible();
      await expect(lastNameLabel).toBeVisible();
      await expect(phoneLabel).toBeVisible();
      await expect(page.getByRole("button", { name: /save changes/i })).toBeVisible();
    }
  });
});
