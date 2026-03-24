import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("login page renders form with heading and fields", async ({ page }) => {
    // Heading
    await expect(
      page.getByRole("heading", { name: "Welcome Back" })
    ).toBeVisible();

    // Subtitle
    await expect(page.getByText("Sign in to your account")).toBeVisible();

    // Email and password fields
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    // Submit button
    await expect(
      page.getByRole("button", { name: "Sign In" })
    ).toBeVisible();
  });

  test("login validates email format", async ({ page }) => {
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    // Enter invalid email
    await emailInput.fill("not-a-valid-email");
    await passwordInput.fill("somepassword");

    // Submit form
    await page.getByRole("button", { name: "Sign In" }).click();

    // Validation error should appear
    await expect(page.getByText("Invalid email")).toBeVisible();
  });

  test("login validates required fields", async ({ page }) => {
    // Submit empty form
    await page.getByRole("button", { name: "Sign In" }).click();

    // Validation errors
    await expect(page.getByText("Invalid email")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("login page has link to register", async ({ page }) => {
    const registerLink = page.getByRole("link", { name: "Create one" });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", "/auth/register");

    // Click and verify navigation
    await registerLink.click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test("login form submits and shows error for invalid credentials", async ({ page }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Should show an error message (backend returns error or connection fails)
    const errorMsg = page.getByText(/invalid email or password/i);
    // Wait for the error to appear (API call + error handling)
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Register page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/register");
  });

  test("register page renders form with all fields", async ({ page }) => {
    // Heading
    await expect(
      page.getByRole("heading", { name: "Create Account" })
    ).toBeVisible();

    // Subtitle
    await expect(
      page.getByText("Join us for exclusive deals and faster checkout")
    ).toBeVisible();

    // All form fields
    await expect(page.getByLabel("First Name")).toBeVisible();
    await expect(page.getByLabel("Last Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    // Submit button
    await expect(
      page.getByRole("button", { name: "Create Account" })
    ).toBeVisible();
  });

  test("register validates password length (min 8)", async ({ page }) => {
    await page.getByLabel("First Name").fill("John");
    await page.getByLabel("Last Name").fill("Doe");
    await page.getByLabel("Email").fill("john@example.com");
    await page.getByLabel("Password").fill("short");

    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("register validates required fields", async ({ page }) => {
    // Submit empty form
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText("First name is required")).toBeVisible();
    await expect(page.getByText("Last name is required")).toBeVisible();
    await expect(page.getByText("Invalid email")).toBeVisible();
    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("register page has link to login", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: "Sign in" });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", "/auth/login");

    await loginLink.click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("links between login and register work bidirectionally", async ({ page }) => {
    // Start at register
    await expect(page).toHaveURL(/\/auth\/register/);

    // Go to login
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/auth\/login/);

    // Go back to register
    await page.getByRole("link", { name: "Create one" }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });
});
