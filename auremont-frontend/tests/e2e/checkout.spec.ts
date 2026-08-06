import { test, expect } from '@playwright/test';

import { CORS_HEADERS, MOCK_PRODUCT, MOCK_CART } from './mocks';

const MOCK_ORDER_RESPONSE = {
  id: 'mock-order-1',
  paymentSession: {
    razorpayOrderId: 'order_mock_TEST123',
    amount: 104895,
    currency: 'INR',
  }
};

test.describe('Critical Path: Guest Checkout Flow', () => {
  test('should successfully add to cart and complete checkout', async ({ page }) => {

    // ── 0. PRE-SET SESSION FLAGS & MOCKS ────────────────────────────────────
    await page.addInitScript(() => {
      sessionStorage.setItem('auremont_splash', 'true');
      (window as any).Razorpay = function(options: any) {
        return { open: () => {}, on: () => {} };
      };
    });

    await page.route('**/*razorpay.com*/**', async route => await route.abort());

    // ── 1. MOCK API ENDPOINTS (Non-overlapping URL matchers) ─────────────────
    await page.route(url => url.pathname.includes('/products/'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_PRODUCT) });
    });

    await page.route(url => url.pathname.endsWith('/products') || url.pathname.endsWith('/products/'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: [MOCK_PRODUCT], meta: { total: 1, page: 1, lastPage: 1 } }) });
    });

    await page.route(url => url.pathname.includes('/cart'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_CART) });
    });

    await page.route(url => url.pathname.includes('/orders'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 201, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_ORDER_RESPONSE) });
    });

    await page.route(url => url.pathname.includes('/payments/verify'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await page.route(url => url.pathname.includes('/reviews'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(url => url.pathname.includes('/categories'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });

    await page.route(url => url.pathname.includes('/coupons'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 404, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ message: 'Not found' }) });
    });

    // ── 2. NAVIGATE TO PRODUCT DETAIL PAGE DIRECTLY ──────────────────────────
    await page.goto('/shop/california-reserve-raw');
    await expect(page).toHaveURL(/.*\/shop\/california-reserve-raw/, { timeout: 10000 });

    // ── 3. ADD TO CART WITH NETWORK RESPONSE BARRIER ──────────────────────────
    const addToCartBtn = page.getByTestId('add-to-cart-btn').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/cart') && res.status() === 200),
      addToCartBtn.click({ force: true }),
    ]);

    // ── 4. PROCEED TO CHECKOUT ───────────────────────────────────────────────
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*\/checkout/, { timeout: 10000 });

    // ── 5. FILL SHIPPING FORM ────────────────────────────────────────────────
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill('e2e_tester@auremont.com');
    await page.locator('input[name="fullName"]').fill('Playwright Tester');
    await page.locator('input[name="phone"]').fill('9876543210');
    await page.locator('input[name="addressLine1"]').fill('123 Automation Lane');
    await page.locator('input[name="city"]').fill('Testing City');
    await page.locator('input[name="state"]').fill('CA');
    await page.locator('input[name="postalCode"]').fill('90210');

    // ── 6. CONTINUE TO PAYMENT ───────────────────────────────────────────────
    const continueBtn = page.getByRole('button', { name: /Continue to Payment/i });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click({ force: true });

    // ── 7. VERIFY PAYMENT STEP ──────────────────────────────────────────────
    await expect(page.getByText('Razorpay Secure Checkout')).toBeVisible({ timeout: 5000 });

    // ── 8. COMPLETE PURCHASE ─────────────────────────────────────────────────
    const completeBtn = page.getByRole('button', { name: /Complete Purchase/i });
    await expect(completeBtn).toBeVisible();

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/orders')),
      completeBtn.click({ force: true }),
    ]);

    // ── 9. VERIFY SUCCESS OVERLAY ────────────────────────────────────────────
    await expect(page.getByText('Order Confirmed')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Payment successful/i)).toBeVisible();
  });
});
