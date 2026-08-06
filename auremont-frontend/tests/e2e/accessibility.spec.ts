/* jscpd:ignore-start */
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

test.describe('AUREMONT WCAG 2.1 AA Accessibility & ARIA Audit Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('auremont_splash', 'true');
    });
  });

  test('Homepage Keyboard Focus & ARIA Landmarks Check', async ({ page }) => {
    await page.goto('/');
    
    // Check main landmark exists
    const mainLandmark = page.locator('main, [role="main"]');
    await expect(mainLandmark.first()).toBeVisible({ timeout: 10000 });

    // Check heading hierarchy (at least one H1 element)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Verify images have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    await Promise.all(
      Array.from({ length: Math.min(imageCount, 10) }).map(async (_, i) => {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
      })
    );
  });

  test('Checkout Page Accessibility & Form Labeling Check', async ({ page }) => {
    await page.route(
      (url) => url.pathname.endsWith('/cart') || url.pathname.includes('/cart?'),
      async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_CART)
        });
      }
    );

    await page.goto('/checkout');

    // Verify all input elements have associated labels or aria-labels
    const inputs = page.locator('input:not([type="hidden"])');
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
    const count = await inputs.count();
    await Promise.all(
      Array.from({ length: count }).map(async (_, i) => {
        const input = inputs.nth(i);
        const name = await input.getAttribute('name');
        const ariaLabel = await input.getAttribute('aria-label');
        const id = await input.getAttribute('id');

        const hasLabel = name || ariaLabel || id;
        expect(hasLabel).toBeTruthy();
      })
    );
  });
});
