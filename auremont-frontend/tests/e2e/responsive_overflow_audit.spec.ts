import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  // Mobile
  { name: 'Mobile 320px', width: 320, height: 568 },
  { name: 'Mobile 360px', width: 360, height: 640 },
  { name: 'Mobile 375px', width: 375, height: 667 },
  { name: 'Mobile 390px', width: 390, height: 844 },
  { name: 'Mobile 414px', width: 414, height: 896 },
  // Tablet
  { name: 'Tablet 600px', width: 600, height: 960 },
  { name: 'Tablet 768px', width: 768, height: 1024 },
  { name: 'Tablet 820px', width: 820, height: 1180 },
  { name: 'Tablet 912px', width: 912, height: 1368 },
  // Desktop
  { name: 'Desktop 1024px', width: 1024, height: 768 },
  { name: 'Desktop 1280px', width: 1280, height: 800 },
  { name: 'Desktop 1366px', width: 1366, height: 768 },
  { name: 'Desktop 1440px', width: 1440, height: 900 },
  { name: 'Large Desktop 1920px', width: 1920, height: 1080 },
];

const ROUTES = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/faq',
  '/journal',
  '/pairing',
  '/custom-gift-box',
  '/corporate-gifts',
  '/cart',
  '/checkout',
  '/login',
  '/register',
  '/forgot-password',
  '/privacy-policy',
  '/terms',
  '/shipping',
  '/returns',
];

test.describe('Responsive Layout & Zero Horizontal Overflow Verification', () => {
  for (const bp of BREAKPOINTS) {
    test.describe(`${bp.name} (${bp.width}x${bp.height})`, () => {
      test.use({ viewport: { width: bp.width, height: bp.height } });

      for (const route of ROUTES) {
        test(`Verify zero overflow and rendering on ${route}`, async ({ page }) => {
          await page.addInitScript(() => {
            sessionStorage.setItem('rarenuts_splash', 'true');
            sessionStorage.setItem('auremont_splash', 'true');
          });

          await page.goto(route, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(300);

          // Verify zero unintended horizontal overflow
          const overflow = await page.evaluate(() => {
            const scrollWidth = document.documentElement.scrollWidth;
            const innerWidth = window.innerWidth;
            return {
              scrollWidth,
              innerWidth,
              hasOverflow: scrollWidth > innerWidth,
            };
          });

          expect(
            overflow.hasOverflow,
            `Horizontal overflow detected on ${route} at ${bp.name}: scrollWidth (${overflow.scrollWidth}) > innerWidth (${overflow.innerWidth})`
          ).toBe(false);
        });
      }
    });
  }
});
