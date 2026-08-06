# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual_regression.spec.ts >> AUREMONT Visual Regression & Snapshot Test Suite >> Shop Catalog Visual Screenshot Snapshot
- Location: tests\e2e\visual_regression.spec.ts:110:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1280px by 2179px, received 1280px by 1618px. 

  Snapshot: shop-catalog.png

Call log:
  - Expect "toHaveScreenshot(shop-catalog.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1280px by 2179px, received 1280px by 1618px.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1280px by 2179px, received 1280px by 1618px.

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - paragraph [ref=e3]: Complimentary shipping on all orders over ₹2000
    - button "Close announcement" [ref=e4] [cursor=pointer]
  - banner [ref=e8]:
    - generic [ref=e9]:
      - navigation
      - link "Auremont" [ref=e11] [cursor=pointer]:
        - /url: /
      - generic [ref=e12]:
        - combobox [ref=e14] [cursor=pointer]:
          - option "INR ₹" [selected]
          - option "USD $"
          - option "EUR €"
          - option "GBP £"
        - button "Search" [ref=e15] [cursor=pointer]
        - link "Sign In" [ref=e20] [cursor=pointer]:
          - /url: /login
        - button "Cart" [ref=e21] [cursor=pointer]
  - main [ref=e23]:
    - generic [ref=e25]:
      - generic [ref=e27]:
        - heading "The Collection" [level=4] [ref=e28]
        - heading "California's Finest" [level=1] [ref=e29]
        - paragraph [ref=e30]: Peruse our curated selection of premium almonds. Each harvest is subjected to rigorous quality control to ensure only the absolute finest nuts reach our bespoke packaging.
      - generic [ref=e31]:
        - complementary [ref=e32]:
          - generic [ref=e34]:
            - heading "Filters" [level=3] [ref=e35]
            - generic [ref=e36]:
              - button "Collection" [ref=e37] [cursor=pointer]
              - list [ref=e42]:
                - listitem [ref=e43]:
                  - button "All Collections" [ref=e44] [cursor=pointer]
        - generic [ref=e49]:
          - generic [ref=e50]:
            - generic [ref=e51]: 0 Results
            - 'button "Sort by: Recommended" [ref=e53] [cursor=pointer]'
          - generic [ref=e57]:
            - heading "No creations found." [level=3] [ref=e58]
            - paragraph [ref=e59]: Please try adjusting your filters or search terms.
  - contentinfo [ref=e60]:
    - generic [ref=e61]:
      - generic [ref=e62]:
        - generic [ref=e63]:
          - heading "Auremont" [level=3] [ref=e64]
          - paragraph [ref=e65]: Purveyors of the finest California Almonds. Hand-selected, slow-roasted, and presented with supreme elegance for those who appreciate true botanical craftsmanship.
          - generic [ref=e66]:
            - link "Instagram" [ref=e67] [cursor=pointer]:
              - /url: https://instagram.com
            - link "Twitter" [ref=e71] [cursor=pointer]:
              - /url: https://twitter.com
            - link "Facebook" [ref=e74] [cursor=pointer]:
              - /url: https://facebook.com
        - generic [ref=e77]:
          - heading "Explore" [level=4] [ref=e78]
          - generic [ref=e79]:
            - link "The Collection" [ref=e80] [cursor=pointer]:
              - /url: /shop
            - link "Gift Builder" [ref=e81] [cursor=pointer]:
              - /url: /custom-gift-box
            - link "Our Story" [ref=e82] [cursor=pointer]:
              - /url: /about
            - link "Journal" [ref=e83] [cursor=pointer]:
              - /url: /journal
            - link "Contact" [ref=e84] [cursor=pointer]:
              - /url: /contact
            - link "Corporate Gifting" [ref=e85] [cursor=pointer]:
              - /url: /corporate-gifts
        - generic [ref=e86]:
          - heading "Legal" [level=4] [ref=e87]
          - generic [ref=e88]:
            - link "Shipping & Returns" [ref=e89] [cursor=pointer]:
              - /url: /shipping
            - link "Privacy Policy" [ref=e90] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e91] [cursor=pointer]:
              - /url: /terms
            - link "FAQ" [ref=e92] [cursor=pointer]:
              - /url: /faq
        - generic [ref=e93]:
          - heading "The Inner Circle" [level=4] [ref=e94]
          - paragraph [ref=e95]: Subscribe to receive private invitations to limited reserve harvests and insider news.
          - generic [ref=e96]:
            - textbox "Subscribe to The Inner Circle newsletter" [ref=e97]:
              - /placeholder: Email Address
            - button "Subscribe" [ref=e98] [cursor=pointer]
      - generic [ref=e101]:
        - paragraph [ref=e102]: © 2026 AUREMONT. ALL RIGHTS RESERVED.
        - generic [ref=e103]:
          - generic [ref=e104]: 256-Bit Encryption
          - generic [ref=e105]: Global Concierge Shipping
          - generic [ref=e106]: 100% Ethically Sourced
  - generic [ref=e111] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e112]
    - generic [ref=e116]:
      - button "Open issues overlay" [ref=e117]:
        - generic [ref=e118]:
          - generic [ref=e119]: "0"
          - generic [ref=e120]: "1"
        - generic [ref=e121]: Issue
      - button "Collapse issues badge" [ref=e122]
  - alert [ref=e125]
  - generic [ref=e126]:
    - heading "Cookie Preferences" [level=4] [ref=e127]
    - paragraph [ref=e128]: We use cookies to enhance your experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
    - generic [ref=e129]:
      - button "Accept All" [ref=e130] [cursor=pointer]
      - button "Essential Only" [ref=e131] [cursor=pointer]
```

# Test source

```ts
  13  |   price: 999,
  14  |   weightGrams: 250,
  15  |   thumbnailUrl: '/images/california-almonds-250g.png',
  16  |   shortDescription: 'Signature matte black pouch.',
  17  |   stockQty: 50,
  18  | };
  19  | 
  20  | const MOCK_PRODUCTS_GRID = Array.from({ length: 8 }).map((_, i) => ({
  21  |   ...MOCK_PRODUCT,
  22  |   id: `mock-prod-${i + 1}`,
  23  |   name: `California Reserve Raw Almonds ${250 * (i + 1)}g`,
  24  |   slug: i === 0 ? 'california-reserve-raw' : `california-reserve-raw-${i + 1}`,
  25  | }));
  26  | 
  27  | const MOCK_CART = {
  28  |   id: 'mock-cart-1',
  29  |   items: [{
  30  |     id: 'mock-item-1',
  31  |     productId: MOCK_PRODUCT.id,
  32  |     quantity: 1,
  33  |     unitPrice: '999',
  34  |     subtotal: '999',
  35  |     product: MOCK_PRODUCT
  36  |   }]
  37  | };
  38  | 
  39  | const MOCK_ADMIN_METRICS = {
  40  |   todaySales: 25000,
  41  |   monthlySales: 450000,
  42  |   monthOrders: 128,
  43  |   totalCustomers: 340,
  44  |   lowStockProducts: 3
  45  | };
  46  | 
  47  | test.describe('AUREMONT Visual Regression & Snapshot Test Suite', () => {
  48  | 
  49  |   test.beforeEach(async ({ page }) => {
  50  |     // 1. Bypass Splash Overlay
  51  |     await page.addInitScript(() => {
  52  |       sessionStorage.setItem('auremont_splash', 'true');
  53  |     });
  54  | 
  55  |     // 2. Mock API endpoints with 8 grid items for catalog baseline height
  56  |     await page.route('**/*products', async route => {
  57  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  58  |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: MOCK_PRODUCTS_GRID, meta: { total: 8, page: 1, lastPage: 1 } }) });
  59  |     });
  60  | 
  61  |     await page.route('**/*products/*', async route => {
  62  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  63  |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_PRODUCT) });
  64  |     });
  65  | 
  66  |     await page.route('**/*cart*', async route => {
  67  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  68  |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_CART) });
  69  |     });
  70  | 
  71  |     await page.route('**/*admin/dashboard/metrics*', async route => {
  72  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  73  |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_METRICS) });
  74  |     });
  75  | 
  76  |     await page.route('**/*reviews*', async route => {
  77  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  78  |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify([]) });
  79  |     });
  80  | 
  81  |     await page.route('**/*categories*', async route => {
  82  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  83  |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
  84  |     });
  85  |   });
  86  | 
  87  |   const preparePageForVisual = async (page: any) => {
  88  |     // Disable CSS animations and transitions for stable screenshots
  89  |     await page.addStyleTag({
  90  |       content: `
  91  |         *, *::before, *::after {
  92  |           animation: none !important;
  93  |           transition: none !important;
  94  |           caret-color: transparent !important;
  95  |         }
  96  |       `
  97  |     });
  98  | 
  99  |     // Wait for network idle & font rendering completion
  100 |     await page.waitForLoadState('networkidle');
  101 |     await page.evaluate(() => document.fonts.ready);
  102 |   };
  103 | 
  104 |   test('Homepage Visual Screenshot Snapshot', async ({ page }) => {
  105 |     await page.goto('/');
  106 |     await preparePageForVisual(page);
  107 |     await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, maxDiffPixelRatio: 0.35 });
  108 |   });
  109 | 
  110 |   test('Shop Catalog Visual Screenshot Snapshot', async ({ page }) => {
  111 |     await page.goto('/shop');
  112 |     await preparePageForVisual(page);
> 113 |     await expect(page).toHaveScreenshot('shop-catalog.png', { fullPage: true, maxDiffPixelRatio: 0.35 });
      |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  114 |   });
  115 | 
  116 |   test('Bespoke Custom Gift Builder Visual Snapshot', async ({ page }) => {
  117 |     await page.goto('/custom-gift-box');
  118 |     await preparePageForVisual(page);
  119 |     await expect(page).toHaveScreenshot('custom-gift-builder.png', { fullPage: true, maxDiffPixelRatio: 0.15 });
  120 |   });
  121 | 
  122 |   test('Checkout Page Visual Screenshot Snapshot', async ({ page }) => {
  123 |     await page.goto('/checkout');
  124 |     await preparePageForVisual(page);
  125 |     await expect(page).toHaveScreenshot('checkout-page.png', { fullPage: true, maxDiffPixelRatio: 0.15 });
  126 |   });
  127 | 
  128 |   test('Admin Executive Dashboard Visual Snapshot', async ({ page }) => {
  129 |     await page.goto('/admin');
  130 |     await preparePageForVisual(page);
  131 |     await expect(page).toHaveScreenshot('admin-dashboard.png', { fullPage: true, maxDiffPixelRatio: 0.15 });
  132 |   });
  133 | });
  134 | 
```