# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full_user_journey.spec.ts >> AUREMONT End-to-End E2E Full User Journey >> Complete E2E Journey: Register -> Login -> Catalog Browse -> Add to Cart -> Apply Coupon -> Checkout -> Order Creation
- Location: tests\e2e\full_user_journey.spec.ts:62:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e2]:
    - paragraph [ref=f1e3]: Complimentary shipping on all orders over ₹2000
    - button "Close announcement" [ref=f1e4] [cursor=pointer]
  - banner [ref=f1e8]:
    - generic [ref=f1e9]:
      - navigation
      - link "Auremont" [ref=f1e11] [cursor=pointer]:
        - /url: /
      - generic [ref=f1e12]:
        - combobox [ref=f1e14] [cursor=pointer]:
          - option "INR ₹" [selected]
          - option "USD $"
          - option "EUR €"
          - option "GBP £"
        - button "Search" [ref=f1e15] [cursor=pointer]
        - link "Sign In" [ref=f1e20] [cursor=pointer]:
          - /url: /login
        - button "Cart" [ref=f1e21] [cursor=pointer]
  - main [ref=f1e23]:
    - generic [ref=f1e26]:
      - generic [ref=f1e27]:
        - heading "Join AUREMONT" [level=1] [ref=f1e28]
        - paragraph [ref=f1e29]: Create your exclusive account
      - generic [ref=f1e30]: Registration failed.
      - generic [ref=f1e31]:
        - generic [ref=f1e32]:
          - generic [ref=f1e33]:
            - text: First Name
            - textbox [ref=f1e34]: Alexander
          - generic [ref=f1e35]:
            - text: Last Name
            - textbox [ref=f1e36]: Vance
        - generic [ref=f1e37]:
          - text: Email Address
          - textbox [ref=f1e38]: e2e_user_1786002653119@auremont.com
        - generic [ref=f1e39]:
          - text: Password
          - textbox [ref=f1e40]: LuxuryPassword@2026
        - button "Create Account" [ref=f1e41] [cursor=pointer]
      - generic [ref=f1e42]:
        - text: Already have an account?
        - link "Sign In" [ref=f1e43] [cursor=pointer]:
          - /url: /login
  - contentinfo [ref=f1e44]:
    - generic [ref=f1e45]:
      - generic [ref=f1e46]:
        - generic [ref=f1e47]:
          - heading "Auremont" [level=3] [ref=f1e48]
          - paragraph [ref=f1e49]: Purveyors of the finest California Almonds. Hand-selected, slow-roasted, and presented with supreme elegance for those who appreciate true botanical craftsmanship.
          - generic [ref=f1e50]:
            - link "Instagram" [ref=f1e51] [cursor=pointer]:
              - /url: https://instagram.com
            - link "Twitter" [ref=f1e55] [cursor=pointer]:
              - /url: https://twitter.com
            - link "Facebook" [ref=f1e58] [cursor=pointer]:
              - /url: https://facebook.com
        - generic [ref=f1e61]:
          - heading "Explore" [level=4] [ref=f1e62]
          - generic [ref=f1e63]:
            - link "The Collection" [ref=f1e64] [cursor=pointer]:
              - /url: /shop
            - link "Gift Builder" [ref=f1e65] [cursor=pointer]:
              - /url: /custom-gift-box
            - link "Our Story" [ref=f1e66] [cursor=pointer]:
              - /url: /about
            - link "Journal" [ref=f1e67] [cursor=pointer]:
              - /url: /journal
            - link "Contact" [ref=f1e68] [cursor=pointer]:
              - /url: /contact
            - link "Corporate Gifting" [ref=f1e69] [cursor=pointer]:
              - /url: /corporate-gifts
        - generic [ref=f1e70]:
          - heading "Legal" [level=4] [ref=f1e71]
          - generic [ref=f1e72]:
            - link "Shipping & Returns" [ref=f1e73] [cursor=pointer]:
              - /url: /shipping
            - link "Privacy Policy" [ref=f1e74] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=f1e75] [cursor=pointer]:
              - /url: /terms
            - link "FAQ" [ref=f1e76] [cursor=pointer]:
              - /url: /faq
        - generic [ref=f1e77]:
          - heading "The Inner Circle" [level=4] [ref=f1e78]
          - paragraph [ref=f1e79]: Subscribe to receive private invitations to limited reserve harvests and insider news.
          - generic [ref=f1e80]:
            - textbox "Subscribe to The Inner Circle newsletter" [ref=f1e81]:
              - /placeholder: Email Address
            - button "Subscribe" [ref=f1e82] [cursor=pointer]
      - generic [ref=f1e85]:
        - paragraph [ref=f1e86]: © 2026 AUREMONT. ALL RIGHTS RESERVED.
        - generic [ref=f1e87]:
          - generic [ref=f1e88]: 256-Bit Encryption
          - generic [ref=f1e89]: Global Concierge Shipping
          - generic [ref=f1e90]: 100% Ethically Sourced
  - button "Open Next.js Dev Tools" [ref=f1e96] [cursor=pointer]
  - alert [ref=f1e100]
  - generic [ref=f1e101]:
    - heading "Cookie Preferences" [level=4] [ref=f1e102]
    - paragraph [ref=f1e103]: We use cookies to enhance your experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
    - generic [ref=f1e104]:
      - button "Accept All" [ref=f1e105] [cursor=pointer]
      - button "Essential Only" [ref=f1e106] [cursor=pointer]
```

# Test source

```ts
  66  |       sessionStorage.setItem('auremont_splash', 'true');
  67  |       (window as any).Razorpay = function(options: any) {
  68  |         return { open: () => {}, on: () => {} };
  69  |       };
  70  |     });
  71  | 
  72  |     await page.route('**/*razorpay.com*/**', async route => await route.abort());
  73  | 
  74  |     // Mock API Routes (Specific routes registered LAST so Playwright evaluates them FIRST)
  75  |     await page.route('**/*auth/register*', async route => {
  76  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  77  |       await route.fulfill({
  78  |         status: 201,
  79  |         headers: CORS_HEADERS,
  80  |         contentType: 'application/json',
  81  |         body: JSON.stringify({
  82  |           user: MOCK_USER,
  83  |           access_token: 'mock_jwt_access',
  84  |           refresh_token: 'mock_jwt_refresh',
  85  |           accessToken: 'mock_jwt_access',
  86  |           refreshToken: 'mock_jwt_refresh'
  87  |         })
  88  |       });
  89  |     });
  90  | 
  91  |     await page.route('**/*auth/login*', async route => {
  92  |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  93  |       await route.fulfill({
  94  |         status: 200,
  95  |         headers: CORS_HEADERS,
  96  |         contentType: 'application/json',
  97  |         body: JSON.stringify({
  98  |           user: MOCK_USER,
  99  |           access_token: 'mock_jwt_access',
  100 |           refresh_token: 'mock_jwt_refresh',
  101 |           accessToken: 'mock_jwt_access',
  102 |           refreshToken: 'mock_jwt_refresh'
  103 |         })
  104 |       });
  105 |     });
  106 | 
  107 |     await page.route('**/*auth/me*', async route => {
  108 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  109 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_USER) });
  110 |     });
  111 | 
  112 |     await page.route('**/*products', async route => {
  113 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  114 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: [MOCK_PRODUCT], meta: { total: 1, page: 1, lastPage: 1 } }) });
  115 |     });
  116 | 
  117 |     await page.route('**/*products/*', async route => {
  118 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  119 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_PRODUCT) });
  120 |     });
  121 | 
  122 |     await page.route('**/*cart*', async route => {
  123 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  124 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_CART) });
  125 |     });
  126 | 
  127 |     await page.route('**/*coupons/validate*', async route => {
  128 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  129 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ coupon: MOCK_COUPON, discountAmount: 199.8 }) });
  130 |     });
  131 | 
  132 |     await page.route('**/*orders*', async route => {
  133 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  134 |       await route.fulfill({ status: 201, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify(MOCK_ORDER_RESPONSE) });
  135 |     });
  136 | 
  137 |     await page.route('**/*payments/verify*', async route => {
  138 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  139 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  140 |     });
  141 | 
  142 |     await page.route('**/*reviews*', async route => {
  143 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  144 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify([]) });
  145 |     });
  146 | 
  147 |     await page.route('**/*categories*', async route => {
  148 |       if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS_HEADERS });
  149 |       await route.fulfill({ status: 200, headers: CORS_HEADERS, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
  150 |     });
  151 | 
  152 |     // Step 1: Open Homepage
  153 |     await page.goto('/');
  154 |     await expect(page).toHaveTitle(/Auremont/i);
  155 | 
  156 |     // Step 2: Navigate to Register Page & Register New User
  157 |     await page.goto('/register');
  158 |     const testEmail = `e2e_user_${Date.now()}@auremont.com`;
  159 |     
  160 |     await page.fill('input[name="firstName"]', 'Alexander');
  161 |     await page.fill('input[name="lastName"]', 'Vance');
  162 |     await page.fill('input[name="email"]', testEmail);
  163 |     await page.fill('input[name="password"]', 'LuxuryPassword@2026');
  164 | 
  165 |     await Promise.all([
> 166 |       page.waitForResponse(res => res.url().includes('/auth/register')),
      |            ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  167 |       page.click('button[type="submit"]'),
  168 |     ]);
  169 | 
  170 |     // Step 3: Browse Shop Catalog
  171 |     await page.goto('/shop');
  172 |     await expect(page.locator('h1')).toContainText(/Catalog|Collection/i);
  173 | 
  174 |     // Step 4: Click Product to view Details
  175 |     await page.goto('/shop/california-reserve-raw');
  176 |     await expect(page).toHaveURL(/.*\/shop\/california-reserve-raw/);
  177 | 
  178 |     // Step 5: Add Product to Shopping Cart with Network Barrier
  179 |     const addToCartBtn = page.getByTestId('add-to-cart-btn').first();
  180 |     await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  181 | 
  182 |     await Promise.all([
  183 |       page.waitForResponse(res => res.url().includes('/cart') && res.status() === 200),
  184 |       addToCartBtn.click({ force: true }),
  185 |     ]);
  186 | 
  187 |     // Step 6: Navigate to Checkout
  188 |     await page.goto('/checkout');
  189 |     await expect(page.locator('h1')).toContainText(/Checkout/i);
  190 | 
  191 |     // Step 7: Fill Shipping Address Information
  192 |     await page.locator('input[name="fullName"]').fill('Alexander Vance');
  193 |     await page.locator('input[name="phone"]').fill('9876543210');
  194 |     await page.locator('input[name="addressLine1"]').fill('100 Regal Boulevard');
  195 |     await page.locator('input[name="city"]').fill('Mumbai');
  196 |     await page.locator('input[name="state"]').fill('Maharashtra');
  197 |     await page.locator('input[name="postalCode"]').fill('400001');
  198 | 
  199 |     // Step 8: Apply Promo Coupon
  200 |     const couponInput = page.locator('input[name="couponCode"]');
  201 |     if (await couponInput.isVisible()) {
  202 |       await couponInput.fill('LUXURY20');
  203 |       const applyBtn = page.locator('button:has-text("Apply")');
  204 |       if (await applyBtn.isVisible()) {
  205 |         await Promise.all([
  206 |           page.waitForResponse(res => res.url().includes('/coupons/validate')),
  207 |           applyBtn.click(),
  208 |         ]);
  209 |       }
  210 |     }
  211 | 
  212 |     // Step 9: Proceed to Payment Step
  213 |     const continueBtn = page.getByRole('button', { name: /Continue to Payment/i });
  214 |     await expect(continueBtn).toBeVisible();
  215 |     await continueBtn.click({ force: true });
  216 | 
  217 |     // Step 10: Complete Purchase
  218 |     const placeOrderBtn = page.getByRole('button', { name: /Complete Purchase/i });
  219 |     await expect(placeOrderBtn).toBeVisible();
  220 | 
  221 |     await Promise.all([
  222 |       page.waitForResponse(res => res.url().includes('/orders')),
  223 |       placeOrderBtn.click({ force: true }),
  224 |     ]);
  225 | 
  226 |     // Step 11: Assert Order Confirmation UI
  227 |     await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 15000 });
  228 |   });
  229 | });
  230 | 
```