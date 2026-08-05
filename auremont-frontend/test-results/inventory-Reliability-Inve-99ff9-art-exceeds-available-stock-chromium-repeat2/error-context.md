# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory.spec.ts >> Reliability: Inventory Concurrency >> should prevent checkout if cart exceeds available stock
- Location: tests\inventory.spec.ts:31:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Razorpay Secure Checkout')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Razorpay Secure Checkout')
  - Test timeout of 30000ms exceeded.

```

```yaml
- paragraph: Complimentary shipping on all orders over ₹2000
- button "Close announcement":
  - img
- banner:
  - navigation
  - link "Auremont":
    - /url: /
  - combobox:
    - option "INR ₹" [selected]
    - option "USD $"
    - option "EUR €"
    - option "GBP £"
  - button "Search":
    - img
  - link "Sign In":
    - /url: /login
  - button "Cart": Cart (1)
- main:
  - heading "Secure Checkout" [level=1]:
    - text: Secure Checkout
    - img
  - text: 1 Information 2 Payment
  - heading "Shipping Information" [level=2]
  - text: Email Address (for order tracking & receipt)
  - textbox "Email Address (for order tracking & receipt)": race_condition@auremont.com
  - text: Full Name
  - textbox "Full Name": Tester User
  - text: Phone Number
  - textbox "Phone Number": "9876543210"
  - text: Address Line 1
  - textbox "Address Line 1": 123 Test Street
  - text: Address Line 2 (Apartment, suite, etc.)
  - textbox "Address Line 2 (Apartment, suite, etc.)"
  - text: City
  - textbox "City": Mumbai
  - text: State / Province
  - textbox "State / Province": Maharashtra
  - text: Postal Code
  - textbox "Postal Code": "400001"
  - text: Country/Region
  - textbox "Country/Region": India
  - button "Continue to Payment"
  - heading "Summary" [level=2]
  - img "California Reserve Raw Almonds 250g"
  - paragraph: California Reserve Raw Almonds 250g
  - paragraph: "Qty: 1"
  - text: ₹999.00 Gift Card or Privilege Code
  - textbox "Gift Card or Privilege Code"
  - button "Apply Code" [disabled]
  - text: Subtotal ₹999.00 Shipping Complimentary Tax (5% GST) ₹49.95 Total ₹1,048.95
  - paragraph:
    - img
    - text: 256-Bit Encryption
  - paragraph: Auremont Quality Guarantee
- contentinfo:
  - heading "Auremont" [level=3]
  - paragraph: Purveyors of the finest California Almonds. Hand-selected, slow-roasted, and presented with supreme elegance for those who appreciate true botanical craftsmanship.
  - link "Instagram":
    - /url: https://instagram.com
    - img
  - link "Twitter":
    - /url: https://twitter.com
    - img
  - link "Facebook":
    - /url: https://facebook.com
    - img
  - heading "Explore" [level=4]
  - link "The Collection":
    - /url: /shop
  - link "Gift Builder":
    - /url: /custom-gift-box
  - link "Our Story":
    - /url: /about
  - link "Journal":
    - /url: /journal
  - link "Contact":
    - /url: /contact
  - link "Corporate Gifting":
    - /url: /corporate-gifts
  - heading "Legal" [level=4]
  - link "Shipping & Returns":
    - /url: /shipping
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms
  - link "FAQ":
    - /url: /faq
  - heading "The Inner Circle" [level=4]
  - paragraph: Subscribe to receive private invitations to limited reserve harvests and insider news.
  - textbox "Subscribe to The Inner Circle newsletter":
    - /placeholder: Email Address
  - button "Subscribe":
    - img
  - paragraph: © 2026 AUREMONT. ALL RIGHTS RESERVED.
  - text: 256-Bit Encryption Global Concierge Shipping 100% Ethically Sourced
- alert
- heading "Cookie Preferences" [level=4]
- paragraph: We use cookies to enhance your experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
- button "Accept All"
- button "Essential Only"
```

# Test source

```ts
  41  |     await page.route(
  42  |       (url) => url.hostname.includes('razorpay.com'),
  43  |       async route => { await route.abort(); }
  44  |     );
  45  | 
  46  |     // ── 1. MOCK ALL API ENDPOINTS ────────────────────────────────────────────
  47  |     await page.route(
  48  |       (url) => url.pathname.includes('/products/california-reserve-raw'),
  49  |       async route => {
  50  |         await route.fulfill({
  51  |           status: 200,
  52  |           contentType: 'application/json',
  53  |           body: JSON.stringify(MOCK_PRODUCT)
  54  |         });
  55  |       }
  56  |     );
  57  | 
  58  |     await page.route(
  59  |       (url) => url.pathname.endsWith('/products') && !url.pathname.includes('/products/'),
  60  |       async route => {
  61  |         await route.fulfill({
  62  |           status: 200,
  63  |           contentType: 'application/json',
  64  |           body: JSON.stringify({ data: [MOCK_PRODUCT], meta: { total: 1, page: 1, lastPage: 1 } })
  65  |         });
  66  |       }
  67  |     );
  68  | 
  69  |     let cartHasItem = false;
  70  |     await page.route(
  71  |       (url) => url.pathname.endsWith('/cart') || url.pathname.includes('/cart?'),
  72  |       async route => {
  73  |         await route.fulfill({
  74  |           status: 200,
  75  |           contentType: 'application/json',
  76  |           body: JSON.stringify(cartHasItem ? MOCK_CART : { id: 'mock-cart-1', items: [] })
  77  |         });
  78  |       }
  79  |     );
  80  | 
  81  |     await page.route(
  82  |       (url) => url.pathname.endsWith('/cart/items'),
  83  |       async route => {
  84  |         cartHasItem = true;
  85  |         await route.fulfill({
  86  |           status: 200,
  87  |           contentType: 'application/json',
  88  |           body: JSON.stringify(MOCK_CART)
  89  |         });
  90  |       }
  91  |     );
  92  | 
  93  |     await page.route(
  94  |       (url) => url.pathname.endsWith('/orders'),
  95  |       async route => {
  96  |         await route.fulfill({
  97  |           status: 409,
  98  |           contentType: 'application/json',
  99  |           body: JSON.stringify({
  100 |             message: 'Insufficient stock for California Reserve Raw Almonds 250g',
  101 |             error: 'Conflict'
  102 |           })
  103 |         });
  104 |       }
  105 |     );
  106 | 
  107 |     await page.route((url) => url.pathname.includes('/reviews'), async route => {
  108 |       await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  109 |     });
  110 |     await page.route((url) => url.pathname.includes('/categories'), async route => {
  111 |       await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
  112 |     });
  113 | 
  114 |     // ── 2. NAVIGATE TO PRODUCT DETAIL PAGE DIRECTLY ──────────────────────────
  115 |     await page.goto('/shop/california-reserve-raw');
  116 |     await expect(page).toHaveURL(/.*\/shop\/california-reserve-raw/, { timeout: 10000 });
  117 | 
  118 |     // ── 3. ADD TO CART ───────────────────────────────────────────────────────
  119 |     const addToCartBtn = page.getByTestId('add-to-cart-btn').first();
  120 |     await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  121 |     await addToCartBtn.click({ force: true });
  122 | 
  123 |     // ── 4. PROCEED TO CHECKOUT ───────────────────────────────────────────────
  124 |     await page.goto('/checkout');
  125 |     await expect(page).toHaveURL(/.*\/checkout/, { timeout: 10000 });
  126 | 
  127 |     // ── 5. FILL SHIPPING FORM ────────────────────────────────────────────────
  128 |     await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 });
  129 |     await page.locator('input[name="email"]').fill('race_condition@auremont.com');
  130 |     await page.locator('input[name="fullName"]').fill('Tester User');
  131 |     await page.locator('input[name="phone"]').fill('9876543210');
  132 |     await page.locator('input[name="addressLine1"]').fill('123 Test Street');
  133 |     await page.locator('input[name="city"]').fill('Mumbai');
  134 |     await page.locator('input[name="state"]').fill('Maharashtra');
  135 |     await page.locator('input[name="postalCode"]').fill('400001');
  136 | 
  137 |     // ── 6. CONTINUE TO PAYMENT ───────────────────────────────────────────────
  138 |     const continueBtn = page.getByRole('button', { name: /Continue to Payment/i });
  139 |     await expect(continueBtn).toBeVisible();
  140 |     await continueBtn.click({ force: true });
> 141 |     await expect(page.getByText('Razorpay Secure Checkout')).toBeVisible({ timeout: 5000 });
      |                                                              ^ Error: expect(locator).toBeVisible() failed
  142 | 
  143 |     // ── 7. TRIGGER ORDER (will hit 409 Conflict) ─────────────────────────────
  144 |     const completeBtn = page.getByRole('button', { name: /Complete Purchase/i });
  145 |     await expect(completeBtn).toBeVisible();
  146 |     await completeBtn.click({ force: true });
  147 | 
  148 |     // ── 8. ASSERT GRACEFUL ERROR MESSAGE ─────────────────────────────────────
  149 |     await expect(page.getByText(/Insufficient stock/i)).toBeVisible({ timeout: 10000 });
  150 |   });
  151 | });
  152 | 
```