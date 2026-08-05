import { test, expect } from '@playwright/test';

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

    // ── 0. PRE-SET SESSION FLAGS & MOCKS to bypass entrance splash + Razorpay CDN
    await page.addInitScript(() => {
      sessionStorage.setItem('auremont_splash', 'true');
      (window as any).Razorpay = function(options: any) {
        return { open: () => {}, on: () => {} };
      };
    });

    await page.route(
      (url) => url.hostname.includes('razorpay.com'),
      async route => { await route.abort(); }
    );

    // ── 1. MOCK ALL API ENDPOINTS using URL function matchers
    await page.route(
      (url) => url.pathname.includes('/products/california-reserve-raw'),
      async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_PRODUCT)
        });
      }
    );

    await page.route(
      (url) => url.pathname.endsWith('/products') && !url.pathname.includes('/products/'),
      async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [MOCK_PRODUCT], meta: { total: 1, page: 1, lastPage: 1 } })
        });
      }
    );

    let cartHasItem = false;
    await page.route(
      (url) => url.pathname.endsWith('/cart') || url.pathname.includes('/cart?'),
      async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(cartHasItem ? MOCK_CART : { id: 'mock-cart-1', items: [] })
        });
      }
    );

    await page.route(
      (url) => url.pathname.endsWith('/cart/items'),
      async route => {
        cartHasItem = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_CART)
        });
      }
    );

    await page.route(
      (url) => url.pathname.endsWith('/orders'),
      async route => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_ORDER_RESPONSE)
        });
      }
    );

    await page.route(
      (url) => url.pathname.includes('/payments/verify'),
      async route => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      }
    );

    await page.route((url) => url.pathname.includes('/reviews'), async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.route((url) => url.pathname.includes('/categories'), async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });
    await page.route((url) => url.pathname.includes('/coupons'), async route => {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not found' }) });
    });

    // ── 2. NAVIGATE TO PRODUCT DETAIL PAGE DIRECTLY ──────────────────────────
    await page.goto('/shop/california-reserve-raw');
    await expect(page).toHaveURL(/.*\/shop\/california-reserve-raw/, { timeout: 10000 });

    // ── 3. ADD TO CART on product page ──────────────────────────────────────
    const addToCartBtn = page.getByTestId('add-to-cart-btn').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click({ force: true });

    // ── 4. PROCEED TO CHECKOUT ───────────────────────────────────────────────
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*\/checkout/, { timeout: 10000 });

    // ── 5. FILL SHIPPING FORM ────────────────────────────────────────────────
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 });
    await page.locator('input[name="email"]').fill('e2e_tester@auremont.com');
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
    await completeBtn.click({ force: true });

    // ── 9. VERIFY SUCCESS OVERLAY ────────────────────────────────────────────
    await expect(page.getByText('Order Confirmed')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Payment successful/i)).toBeVisible();
  });
});
