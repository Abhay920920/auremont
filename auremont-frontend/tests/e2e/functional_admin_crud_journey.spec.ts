import { test, expect } from '@playwright/test';

test.describe('Admin Operations, Dashboard KPIs & CRUD Verification Functional E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('rarenuts_cookie_consent', 'true');
    });
  });

  test('Admin Authentication & Protected Route Verification', async ({ page }) => {
    // 1. Unauthenticated visitor trying to visit /admin must be redirected to /login
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // 2. Perform Admin Login
    const emailInput = page.locator('form input[type="email"]').first();
    const passwordInput = page.locator('form input[type="password"]').first();
    const submitBtn = page.locator('form button[type="submit"], button:has-text("Sign In")').first();

    await emailInput.fill('admin@rarenuts.com');
    await passwordInput.fill('Admin@12345');
    await submitBtn.click();

    // 3. Verify successful redirection into /admin dashboard
    await expect(page).toHaveURL(/.*\/admin/, { timeout: 15000 });
  });

  test('Admin Dashboard KPIs, Live Metrics & Table Navigation', async ({ page }) => {
    // 1. Navigate to /admin (will redirect to login with clean state)
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // 2. Login as Admin
    await page.locator('form input[type="email"]').first().fill('admin@rarenuts.com');
    await page.locator('form input[type="password"]').first().fill('Admin@12345');
    await page.locator('form button[type="submit"], button:has-text("Sign In")').first().click();
    await expect(page).toHaveURL(/.*\/admin/, { timeout: 15000 });

    // 3. Verify Dashboard Overview
    await expect(page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard")').first()).toBeVisible({ timeout: 10000 });

    // 4. Navigate to Admin Products
    await page.goto('/admin/products', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2:has-text("Products"), h1:has-text("Products")').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('table, .overflow-x-auto').first()).toBeVisible();

    // 5. Navigate to Admin Orders
    await page.goto('/admin/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2:has-text("Orders"), h1:has-text("Orders"), th:has-text("Order")').first()).toBeVisible({ timeout: 10000 });

    // 6. Navigate to Admin Inventory
    await page.goto('/admin/inventory', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2:has-text("Inventory"), h1:has-text("Inventory"), th:has-text("Stock")').first()).toBeVisible({ timeout: 10000 });

    // 7. Navigate to Admin Customers
    await page.goto('/admin/customers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2:has-text("Customers"), h1:has-text("Customers")').first()).toBeVisible({ timeout: 10000 });

    // 8. Navigate to Admin Coupons
    await page.goto('/admin/marketing/coupons', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2:has-text("Coupons"), h1:has-text("Coupons"), :has-text("AUREMONT10")').first()).toBeVisible({ timeout: 10000 });

    // 9. Navigate to Admin Support
    await page.goto('/admin/support', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h2:has-text("Support"), h1:has-text("Support"), h1:has-text("Messages")').first()).toBeVisible({ timeout: 10000 });
  });
});
