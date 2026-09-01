import robots from '../../auremont-frontend/app/robots';
import sitemap from '../../auremont-frontend/app/sitemap';
import { GET as getProductsSitemap } from '../../auremont-frontend/app/sitemap-products.xml/route';
import { GET as getCategoriesSitemap } from '../../auremont-frontend/app/sitemap-categories.xml/route';
import { GET as getBlogsSitemap } from '../../auremont-frontend/app/sitemap-blogs.xml/route';
import { GET as getSitemapIndex } from '../../auremont-frontend/app/sitemap_index.xml/route';
import { GET as getGoogleMerchantFeed } from '../../auremont-frontend/app/api/feeds/google-merchant/route';
import { metadata as shopMetadata } from '../../auremont-frontend/app/shop/layout';
import { metadata as aboutMetadata } from '../../auremont-frontend/app/about/layout';
import { metadata as corporateMetadata } from '../../auremont-frontend/app/corporate-gifts/layout';
import { metadata as customGiftMetadata } from '../../auremont-frontend/app/custom-gift-box/layout';
import { metadata as loginMetadata } from '../../auremont-frontend/app/login/layout';
import { metadata as adminMetadata } from '../../auremont-frontend/app/admin/layout';
import { generateMetadata as generateProductMetadata } from '../../auremont-frontend/app/shop/[slug]/layout';

describe('Auremont / RARE NUTS — Enterprise Technical SEO & Schema Test Suite', () => {
  const SITE_URL = 'https://rarenuts.in';

  describe('1. Robots.txt Compliance & Security Isolation', () => {
    it('should generate valid robots.txt rules blocking private routes while permitting public pages', () => {
      const robotsConfig = robots();
      expect(robotsConfig).toBeDefined();
      expect(robotsConfig.rules).toBeDefined();

      const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
      expect(rules.userAgent).toBe('*');

      // Allowed public paths
      const allowed = Array.isArray(rules.allow) ? rules.allow : [rules.allow];
      expect(allowed).toContain('/');
      expect(allowed).toContain('/shop');
      expect(allowed).toContain('/journal');
      expect(allowed).toContain('/about');
      expect(allowed).toContain('/custom-gift-box');
      expect(allowed).toContain('/corporate-gifts');

      // Disallowed private paths
      const disallowed = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
      expect(disallowed).toContain('/admin/');
      expect(disallowed).toContain('/account/');
      expect(disallowed).toContain('/cart');
      expect(disallowed).toContain('/checkout');
      expect(disallowed).toContain('/login');
      expect(disallowed).toContain('/register');
      expect(disallowed).toContain('/forgot-password');
      expect(disallowed).toContain('/reset-password');
      expect(disallowed).toContain('/api/');

      // Sitemaps referenced
      expect(robotsConfig.sitemap).toBeDefined();
      const sitemaps = Array.isArray(robotsConfig.sitemap) ? robotsConfig.sitemap : [robotsConfig.sitemap];
      expect(sitemaps.some((s) => s?.includes('sitemap.xml'))).toBe(true);
    });
  });

  describe('2. Master XML Sitemap & Sub-Sitemaps Integrity', () => {
    it('should generate a comprehensive sitemap containing core, category, journal hubs, and product URLs', async () => {
      const sitemapEntries = await sitemap();
      expect(Array.isArray(sitemapEntries)).toBe(true);
      expect(sitemapEntries.length).toBeGreaterThanOrEqual(25);

      const urls = sitemapEntries.map((e) => e.url);

      // Core pages present
      expect(urls).toContain(SITE_URL);
      expect(urls).toContain(`${SITE_URL}/shop`);
      expect(urls).toContain(`${SITE_URL}/custom-gift-box`);
      expect(urls).toContain(`${SITE_URL}/corporate-gifts`);
      expect(urls).toContain(`${SITE_URL}/about`);
      expect(urls).toContain(`${SITE_URL}/journal`);
      expect(urls).toContain(`${SITE_URL}/faq`);

      // Category landing URLs present
      expect(urls).toContain(`${SITE_URL}/shop/almonds`);
      expect(urls).toContain(`${SITE_URL}/shop/cashews`);
      expect(urls).toContain(`${SITE_URL}/shop/pistachios`);
      expect(urls).toContain(`${SITE_URL}/shop/walnuts`);

      // Journal editorial hubs present
      expect(urls).toContain(`${SITE_URL}/journal/buying-guides`);
      expect(urls).toContain(`${SITE_URL}/journal/health-benefits`);
      expect(urls).toContain(`${SITE_URL}/journal/comparisons`);
      expect(urls).toContain(`${SITE_URL}/journal/recipes`);

      // Products present
      expect(urls).toContain(`${SITE_URL}/shop/california-reserve-raw`);
      expect(urls).toContain(`${SITE_URL}/shop/roasted-sea-salt-almonds`);

      // No private or unapproved query URLs
      expect(urls.some((u) => u.includes('/admin'))).toBe(false);
      expect(urls.some((u) => u.includes('/cart'))).toBe(false);
      expect(urls.some((u) => u.includes('/checkout'))).toBe(false);
      expect(urls.some((u) => u.includes('/login'))).toBe(false);
    });

    it('should serve a valid XML sitemap-products feed', async () => {
      const res = await getProductsSitemap();
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(text).toContain('/shop/california-reserve-raw');
    });

    it('should serve a valid XML sitemap-categories feed without 404 paths', async () => {
      const res = await getCategoriesSitemap();
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('/shop/almonds');
      expect(text).toContain('/shop/cashews');
      expect(text).not.toContain('/shop/category/'); // Verified fix of old broken path
    });

    it('should serve a valid XML sitemap-blogs feed with editorial hubs and articles', async () => {
      const res = await getBlogsSitemap();
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('/journal/buying-guides');
      expect(text).toContain('/journal/health-benefits');
    });

    it('should serve a valid XML sitemap_index feed referencing sub-sitemaps', async () => {
      const res = await getSitemapIndex();
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(text).toContain('/sitemap.xml');
      expect(text).toContain('/sitemap-products.xml');
      expect(text).toContain('/sitemap-categories.xml');
      expect(text).toContain('/sitemap-blogs.xml');
    });
  });

  describe('3. Google Merchant Center Feed Validation', () => {
    it('should generate valid RSS 2.0 XML with Google Merchant attributes for all luxury nuts', async () => {
      const res = await getGoogleMerchantFeed();
      expect(res.status).toBe(200);
      const text = await res.text();

      expect(text).toContain('<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">');
      expect(text).toContain('<title>RARE NUTS Official Google Merchant Product Feed</title>');
      expect(text).toContain('<g:id>');
      expect(text).toContain('<g:title>');
      expect(text).toContain('<g:price>');
      expect(text).toContain('INR');
      expect(text).toContain('<g:availability>in_stock</g:availability>');
      expect(text).toContain('<g:brand>RARE NUTS</g:brand>');
      expect(text).toContain('<g:google_product_category>');

      // Verify active products included
      expect(text).toContain('california-reserve-raw');
      expect(text).toContain('royal-mangalore-jumbo-cashews');
      expect(text).toContain('roasted-sea-salt-almonds');
      expect(text).toContain('royal-almonds-wooden-box');
    });
  });

  describe('4. Metadata & Canonical URLs System', () => {
    it('should have unique, targeted metadata and canonical URLs for shop, about, and corporate pages', () => {
      expect(shopMetadata.title).toContain('Luxury Nuts');
      expect(shopMetadata.alternates?.canonical).toBe(`${SITE_URL}/shop`);

      expect(aboutMetadata.title).toContain('Heritage');
      expect(aboutMetadata.alternates?.canonical).toBe(`${SITE_URL}/about`);

      expect(corporateMetadata.title).toContain('Corporate Gifting');
      expect(corporateMetadata.alternates?.canonical).toBe(`${SITE_URL}/corporate-gifts`);

      expect(customGiftMetadata.title).toContain('Bespoke Gift Box');
      expect(customGiftMetadata.alternates?.canonical).toBe(`${SITE_URL}/custom-gift-box`);
    });

    it('should dynamically generate category-specific and product-specific metadata', async () => {
      const almondCatMeta = await generateProductMetadata({ params: Promise.resolve({ slug: 'almonds' }) });
      expect(almondCatMeta.title).toContain('California Almonds');
      expect(almondCatMeta.alternates?.canonical).toBe(`${SITE_URL}/shop/almonds`);

      const cashewCatMeta = await generateProductMetadata({ params: Promise.resolve({ slug: 'cashews' }) });
      expect(cashewCatMeta.title).toContain('Cashews');
      expect(cashewCatMeta.alternates?.canonical).toBe(`${SITE_URL}/shop/cashews`);

      const productMeta = await generateProductMetadata({ params: Promise.resolve({ slug: 'california-reserve-raw' }) });
      expect(productMeta.title).toBeDefined();
      expect(productMeta.alternates?.canonical).toBe(`${SITE_URL}/shop/california-reserve-raw`);
    });
  });

  describe('5. Private Route Noindex / Security Isolation', () => {
    it('should enforce robots: noindex, nofollow on administrative and authentication routes', () => {
      const loginRobots = loginMetadata.robots as any;
      expect(loginRobots).toBeDefined();
      expect(loginRobots.index).toBe(false);
      expect(loginRobots.follow).toBe(false);

      const adminRobots = adminMetadata.robots as any;
      expect(adminRobots).toBeDefined();
      expect(adminRobots.index).toBe(false);
      expect(adminRobots.follow).toBe(false);
    });
  });
});
