# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Critical Path: Guest Checkout Flow >> should successfully add to cart and complete checkout
- Location: tests\checkout.spec.ts:40:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Order Confirmed')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('Order Confirmed')
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
  - img
  - text: Information 2 Payment
  - heading "Payment Edit Info" [level=2]:
    - text: Payment
    - button "Edit Info"
  - img
  - paragraph: Razorpay Secure Checkout
  - paragraph: You will be redirected to Razorpay to complete your purchase securely.
  - text: UPI Cards Net Banking
  - paragraph:
    - text: By clicking "Complete Purchase", you acknowledge that you have read and agree to Auremont's
    - link "Terms of Service":
      - /url: /terms
    - text: and
    - link "Privacy Policy":
      - /url: /privacy-policy
    - text: .
  - button "Complete Purchase — ₹1,048.95":
    - img
    - text: Complete Purchase — ₹1,048.95
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
  67  |     await page.route(
  68  |       (url) => url.pathname.endsWith('/products') && !url.pathname.includes('/products/'),
  69  |       async route => {
  70  |         await route.fulfill({
  71  |           status: 200,
  72  |           contentType: 'application/json',
  73  |           body: JSON.stringify({ data: [MOCK_PRODUCT], meta: { total: 1, page: 1, lastPage: 1 } })
  74  |         });
  75  |       }
  76  |     );
  77  | 
  78  |     let cartHasItem = false;
  79  |     await page.route(
  80  |       (url) => url.pathname.endsWith('/cart') || url.pathname.includes('/cart?'),
  81  |       async route => {
  82  |         await route.fulfill({
  83  |           status: 200,
  84  |           contentType: 'application/json',
  85  |           body: JSON.stringify(cartHasItem ? MOCK_CART : { id: 'mock-cart-1', items: [] })
  86  |         });
  87  |       }
  88  |     );
  89  | 
  90  |     await page.route(
  91  |       (url) => url.pathname.endsWith('/cart/items'),
  92  |       async route => {
  93  |         cartHasItem = true;
  94  |         await route.fulfill({
  95  |           status: 200,
  96  |           contentType: 'application/json',
  97  |           body: JSON.stringify(MOCK_CART)
  98  |         });
  99  |       }
  100 |     );
  101 | 
  102 |     await page.route(
  103 |       (url) => url.pathname.endsWith('/orders'),
  104 |       async route => {
  105 |         await route.fulfill({
  106 |           status: 201,
  107 |           contentType: 'application/json',
  108 |           body: JSON.stringify(MOCK_ORDER_RESPONSE)
  109 |         });
  110 |       }
  111 |     );
  112 | 
  113 |     await page.route(
  114 |       (url) => url.pathname.includes('/payments/verify'),
  115 |       async route => {
  116 |         await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  117 |       }
  118 |     );
  119 | 
  120 |     await page.route((url) => url.pathname.includes('/reviews'), async route => {
  121 |       await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  122 |     });
  123 |     await page.route((url) => url.pathname.includes('/categories'), async route => {
  124 |       await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
  125 |     });
  126 |     await page.route((url) => url.pathname.includes('/coupons'), async route => {
  127 |       await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not found' }) });
  128 |     });
  129 | 
  130 |     // ── 2. NAVIGATE TO PRODUCT DETAIL PAGE DIRECTLY ──────────────────────────
  131 |     await page.goto('/shop/california-reserve-raw');
  132 |     await expect(page).toHaveURL(/.*\/shop\/california-reserve-raw/, { timeout: 10000 });
  133 | 
  134 |     // ── 3. ADD TO CART on product page ──────────────────────────────────────
  135 |     const addToCartBtn = page.getByTestId('add-to-cart-btn').first();
  136 |     await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  137 |     await addToCartBtn.click({ force: true });
  138 | 
  139 |     // ── 4. PROCEED TO CHECKOUT ───────────────────────────────────────────────
  140 |     await page.goto('/checkout');
  141 |     await expect(page).toHaveURL(/.*\/checkout/, { timeout: 10000 });
  142 | 
  143 |     // ── 5. FILL SHIPPING FORM ────────────────────────────────────────────────
  144 |     await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 });
  145 |     await page.locator('input[name="email"]').fill('e2e_tester@auremont.com');
  146 |     await page.locator('input[name="fullName"]').fill('Playwright Tester');
  147 |     await page.locator('input[name="phone"]').fill('9876543210');
  148 |     await page.locator('input[name="addressLine1"]').fill('123 Automation Lane');
  149 |     await page.locator('input[name="city"]').fill('Testing City');
  150 |     await page.locator('input[name="state"]').fill('CA');
  151 |     await page.locator('input[name="postalCode"]').fill('90210');
  152 | 
  153 |     // ── 6. CONTINUE TO PAYMENT ───────────────────────────────────────────────
  154 |     const continueBtn = page.getByRole('button', { name: /Continue to Payment/i });
  155 |     await expect(continueBtn).toBeVisible();
  156 |     await continueBtn.click({ force: true });
  157 | 
  158 |     // ── 7. VERIFY PAYMENT STEP ──────────────────────────────────────────────
  159 |     await expect(page.getByText('Razorpay Secure Checkout')).toBeVisible({ timeout: 5000 });
  160 | 
  161 |     // ── 8. COMPLETE PURCHASE ─────────────────────────────────────────────────
  162 |     const completeBtn = page.getByRole('button', { name: /Complete Purchase/i });
  163 |     await expect(completeBtn).toBeVisible();
  164 |     await completeBtn.click({ force: true });
  165 | 
  166 |     // ── 9. VERIFY SUCCESS OVERLAY ────────────────────────────────────────────
> 167 |     await expect(page.getByText('Order Confirmed')).toBeVisible({ timeout: 15000 });
      |                                                     ^ Error: expect(locator).toBeVisible() failed
  168 |     await expect(page.getByText(/Payment successful/i)).toBeVisible();
  169 |   });
  170 | });
  171 | 
```