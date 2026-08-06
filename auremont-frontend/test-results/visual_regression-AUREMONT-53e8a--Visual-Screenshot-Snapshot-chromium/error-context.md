# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual_regression.spec.ts >> AUREMONT Visual Regression & Snapshot Test Suite >> Homepage Visual Screenshot Snapshot
- Location: tests\e2e\visual_regression.spec.ts:104:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: screencast.showOverlays: Target page, context or browser has been closed
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
    - main [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: California Reserve Harvest 2026 · Limited Yield
            - heading "The Pinnacle of Botanical Craft" [level=1] [ref=e35]
            - paragraph [ref=e36]: Hand-selected Extra Large California Almonds, slow-roasted to peak crispness and presented in bespoke velvet-lined mahogany vessels.
            - generic [ref=e37]:
              - link "Explore The Collection" [ref=e38] [cursor=pointer]:
                - /url: /shop
              - link "Our Heritage" [ref=e42] [cursor=pointer]:
                - /url: /about
          - generic [ref=e44]:
            - img "Auremont Royal Almonds Wooden Vessel" [ref=e45]
            - generic [ref=e47]:
              - generic [ref=e48]:
                - paragraph [ref=e49]: Reserve Vessel
                - paragraph [ref=e50]: Velvet Oak Reserve Edition
              - generic [ref=e51]: ₹1,499.00
        - generic [ref=e52]: Scroll To Discover
      - generic [ref=e56]:
        - generic [ref=e57]:
          - generic [ref=e58]:
            - heading "Curated Selection" [level=4] [ref=e59]
            - heading "Signature Creations" [level=2] [ref=e60]
          - link "View Entire Collection" [ref=e61] [cursor=pointer]:
            - /url: /shop
        - generic [ref=e62]:
          - generic [ref=e63] [cursor=pointer]:
            - generic [ref=e64]:
              - link "California Reserve Raw Almonds 250g":
                - /url: /shop/california-reserve-raw
                - img "California Reserve Raw Almonds 250g" [ref=e65]
              - button "Add to Cart" [ref=e67]
            - generic [ref=e68]:
              - link [ref=e69]:
                - /url: /shop/california-reserve-raw
                - heading "California Reserve Raw Almonds 250g" [level=3] [ref=e70]
              - paragraph [ref=e71]: 250G
              - generic [ref=e72]: ₹999.00
          - generic [ref=e73] [cursor=pointer]:
            - generic [ref=e74]:
              - link "Slow-Roasted Sea Salt Almonds 500g":
                - /url: /shop/roasted-sea-salt-almonds
                - img "Slow-Roasted Sea Salt Almonds 500g" [ref=e75]
              - button "Add to Cart" [ref=e77]
            - generic [ref=e78]:
              - link [ref=e79]:
                - /url: /shop/roasted-sea-salt-almonds
                - heading "Slow-Roasted Sea Salt Almonds 500g" [level=3] [ref=e80]
              - paragraph [ref=e81]: 500G
              - generic [ref=e82]: ₹1,499.00
          - generic [ref=e83] [cursor=pointer]:
            - generic [ref=e84]:
              - link "Everyday Collection Rigid Gift Box 1kg":
                - /url: /shop/royal-almonds-wooden-box
                - img "Everyday Collection Rigid Gift Box 1kg" [ref=e85]
              - button "Add to Cart" [ref=e87]
            - generic [ref=e88]:
              - link [ref=e89]:
                - /url: /shop/royal-almonds-wooden-box
                - heading "Everyday Collection Rigid Gift Box 1kg" [level=3] [ref=e90]
              - paragraph [ref=e91]: 1000G
              - generic [ref=e92]: ₹2,999.00
      - generic [ref=e94]:
        - generic [ref=e95]:
          - generic [ref=e96]: Botanical Standards
          - heading "The Auremont Distinction" [level=2] [ref=e97]
        - generic [ref=e98]:
          - generic [ref=e99]:
            - generic [ref=e100]: ORIGIN 36°N
            - heading "100% California Sun-Drenched Harvest" [level=3] [ref=e105]
            - paragraph [ref=e106]: Cultivated in the rich soils of the Central Valley under optimal Mediterranean climate conditions, yielding Extra Large Nonpareil kernels.
          - generic [ref=e107]:
            - generic [ref=e108]: CRAFT ROAST
            - heading "Masterfully Slow-Roasting" [level=3] [ref=e113]
            - paragraph [ref=e114]: Our small-batch roasting preserves essential natural nutrient oils while developing crisp, buttery aromatic depth.
          - generic [ref=e115]:
            - generic [ref=e116]: VAULT SEAL
            - heading "Bespoke Heirloom Packaging" [level=3] [ref=e120]
            - paragraph [ref=e121]: Hermetically sealed in double-walled glass jars and velvet-lined mahogany boxes to lock in pristine garden freshness.
      - generic [ref=e122]:
        - generic [ref=e123]:
          - generic [ref=e124]: Most Coveted
          - heading "The Reserve Editions" [level=2] [ref=e125]
        - generic [ref=e126]:
          - generic [ref=e127] [cursor=pointer]:
            - generic [ref=e128]:
              - link "California Reserve Raw Almonds 250g":
                - /url: /shop/california-reserve-raw
                - img "California Reserve Raw Almonds 250g" [ref=e129]
              - button "Add to Cart" [ref=e131]
            - generic [ref=e132]:
              - link [ref=e145]:
                - /url: /shop/california-reserve-raw
                - heading "California Reserve Raw Almonds 250g" [level=3] [ref=e146]
              - generic [ref=e147]:
                - generic [ref=e148]: ₹999.00
                - generic [ref=e149]: Bestseller
          - generic [ref=e150] [cursor=pointer]:
            - generic [ref=e151]:
              - link "Slow-Roasted Sea Salt Almonds 500g":
                - /url: /shop/roasted-sea-salt-almonds
                - img "Slow-Roasted Sea Salt Almonds 500g" [ref=e152]
              - button "Add to Cart" [ref=e154]
            - generic [ref=e155]:
              - link [ref=e168]:
                - /url: /shop/roasted-sea-salt-almonds
                - heading "Slow-Roasted Sea Salt Almonds 500g" [level=3] [ref=e169]
              - generic [ref=e170]:
                - generic [ref=e171]: ₹1,499.00
                - generic [ref=e172]: Bestseller
          - generic [ref=e173] [cursor=pointer]:
            - generic [ref=e174]:
              - link "Everyday Collection Rigid Gift Box 1kg":
                - /url: /shop/royal-almonds-wooden-box
                - img "Everyday Collection Rigid Gift Box 1kg" [ref=e175]
              - button "Add to Cart" [ref=e177]
            - generic [ref=e178]:
              - link [ref=e191]:
                - /url: /shop/royal-almonds-wooden-box
                - heading "Everyday Collection Rigid Gift Box 1kg" [level=3] [ref=e192]
              - generic [ref=e193]:
                - generic [ref=e194]: ₹2,999.00
                - generic [ref=e195]: Bestseller
          - generic [ref=e196] [cursor=pointer]:
            - generic [ref=e197]:
              - link "Transparent Window Pouch Edition 250g":
                - /url: /shop/window-pouch-almonds-250g
                - img "Transparent Window Pouch Edition 250g" [ref=e198]
              - button "Add to Cart" [ref=e200]
            - generic [ref=e201]:
              - link [ref=e214]:
                - /url: /shop/window-pouch-almonds-250g
                - heading "Transparent Window Pouch Edition 250g" [level=3] [ref=e215]
              - generic [ref=e216]:
                - generic [ref=e217]: ₹1,099.00
                - generic [ref=e218]: Bestseller
        - link "View All Bestsellers" [ref=e220] [cursor=pointer]:
          - /url: /shop?sort=bestselling
      - generic [ref=e223]:
        - generic [ref=e224]:
          - heading "Our Heritage" [level=4] [ref=e225]
          - heading "A Legacy of Uncompromising Quality." [level=2] [ref=e226]
          - paragraph [ref=e227]: We believe that true luxury lies in the details. From the fertile valleys of California to the bespoke wooden boxes that grace your table, every step of the Auremont journey is defined by obsession and craftsmanship.
          - paragraph [ref=e228]: Our founders traveled the world to find the perfect almond, one that combined size, texture, and a rich flavor profile unmatched by any other.
          - link "Read Our Story" [ref=e230] [cursor=pointer]:
            - /url: /about
        - generic [ref=e231]:
          - img "Auremont Craftsmanship" [ref=e233]
          - generic [ref=e234]: A.
      - generic [ref=e236]:
        - generic [ref=e237]:
          - generic [ref=e238]: Visual Packaging Suite
          - heading "Crafted for the Discerning" [level=2] [ref=e239]
          - paragraph [ref=e240]: Explore our signature matte black and gold foil packaging range—engineered to preserve peak freshness while making an unforgettably luxurious statement.
        - generic [ref=e241]:
          - generic [ref=e242]:
            - img "Matte Black Stand-up Pouch" [ref=e243]
            - generic [ref=e244]:
              - generic [ref=e245]: Air-Tight Foil Barrier
              - heading "Matte Black Stand-up Pouch" [level=3] [ref=e252]
              - paragraph [ref=e253]: Everyday 250g Pouch
              - paragraph [ref=e254]: Resealable triple-layer barrier pouch with metallic gold foil crown logo and botanical almond engraving.
          - generic [ref=e255]:
            - img "Glass Preserve Jar" [ref=e256]
            - generic [ref=e257]:
              - generic [ref=e258]: UV-Protected Vessel
              - heading "Glass Preserve Jar" [level=3] [ref=e263]
              - paragraph [ref=e264]: Signature 500g Jar
              - paragraph [ref=e265]: Thick clear glass jar with metallic gold screw cap and tactile matte black gold-stamped label.
          - generic [ref=e266]:
            - img "Rigid Matte Gift Box" [ref=e267]
            - generic [ref=e268]:
              - generic [ref=e269]: Rigid Presentation
              - heading "Rigid Matte Gift Box" [level=3] [ref=e274]
              - paragraph [ref=e275]: Everyday Collection 1kg Box
              - paragraph [ref=e276]: Heavyweight rigid black box featuring debossed gold foil typography and custom interior tray.
          - generic [ref=e277]:
            - img "Transparent Window Pouch" [ref=e278]
            - generic [ref=e279]:
              - generic [ref=e280]: Clear Sight Window
              - heading "Transparent Window Pouch" [level=3] [ref=e285]
              - paragraph [ref=e286]: Window Edition 250g
              - paragraph [ref=e287]: Features a clear view oval window at the base so you can admire the extra-large California almonds.
          - generic [ref=e288]:
            - img "Grand Luxury Unboxing Box" [ref=e289]
            - generic [ref=e290]:
              - generic [ref=e291]: Unboxing Masterpiece
              - heading "Grand Luxury Unboxing Box" [level=3] [ref=e295]
              - paragraph [ref=e296]: Gift Unboxing Experience
              - paragraph [ref=e297]: Opened magnetic hinged gift box with gold foil lid inscription, black pouch & gold thank-you card.
          - generic [ref=e298]:
            - img "Auremont Packaging Suite Showcase" [ref=e299]
            - generic [ref=e300]:
              - generic [ref=e301]: Complete Brand Vision
              - heading "Auremont Packaging Suite" [level=3] [ref=e305]
              - paragraph [ref=e306]: 10-Shot Photography Collage
              - paragraph [ref=e307]: Every detail—from the tactile dewy texture to the custom gold foil leaf work—reflects our commitment to uncompromising elegance.
      - generic [ref=e309]:
        - generic [ref=e310]:
          - img "Auremont Executive Corporate Gifting" [ref=e311]
          - generic [ref=e313]:
            - generic [ref=e314]: Bespoke Engraving & Velvet Packaging
            - paragraph [ref=e315]: The Heirloom Executive Collection
        - generic [ref=e317]:
          - generic [ref=e318]: B2B & Bespoke Executive Curations
          - heading "Executive Bespoke Gifting" [level=2] [ref=e323]
          - paragraph [ref=e324]: Leave a lasting mark of distinction with clients, executives, and partners. Our dedicated concierge team provides custom laser-engraved wooden vessels, velvet lining, and global fulfillment.
          - generic [ref=e325]:
            - link "Inquire Concierge" [ref=e326] [cursor=pointer]:
              - /url: /contact
            - link "Download Catalog" [ref=e330] [cursor=pointer]:
              - /url: /corporate-gifts
      - generic [ref=e332]:
        - heading "Nourishment" [level=4] [ref=e333]
        - heading "The Essence of Vitality" [level=2] [ref=e334]
        - generic [ref=e335]:
          - generic [ref=e336]:
            - heading "Heart Health" [level=3] [ref=e341]
            - paragraph [ref=e342]: Rich in monounsaturated fats that support cardiovascular wellness.
          - generic [ref=e343]:
            - heading "Cognitive Function" [level=3] [ref=e355]
            - paragraph [ref=e356]: High in Vitamin E and antioxidants to nourish brain cells.
          - generic [ref=e357]:
            - heading "Sustained Energy" [level=3] [ref=e363]
            - paragraph [ref=e364]: Packed with protein and fiber for prolonged vitality.
      - generic [ref=e366]:
        - heading "The Verdict" [level=4] [ref=e367]
        - generic [ref=e368]:
          - generic [ref=e369]:
            - generic [ref=e370]: "\""
            - paragraph [ref=e371]: Simply the finest almonds I've ever tasted. The presentation is unmatched and the crunch is extraordinary.
            - generic [ref=e372]:
              - heading "Eleanor V." [level=5] [ref=e373]
              - paragraph [ref=e374]: Executive Chef
          - generic [ref=e375]:
            - generic [ref=e376]: "\""
            - paragraph [ref=e377]: Auremont elevates the humble almond into a true luxury experience. The wooden box makes a perfect corporate gift.
            - generic [ref=e378]:
              - heading "James T." [level=5] [ref=e379]
              - paragraph [ref=e380]: CEO, TechVentures
          - generic [ref=e381]:
            - generic [ref=e382]: "\""
            - paragraph [ref=e383]: From the moment you open the jar, the aroma of the perfect roast hits you. Absolutely exceptional quality.
            - generic [ref=e384]:
              - heading "Sarah M." [level=5] [ref=e385]
              - paragraph [ref=e386]: Food Critic
      - generic [ref=e387]:
        - generic [ref=e388]:
          - heading "#AuremontLifestyle" [level=4] [ref=e389]
          - heading "Follow the Journey" [level=2] [ref=e390]
        - generic [ref=e391]:
          - generic [ref=e392] [cursor=pointer]:
            - img "Lifestyle Gallery" [ref=e393]
            - generic [ref=e394]: "@Auremont"
          - generic [ref=e396] [cursor=pointer]:
            - img "Lifestyle Gallery" [ref=e397]
            - generic [ref=e398]: "@Auremont"
          - generic [ref=e400] [cursor=pointer]:
            - img "Lifestyle Gallery" [ref=e401]
            - generic [ref=e402]: "@Auremont"
          - generic [ref=e404] [cursor=pointer]:
            - img "Lifestyle Gallery" [ref=e405]
            - generic [ref=e406]: "@Auremont"
  - contentinfo [ref=e408]:
    - generic [ref=e409]:
      - generic [ref=e410]:
        - generic [ref=e411]:
          - heading "Auremont" [level=3] [ref=e412]
          - paragraph [ref=e413]: Purveyors of the finest California Almonds. Hand-selected, slow-roasted, and presented with supreme elegance for those who appreciate true botanical craftsmanship.
          - generic [ref=e414]:
            - link "Instagram" [ref=e415] [cursor=pointer]:
              - /url: https://instagram.com
            - link "Twitter" [ref=e419] [cursor=pointer]:
              - /url: https://twitter.com
            - link "Facebook" [ref=e422] [cursor=pointer]:
              - /url: https://facebook.com
        - generic [ref=e425]:
          - heading "Explore" [level=4] [ref=e426]
          - generic [ref=e427]:
            - link "The Collection" [ref=e428] [cursor=pointer]:
              - /url: /shop
            - link "Gift Builder" [ref=e429] [cursor=pointer]:
              - /url: /custom-gift-box
            - link "Our Story" [ref=e430] [cursor=pointer]:
              - /url: /about
            - link "Journal" [ref=e431] [cursor=pointer]:
              - /url: /journal
            - link "Contact" [ref=e432] [cursor=pointer]:
              - /url: /contact
            - link "Corporate Gifting" [ref=e433] [cursor=pointer]:
              - /url: /corporate-gifts
        - generic [ref=e434]:
          - heading "Legal" [level=4] [ref=e435]
          - generic [ref=e436]:
            - link "Shipping & Returns" [ref=e437] [cursor=pointer]:
              - /url: /shipping
            - link "Privacy Policy" [ref=e438] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e439] [cursor=pointer]:
              - /url: /terms
            - link "FAQ" [ref=e440] [cursor=pointer]:
              - /url: /faq
        - generic [ref=e441]:
          - heading "The Inner Circle" [level=4] [ref=e442]
          - paragraph [ref=e443]: Subscribe to receive private invitations to limited reserve harvests and insider news.
          - generic [ref=e444]:
            - textbox "Subscribe to The Inner Circle newsletter" [ref=e445]:
              - /placeholder: Email Address
            - button "Subscribe" [ref=e446] [cursor=pointer]
      - generic [ref=e449]:
        - paragraph [ref=e450]: © 2026 AUREMONT. ALL RIGHTS RESERVED.
        - generic [ref=e451]:
          - generic [ref=e452]: 256-Bit Encryption
          - generic [ref=e453]: Global Concierge Shipping
          - generic [ref=e454]: 100% Ethically Sourced
  - button "Open Next.js Dev Tools" [ref=e460] [cursor=pointer]
  - alert [ref=e464]
  - generic [ref=e465]:
    - heading "Cookie Preferences" [level=4] [ref=e466]
    - paragraph [ref=e467]: We use cookies to enhance your experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
    - generic [ref=e468]:
      - button "Accept All" [ref=e469] [cursor=pointer]
      - button "Essential Only" [ref=e470] [cursor=pointer]
```

# Test source

```ts
  7   | };
  8   | 
  9   | const MOCK_PRODUCT = {
  10  |   id: 'mock-prod-1',
  11  |   name: 'California Reserve Raw Almonds 250g',
  12  |   slug: 'california-reserve-raw',
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
> 107 |     await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, maxDiffPixelRatio: 0.35 });
      |     ^ Error: screencast.showOverlays: Target page, context or browser has been closed
  108 |   });
  109 | 
  110 |   test('Shop Catalog Visual Screenshot Snapshot', async ({ page }) => {
  111 |     await page.goto('/shop');
  112 |     await preparePageForVisual(page);
  113 |     await expect(page).toHaveScreenshot('shop-catalog.png', { fullPage: true, maxDiffPixelRatio: 0.35 });
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