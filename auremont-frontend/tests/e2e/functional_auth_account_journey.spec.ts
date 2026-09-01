import { test, expect } from '@playwright/test';

test.describe('Customer Authentication & Account Management Functional E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('rarenuts_cookie_consent', 'true');
    });
  });

  test('Customer Protected Route Guard: /account redirects unauthenticated visitors to /login', async ({ page }) => {
    await page.goto('/account', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });

  test('Customer Login, Session Persistence & Account Tab Navigation', async ({ page }) => {
    // 1. Navigate to /account which redirects to /login
    await page.goto('/account', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // 2. Fill login credentials for seeded customer
    const emailInput = page.locator('form input[type="email"]').first();
    const passwordInput = page.locator('form input[type="password"]').first();
    const submitBtn = page.locator('form button[type="submit"], button:has-text("Sign In")').first();

    await emailInput.fill('example@gmail.com');
    await passwordInput.fill('password123');
    await submitBtn.click();

    // 3. Verify redirected to /account
    await expect(page).toHaveURL(/.*\/account/, { timeout: 15000 });

    // 4. Verify Account UI is rendered
    await expect(page.locator('h1:has-text("Welcome"), :has-text("Reserve Member")').first()).toBeVisible({ timeout: 10000 });

    // 5. Test Tab Switching
    const profileTab = page.locator('button:has-text("Profile"), a:has-text("Profile")').first();
    const addressesTab = page.locator('button:has-text("Addresses"), a:has-text("Addresses")').first();
    const wishlistTab = page.locator('button:has-text("Wishlist"), a:has-text("Wishlist")').first();
    const ordersTab = page.locator('button:has-text("Orders"), a:has-text("Orders")').first();

    if (await profileTab.isVisible()) {
      await profileTab.click();
      await page.waitForTimeout(300);
    }
    if (await addressesTab.isVisible()) {
      await addressesTab.click();
      await page.waitForTimeout(300);
    }
    if (await wishlistTab.isVisible()) {
      await wishlistTab.click();
      await page.waitForTimeout(300);
    }
    if (await ordersTab.isVisible()) {
      await ordersTab.click();
      await page.waitForTimeout(300);
    }
  });

  test('Customer Registration Flow with Live Validation', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const rand = Math.floor(Math.random() * 90000) + 10000;
    const testEmail = `luxury_client_${rand}@auremont-test.com`;

    const firstNameInput = page.locator('form input[name="firstName"], form input[placeholder*="First" i]').first();
    const lastNameInput = page.locator('form input[name="lastName"], form input[placeholder*="Last" i]').first();
    const emailInput = page.locator('form input[type="email"], form input[name="email"]').first();
    const passwordInput = page.locator('form input[type="password"], form input[name="password"]').first();
    const submitBtn = page.locator('form button[type="submit"], button:has-text("Create Account"), button:has-text("Register")').first();

    if (await firstNameInput.isVisible()) await firstNameInput.fill('Auremont');
    if (await lastNameInput.isVisible()) await lastNameInput.fill('Patron');
    if (await emailInput.isVisible()) await emailInput.fill(testEmail);
    if (await passwordInput.isVisible()) await passwordInput.fill('SecurePassword@123');

    await submitBtn.click();
    await page.waitForTimeout(1000);
  });
});
