import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

const publicRoutes = [
  '/',
  '/about',
  '/shop',
  '/gifting',
  '/gifting/diwali',
  '/gifting/weddings',
  '/corporate-gifts',
  '/press',
  '/terms',
  '/privacy-policy',
  '/shipping',
  '/returns',
  '/faq',
  '/contact',
];

const privateRoutes = [
  '/account',
  '/checkout',
  '/cart',
];

test.describe('Enterprise Technical SEO Quality Gate', () => {

  // 1. Public Route Standards
  publicRoutes.forEach((route) => {
    test(`Public Route ${route} should satisfy SEO standards`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      // Title Test
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title).toContain('RARE NUTS');

      // Meta Description Test
      const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription!.length).toBeGreaterThan(30);

      // Single H1 Tag Test
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Canonical Tag Test
      const canonicalHref = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonicalHref).toBeTruthy();

      // OpenGraph Title Test
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle).toBeTruthy();
    });
  });

  // 2. Private Route Security & Noindex Hardening
  privateRoutes.forEach((route) => {
    test(`Private Route ${route} should have noindex robots metadata`, async ({ page }) => {
      await page.goto(route);
      const robotsMeta = await page.getAttribute('meta[name="robots"]', 'content');
      expect(robotsMeta).toBeTruthy();
      expect(robotsMeta?.toLowerCase()).toContain('noindex');
    });
  });

  // 3. Canonical Parameter Hardening & Legacy Domain Check
  test('Query parameters should canonicalize to main base URL and reject legacy Vercel domain', async ({ page }) => {
    await page.goto('/shop?sort=price&utm_source=test&variant=250g');
    const canonicalHref = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonicalHref).toMatch(/(?:https:\/\/rarenuts\.in|http:\/\/localhost:3000)\/shop$/);
    expect(canonicalHref).not.toContain('auremont-rose.vercel.app');
  });

  // 4. Technical Drivers (Robots, Sitemap, Merchant Feed)
  test('Robots.txt should serve valid directives', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body.toLowerCase()).toContain('user-agent: *');
    expect(body).toContain('Disallow: /admin/');
    expect(body).toContain('Sitemap:');
  });

  test('Sitemap.xml should serve valid XML routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('/shop');
    expect(body).toContain('/custom-gift-box');
  });

  test('Google Merchant Feed API should serve valid RSS XML', async ({ request }) => {
    const response = await request.get('/api/feeds/google-merchant');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain('<g:brand>RARE NUTS</g:brand>');
  });
});
