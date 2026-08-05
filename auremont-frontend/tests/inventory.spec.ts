import { test, expect } from '@playwright/test';

const MOCK_PRODUCT = {
  id: 'mock-prod-1',
  name: 'California Reserve Raw Almonds 250g',
  slug: 'california-reserve-raw',
  price: 999,
  weightGrams: 250,
  thumbnailUrl: '/images/california-almonds-250g.png',
  shortDescription: 'Signature matte black pouch.',
  stockQty: 1,
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

test.describe('Reliability: Inventory Concurrency', () => {
  test('should prevent checkout if cart exceeds available stock', async ({ page }) => {

    // ── 0. PRE-SET SESSION FLAGS & MOCKS ────────────────────────────────────
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

    // ── 1. MOCK ALL API ENDPOINTS ────────────────────────────────────────────
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
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Insufficient stock for California Reserve Raw Almonds 250g',
            error: 'Conflict'
          })
        });
      }
    );

    await page.route((url) => url.pathname.includes('/reviews'), async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.route((url) => url.pathname.includes('/categories'), async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });

    // ── 2. NAVIGATE TO PRODUCT DETAIL PAGE DIRECTLY ──────────────────────────
    await page.goto('/shop/california-reserve-raw');
    await expect(page).toHaveURL(/.*\/shop\/california-reserve-raw/, { timeout: 10000 });

    // ── 3. ADD TO CART ───────────────────────────────────────────────────────
    const addToCartBtn = page.getByTestId('add-to-cart-btn').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click({ force: true });

    // ── 4. PROCEED TO CHECKOUT ───────────────────────────────────────────────
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*\/checkout/, { timeout: 10000 });

    // ── 5. FILL SHIPPING FORM ────────────────────────────────────────────────
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 });
    await page.locator('input[name="email"]').fill('race_condition@auremont.com');
    await page.locator('input[name="fullName"]').fill('Tester User');
    await page.locator('input[name="phone"]').fill('9876543210');
    await page.locator('input[name="addressLine1"]').fill('123 Test Street');
    await page.locator('input[name="city"]').fill('Mumbai');
    await page.locator('input[name="state"]').fill('Maharashtra');
    await page.locator('input[name="postalCode"]').fill('400001');

    // ── 6. CONTINUE TO PAYMENT ───────────────────────────────────────────────
    const continueBtn = page.getByRole('button', { name: /Continue to Payment/i });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click({ force: true });
    await expect(page.getByText('Razorpay Secure Checkout')).toBeVisible({ timeout: 5000 });

    // ── 7. TRIGGER ORDER (will hit 409 Conflict) ─────────────────────────────
    const completeBtn = page.getByRole('button', { name: /Complete Purchase/i });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click({ force: true });

    // ── 8. ASSERT GRACEFUL ERROR MESSAGE ─────────────────────────────────────
    await expect(page.getByText(/Insufficient stock/i)).toBeVisible({ timeout: 10000 });
  });
});
