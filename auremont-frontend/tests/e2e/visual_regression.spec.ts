/* jscpd:ignore-start */
import { test, expect } from '@playwright/test';

const CORS_HEADERS = {
  'access-control-allow-origin': 'http://localhost:3000',
  'access-control-allow-credentials': 'true',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
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

const MOCK_PRODUCTS_GRID = Array.from({ length: 8 }).map((_, i) => ({
  ...MOCK_PRODUCT,
  id: `mock-prod-${i + 1}`,
  name: `California Reserve Raw Almonds ${250 * (i + 1)}g`,
  slug: i === 0 ? 'california-reserve-raw' : `california-reserve-raw-${i + 1}`,
}));

const MOCK_CART = {
  id: 'mock-cart-1',
  items: [{
    id: 'mock-item-1',
    productId: MOCK_PRODUCT.id,
    quantity: 1,
    unitPrice: '999',
    subtotal: '999',
    product: MOCK_PRODUCT
  }]
};

const MOCK_ADMIN_METRICS = {
  todaySales: 25000,
  monthlySales: 450000,
  monthOrders: 128,
  totalCustomers: 340,
  lowStockProducts: 3
};

test.describe('RARE NUTS Visual Regression & Snapshot Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Bypass Splash Overlay
    await page.addInitScript(() => {
      sessionStorage.setItem('rarenuts_splash', 'true');
      sessionStorage.setItem('auremont_splash', 'true');
    });

    // 2. Mock API endpoints with non-overlapping URL matchers
    await page.route(url => url.pathname.includes('/products/'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_PRODUCT) });
    });

    await page.route(url => url.pathname.endsWith('/products') || url.pathname.endsWith('/products/'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: MOCK_PRODUCTS_GRID, meta: { total: 8, page: 1, lastPage: 1 } }) });
    });

    await page.route(url => url.pathname.includes('/cart'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_CART) });
    });

    await page.route(url => url.pathname.includes('/admin/dashboard/metrics'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_METRICS) });
    });

    await page.route(url => url.pathname.includes('/reviews'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(url => url.pathname.includes('/categories'), async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
      await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });
  });

  const preparePageForVisual = async (page: any) => {
    // Disable CSS animations and transitions for stable screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          caret-color: transparent !important;
        }
      `
    });

    // Wait for network idle & font rendering completion
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
  };

  test('Homepage Visual Screenshot Snapshot', async ({ page }) => {
    await page.goto('/');
    await preparePageForVisual(page);
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, maxDiffPixelRatio: 0.35 });
  });

  test('Shop Catalog Visual Screenshot Snapshot', async ({ page }) => {
    await page.goto('/shop');
    await preparePageForVisual(page);
    await expect(page).toHaveScreenshot('shop-catalog.png', { fullPage: true, maxDiffPixelRatio: 0.35 });
  });

  test('Bespoke Custom Gift Builder Visual Snapshot', async ({ page }) => {
    await page.goto('/custom-gift-box');
    await preparePageForVisual(page);
    await expect(page).toHaveScreenshot('custom-gift-builder.png', { fullPage: true, maxDiffPixelRatio: 0.15 });
  });

  test('Checkout Page Visual Screenshot Snapshot', async ({ page }) => {
    await page.goto('/checkout');
    await preparePageForVisual(page);
    await expect(page).toHaveScreenshot('checkout-page.png', { fullPage: true, maxDiffPixelRatio: 0.15 });
  });

  test('Admin Executive Dashboard Visual Snapshot', async ({ page }) => {
    await page.goto('/admin');
    await preparePageForVisual(page);
    await expect(page).toHaveScreenshot('admin-dashboard.png', { fullPage: true, maxDiffPixelRatio: 0.15 });
  });
});
