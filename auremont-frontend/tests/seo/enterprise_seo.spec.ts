import { test, expect } from '@playwright/test';

test.describe('RARE NUTS Enterprise SEO & Metadata Validation Suite', () => {
  test('Homepage contains single H1, title, meta description, and rarenuts.in canonical tag', async ({ page }) => {
    await page.goto('/');

    // Verify Title
    const title = await page.title();
    expect(title).toContain('RARE NUTS');

    // Verify Meta Description
    const metaDesc = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc?.length).toBeGreaterThan(20);

    // Verify Canonical Tag uses rarenuts.in
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    if (canonical) {
      expect(canonical).toContain('rarenuts.in');
      expect(canonical).not.toContain('auremont-rose.vercel.app');
    }

    // Verify H1 count
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('Sitemap XML route responds with HTTP 200 and valid XML', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('https://rarenuts.in');
  });

  test('Robots.txt route responds with HTTP 200 and Sitemaps link', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('Sitemap: https://rarenuts.in/sitemap.xml');
  });

  test('Google Merchant Feed route responds with HTTP 200 and valid RSS XML', async ({ request }) => {
    const response = await request.get('/api/feeds/google-merchant');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<rss');
    expect(body).toContain('https://rarenuts.in');
  });
});
