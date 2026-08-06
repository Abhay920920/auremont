import { test, expect } from '@playwright/test';

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
};

const MOCK_USER = {
  id: 'mock-user-1',
  firstName: 'Alexander',
  lastName: 'Vance',
  email: 'alexander.vance@auremont.com',
  phone: '+919876543210',
};

const MOCK_PRODUCT = {
  id: 'mock-prod-1',
  name: 'California Reserve Raw Almonds 250g',
  slug: 'california-reserve-raw',
  price: 999,
  weightGrams: 250,
  thumbnailUrl: '/images/california-almonds-250g.png',
  shortDescription: 'Signature matte black pouch.',
  stockQty: 50,
};

const MOCK_CART = {
  id: 'mock-cart-1',
  items: [{
    id: 'mock-item-1',
    productId: MOCK_PRODUCT.id,
    quantity: 1,
    unitPrice: '999',
    subtotal: '999',
    product: {
      name: MOCK_PRODUCT.name,
      thumbnailUrl: MOCK_PRODUCT.thumbnailUrl,
      slug: MOCK_PRODUCT.slug,
    }
  }]
};

const MOCK_COUPON = {
  id: 'coupon-1',
  code: 'LUXURY20',
  type: 'percentage',
  value: 20,
  maxDiscount: 500,
};

const MOCK_ORDER_RESPONSE = {
  id: 'mock-order-1',
  paymentSession: {
    razorpayOrderId: 'order_mock_JOURNEY123',
    amount: 83916,
    currency: 'INR',
  }
};

test.describe('AUREMONT End-to-End E2E Full User Journey', () => {
  test('Complete E2E Journey: Register -> Login -> Catalog Browse -> Add to Cart -> Apply Coupon -> Checkout -> Order Creation', async ({ page }) => {
    
    // ── 0. PRE-SET SESSION FLAGS & MOCKS ────────────────────────────────────
    await page.addInitScript(() => {
      sessionStorage.setItem('auremont_splash', 'true');
      (window as any).Razorpay = function(options: any) {
        return { open: () => {}, on: () => {} };
      };
    });

    await page.route('**/*razorpay.com*/**', async route => await route.abort());

    // Mock API Routes (Non-overlapping URL matchers)
    await page.route(url => url.pathname.includes('/auth/register'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({
        status: 201,
        headers: CORS_HEADERS,
        contentType: 'application/json',
        body: JSON.stringify({
          user: MOCK_USER,
          access_token: 'mock_jwt_access',
          refresh_token: 'mock_jwt_refresh',
          accessToken: 'mock_jwt_access',
          refreshToken: 'mock_jwt_refresh'
        })
      });
    });

    await page.route(url => url.pathname.includes('/auth/login'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({
        status: 200,
        headers: CORS_HEADERS,
        contentType: 'application/json',
        body: JSON.stringify({
          user: MOCK_USER,
          access_token: 'mock_jwt_access',
          refresh_token: 'mock_jwt_refresh',
          accessToken: 'mock_jwt_access',
          refreshToken: 'mock_jwt_refresh'
        })
      });
    });

    await page.route(url => url.pathname.includes('/auth/me'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_USER) });
    });

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

    await page.route(url => url.pathname.includes('/coupons/validate'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ coupon: MOCK_COUPON, discountAmount: 199.8 }) });
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

    // Step 1: Open Homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Auremont/i);

    // Step 2: Navigate to Register Page & Register New User
    await page.goto('/register');
    const testEmail = `e2e_user_${Date.now()}@auremont.com`;
    
    await page.fill('input[name="firstName"]', 'Alexander');
    await page.fill('input[name="lastName"]', 'Vance');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'LuxuryPassword@2026');

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/auth/register')),
      page.click('button[type="submit"]'),
    ]);

    // Step 3: Browse Shop Catalog
    await page.goto('/shop');
    await expect(page.locator('h1')).toContainText(/Catalog|Collection/i);

    // Step 4: Click Product to view Details
    await page.goto('/shop/california-reserve-raw');
    await expect(page).toHaveURL(/.*\/shop\/california-reserve-raw/);

    // Step 5: Add Product to Shopping Cart with Network Barrier
    const addToCartBtn = page.getByTestId('add-to-cart-btn').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/cart') && res.status() === 200),
      addToCartBtn.click({ force: true }),
    ]);

    // Step 6: Navigate to Checkout
    await page.goto('/checkout');
    await expect(page.locator('h1')).toContainText(/Checkout/i);

    // Step 7: Fill Shipping Address Information
    await page.locator('input[name="fullName"]').fill('Alexander Vance');
    await page.locator('input[name="phone"]').fill('9876543210');
    await page.locator('input[name="addressLine1"]').fill('100 Regal Boulevard');
    await page.locator('input[name="city"]').fill('Mumbai');
    await page.locator('input[name="state"]').fill('Maharashtra');
    await page.locator('input[name="postalCode"]').fill('400001');

    // Step 8: Apply Promo Coupon
    const couponInput = page.locator('input[name="couponCode"]');
    if (await couponInput.isVisible()) {
      await couponInput.fill('LUXURY20');
      const applyBtn = page.locator('button:has-text("Apply")');
      if (await applyBtn.isVisible()) {
        await Promise.all([
          page.waitForResponse(res => res.url().includes('/coupons/validate')),
          applyBtn.click(),
        ]);
      }
    }

    // Step 9: Proceed to Payment Step
    const continueBtn = page.getByRole('button', { name: /Continue to Payment/i });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click({ force: true });

    // Step 10: Complete Purchase
    const placeOrderBtn = page.getByRole('button', { name: /Complete Purchase/i });
    await expect(placeOrderBtn).toBeVisible();

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/orders')),
      placeOrderBtn.click({ force: true }),
    ]);

    // Step 11: Assert Order Confirmation UI
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 15000 });
  });
});
