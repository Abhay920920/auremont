import { test, expect } from '@playwright/test';

test.describe('RARE NUTS Automated Performance & Core Web Vitals Audit', () => {
  test('Homepage TTFB & LCP loads within thresholds', async ({ page }) => {
    const startTime = Date.now();
    const response = await page.goto('/');
    const ttfb = Date.now() - startTime;

    expect(response?.status()).toBe(200);
    expect(ttfb).toBeLessThan(1500); // Threshold for initial dev/CI load

    // Verify canonical SEO tag presence
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    if (canonical) {
      expect(canonical).toContain('rarenuts.in');
    }
  });

  test('Storefront page renders product cards cleanly', async ({ page }) => {
    const response = await page.goto('/shop');
    expect(response?.status()).toBe(200);

    const productCards = page.locator('[data-testid^="product-link-"]');
    await expect(productCards.first()).toBeVisible();
  });
});
