import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("renders login form with email and password fields", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toContainText("Welcome Back");
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible();
  });

  test("shows validation errors for empty submission", async ({ page }) => {
    await page.getByRole("button", { name: /sign in/i }).click();
    // Zod validation should show error messages
    await expect(page.locator("text=Invalid email")).toBeVisible();
    await expect(page.locator("text=Password is required")).toBeVisible();
  });

  test("shows validation error for invalid email format", async ({ page }) => {
    await page.locator("#email").fill("not-an-email");
    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.locator("text=Invalid email")).toBeVisible();
  });

  test("has link to register page", async ({ page }) => {
    const registerLink = page.locator('a[href="/auth/register"]');
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });
});

test.describe("Register page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/register");
  });

  test("renders registration form with all fields", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Create Account");
    await expect(page.locator("#first_name")).toBeVisible();
    await expect(page.locator("#last_name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /create account/i })
    ).toBeVisible();
  });

  test("shows validation errors for empty submission", async ({ page }) => {
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.locator("text=First name is required")).toBeVisible();
    await expect(page.locator("text=Last name is required")).toBeVisible();
    await expect(page.locator("text=Invalid email")).toBeVisible();
  });

  test("shows password length validation", async ({ page }) => {
    await page.locator("#first_name").fill("John");
    await page.locator("#last_name").fill("Doe");
    await page.locator("#email").fill("john@example.com");
    await page.locator("#password").fill("short");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(
      page.locator("text=Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("has link to login page", async ({ page }) => {
    const loginLink = page.locator('a[href="/auth/login"]');
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
