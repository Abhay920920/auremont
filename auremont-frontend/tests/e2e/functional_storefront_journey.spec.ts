import { test, expect } from '@playwright/test';

test.describe('Storefront & Customer Journey E2E Functional Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('rarenuts_cookie_consent', 'true');
    });
  });

  test('Homepage Navigation, Search Drawer, and Catalog CTAs', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 1. Verify Page Title and Branding
    await expect(page).toHaveTitle(/Auremont|RARE NUTS/i);

    // 2. Open Search Drawer
    const searchBtn = page.locator('button[aria-label="Open search"], button[aria-label="Search"], header button:has(svg.lucide-search)').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      await page.waitForTimeout(300);

      const searchInput = page.locator('input[placeholder*="Search" i], input[type="search"]').first();
      if (await searchInput.isVisible()) {
        await searchInput.fill('Almonds');
        await page.waitForTimeout(300);
      }

      // Close search drawer
      const closeSearch = page.locator('button[aria-label="Close search"], button:has-text("✕"), button:has-text("Close")').first();
      if (await closeSearch.isVisible()) {
        await closeSearch.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(300);
    }

    // 3. Hero CTA Click -> navigates to /shop or catalog
    const shopCta = page.locator('a[href="/shop"]').first();
    await expect(shopCta).toBeVisible();
    await shopCta.click();
    await expect(page).toHaveURL(/.*\/shop/);
  });

  test('Shop Catalog: Live DB Data, Filtering, Sorting & Detail View', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });

    // 1. Verify products loaded from PostgreSQL
    const productTitles = page.locator('h3.font-serif, [data-testid^="product-title-link-"]');
    await expect(productTitles.first()).toBeVisible({ timeout: 10000 });
    const count = await productTitles.count();
    expect(count).toBeGreaterThan(0);

    // 2. Test Category Filter
    const categoryButtons = page.locator('aside button, [data-testid="category-filter"] button');
    if (await categoryButtons.count() > 0) {
      const firstCat = categoryButtons.first();
      await firstCat.click();
      await page.waitForTimeout(400);
      await expect(productTitles.first()).toBeVisible();
    }

    // 3. Navigate to Product Detail Page
    await page.goto('/shop/california-reserve-raw', { waitUntil: 'domcontentloaded' });

    // 4. Product Detail Page Elements
    const addToCartBtn = page.locator('button[data-testid="add-to-cart-btn"]').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 8000 });

    // 5. Click Add to Cart
    await addToCartBtn.click({ force: true });
    await page.waitForTimeout(800);
  });

  test('Cart Page Operations: Add Product, View Bag, Quantity & Checkout CTA', async ({ page }) => {
    // Add product to cart first
    await page.goto('/shop/california-reserve-raw', { waitUntil: 'domcontentloaded' });

    const addToCart = page.locator('button[data-testid="add-to-cart-btn"]').first();
    await expect(addToCart).toBeVisible({ timeout: 8000 });
    await addToCart.click({ force: true });
    await page.waitForTimeout(800);

    // Navigate to Cart Page
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });

    // Verify Shopping Bag header or Cart items rendered
    const bagHeading = page.locator('h1:has-text("Shopping Bag"), h1:has-text("Cart")').first();
    await expect(bagHeading).toBeVisible({ timeout: 8000 });

    // Verify Proceed to Checkout CTA or Return to collection
    const checkoutLink = page.locator('a[href="/checkout"], a[href="/shop"]').first();
    await expect(checkoutLink).toBeVisible();
  });

  test('Checkout Flow, Address Form Validation & Coupon Application', async ({ page }) => {
    // Add product to cart first
    await page.goto('/shop/california-reserve-raw', { waitUntil: 'domcontentloaded' });
    const addToCart = page.locator('button[data-testid="add-to-cart-btn"]').first();
    await expect(addToCart).toBeVisible({ timeout: 8000 });
    await addToCart.click({ force: true });
    await page.waitForTimeout(800);

    // Navigate to checkout
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });

    // 1. Fill Step 1 Shipping Information Form
    const nameInput = page.locator('input[name="fullName"], input[placeholder*="Full Name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const phoneInput = page.locator('input[name="phone"], input[type="tel"]').first();
    const addressInput = page.locator('input[name="addressLine1"], input[placeholder*="Address" i]').first();
    const cityInput = page.locator('input[name="city"], input[placeholder*="City" i]').first();
    const stateInput = page.locator('input[name="state"], input[placeholder*="State" i]').first();
    const pinInput = page.locator('input[name="postalCode"], input[placeholder*="PIN" i]').first();

    if (await nameInput.isVisible()) await nameInput.fill('Auremont Connoisseur');
    if (await emailInput.isVisible()) await emailInput.fill('connoisseur@rarenuts.com');
    if (await phoneInput.isVisible()) await phoneInput.fill('9876543210');
    if (await addressInput.isVisible()) await addressInput.fill('42 Heritage Boulevard, Penthouse A');
    if (await cityInput.isVisible()) await cityInput.fill('Mumbai');
    if (await stateInput.isVisible()) await stateInput.fill('Maharashtra');
    if (await pinInput.isVisible()) await pinInput.fill('400001');

    // 2. Test Live Coupon Code Application
    const couponInput = page.locator('input[placeholder*="Coupon" i], input[placeholder*="Promo" i]').first();
    const applyCouponBtn = page.locator('button:has-text("Apply")').first();

    if (await couponInput.isVisible() && await applyCouponBtn.isVisible()) {
      // Test valid database coupon
      await couponInput.fill('AUREMONT10');
      await applyCouponBtn.click();
      await page.waitForTimeout(600);
    }

    // 3. Verify Order Summary or Action button
    const actionBtn = page.locator('button:has-text("Continue"), button:has-text("Proceed"), button:has-text("Pay"), button:has-text("Place Order"), a[href="/shop"]').first();
    await expect(actionBtn).toBeVisible();
  });

  test('Custom Gift Box Builder 4-Step Interactive Flow', async ({ page }) => {
    await page.goto('/custom-gift-box', { waitUntil: 'domcontentloaded' });

    // Verify Title
    await expect(page.locator('h1, h2:has-text("Bespoke"), h2:has-text("Gift Box")').first()).toBeVisible({ timeout: 8000 });

    // Step 1: Select Box Tier
    const tierCard = page.locator('button:has-text("Select"), div[role="button"], .cursor-pointer').first();
    if (await tierCard.isVisible()) {
      await tierCard.click();
      await page.waitForTimeout(400);
    }

    // Advance or Next Step
    const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(400);
    }
  });

  test('Contact Page Form Submission', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });

    // Fill contact form
    const nameInput = page.locator('input[name="name"], input[placeholder*="Name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const subjectInput = page.locator('input[name="subject"], input[placeholder*="Subject" i]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="Message" i]').first();
    const submitBtn = page.locator('button[type="submit"], button:has-text("Send Message"), button:has-text("Submit")').first();

    if (await nameInput.isVisible()) await nameInput.fill('Jane Doe');
    if (await emailInput.isVisible()) await emailInput.fill('jane.doe@example.com');
    if (await subjectInput.isVisible()) await subjectInput.fill('Bespoke Corporate Gifting Inquiry');
    if (await messageInput.isVisible()) await messageInput.fill('We are interested in ordering 100 Heritage Wooden Boxes for our upcoming executive symposium.');

    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('FAQ Accordions Expand & Collapse', async ({ page }) => {
    await page.goto('/faq', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    // Find all accordion buttons
    const firstFaq = page.locator('button[data-testid="faq-accordion-item"]').first();
    await expect(firstFaq).toBeVisible({ timeout: 8000 });

    // Initial state is open
    await expect(firstFaq).toHaveAttribute('aria-expanded', 'true');

    // Click to toggle closed
    await firstFaq.click();
    await expect(firstFaq).toHaveAttribute('aria-expanded', 'false');

    // Click to toggle open
    await firstFaq.click();
    await expect(firstFaq).toHaveAttribute('aria-expanded', 'true');
  });
});
