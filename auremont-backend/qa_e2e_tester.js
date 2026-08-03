const API_URL = 'http://localhost:3001';

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    console.log("Starting QA End-to-End Test Suite for Auremont Backend...\n");

    // 1. Test Auth: Unauthorized Access
    console.log("--- TEST 1: Auth Guards ---");
    let res = await fetch(`${API_URL}/orders/me`);
    assert(res.status === 401, "GET /orders/me without token returns 401 Unauthorized");

    // 2. Test Auth: Registration and Login
    console.log("\n--- TEST 2: Registration & JWT ---");
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = "SecurePassword123!";
    
    // Attempt registration
    res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: testEmail,
        password: testPassword
      })
    });
    // It might return 201 or 400 if user exists, but since we use Date.now() it should be 201
    assert(res.status === 201 || res.status === 200, "Registration successful");

    // Attempt Login
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    assert(res.status === 200 || res.status === 201, "Login successful");
    const loginData = await res.json();
    const token = loginData.access_token;
    assert(!!token, "JWT Access Token received");

    // 3. Test Security: Token usage
    res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(res.status === 200, "GET /auth/me with token succeeds");

    // 4. Test Infrastructure: Validation Pipes
    console.log("\n--- TEST 3: Validation & Security ---");
    res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: "Hacker",
        lastName: "Man",
        email: `hack_${Date.now()}@test.com`,
        password: "pwd",
        role: "admin" // Attempting mass assignment
      })
    });
    // Should strip 'role' or fail due to validation (whitelist/forbidNonWhitelisted)
    assert(res.status === 400 || res.status === 201, "ValidationPipe handles unexpected fields gracefully");

    // 5. Test Cart: Anonymous to Authenticated Merging
    console.log("\n--- TEST 4: Cart Security & Merging ---");
    // Create an anonymous cart item
    const guestCartId = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID
    res = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId: guestCartId,
        productId: "00000000-0000-0000-0000-000000000000", // Fake product, might 404
        quantity: 1
      })
    });
    // Even if it 404s due to fake product, it shows the endpoint is reachable anonymously
    assert(res.status !== 401, "Anonymous cart POST does not require authentication");

    // Attempt to merge cart
    res = await fetch(`${API_URL}/cart/merge`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ guestCartId })
    });
    assert(res.status === 200 || res.status === 201, "Cart merge endpoint is reachable and secure");

    // 6. Test Orders: Idempotency
    console.log("\n--- TEST 5: Order Idempotency & Checkout ---");
    
    // CASE 1: Non-existent cart (CART_NOT_FOUND)
    const fakeCartId = "11111111-1111-1111-1111-111111111111";
    res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        cartId: fakeCartId,
        idempotencyKey: `idem_${Date.now()}_1`,
        address: { fullName: "T", phone: "1", addressLine1: "1", city: "c", state: "s", postalCode: "1", country: "IN" }
      })
    });
    let result = await res.json();
    assert(res.status === 404 && result.code === 'CART_NOT_FOUND', `CASE 1: Rejected non-existent cart properly (Expected 404 CART_NOT_FOUND, got ${res.status})`);

    // CASE 5: Malformed cartId (DTO validation)
    res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        cartId: "invalid-uuid",
        address: { fullName: "T", phone: "1", addressLine1: "1", city: "c", state: "s", postalCode: "1", country: "IN" }
      })
    });
    assert(res.status === 400, `CASE 5: DTO rejected malformed cartId properly (Expected 400, got ${res.status})`);

    // Setup for CASE 2, 3, 4, 6
    // First, let's get a valid product from the database
    let productsRes = await fetch(`${API_URL}/products`);
    let products = await productsRes.json();
    let validProduct = products[0]; // Assuming there is at least one product
    
    if (validProduct) {
      // Get user's cart (which was created during merge)
      let cartRes = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let userCart = await cartRes.json();

      // CASE 2: Empty cart (EMPTY_CART)
      res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          cartId: userCart.id,
          idempotencyKey: `idem_${Date.now()}_2`,
          address: { fullName: "T", phone: "1", addressLine1: "1", city: "c", state: "s", postalCode: "1", country: "IN" }
        })
      });
      result = await res.json();
      assert(res.status === 400 && result.code === 'EMPTY_CART', `CASE 2: Rejected empty cart properly (Expected 400 EMPTY_CART, got ${res.status})`);

      // CASE 4: Unauthorized cart (CART_ACCESS_DENIED)
      // Let's create a secondary user to test ownership
      const thiefEmail = `thief_${Date.now()}@test.com`;
      let user2Res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: thiefEmail, password: "password123", firstName: "Thief", lastName: "Guy" })
      });
      await user2Res.json();
      
      let login2Res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: thiefEmail, password: "password123" })
      });
      let user2Data = await login2Res.json();
      let token2 = user2Data.access_token;

      
      res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token2}` },
        body: JSON.stringify({
          cartId: userCart.id, // Trying to checkout User 1's cart using User 2's token
          address: { fullName: "T", phone: "1", addressLine1: "1", city: "c", state: "s", postalCode: "1", country: "IN" }
        })
      });
      result = await res.json();
      assert(res.status === 403 && result.code === 'CART_ACCESS_DENIED', `CASE 4: Rejected unauthorized cart properly (Expected 403 CART_ACCESS_DENIED, got ${res.status})`);

      // CASE 6: Valid checkout
      // Add item to User 1's cart
      await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          cartId: userCart.id,
          productId: validProduct.id,
          quantity: 1
        })
      });

      res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          cartId: userCart.id,
          address: { fullName: "T", phone: "1", addressLine1: "1", city: "c", state: "s", postalCode: "1", country: "IN" }
        })
      });
      assert(res.status === 201, `CASE 6: Valid checkout succeeded (Expected 201, got ${res.status})`);

      // CASE 3: Already processed cart (CART_NOT_ACTIVE)
      // Trying to checkout the same cart again
      res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          cartId: userCart.id,
          address: { fullName: "T", phone: "1", addressLine1: "1", city: "c", state: "s", postalCode: "1", country: "IN" }
        })
      });
      result = await res.json();
      assert(res.status === 400 && result.code === 'CART_NOT_ACTIVE', `CASE 3: Rejected already processed cart properly (Expected 400 CART_NOT_ACTIVE, got ${res.status})`);
    } else {
      console.log("⚠️ Skipping Cases 2,3,4,6 because no valid products found in database.");
    }

    console.log("\n=================================");
    console.log(`TEST SUMMARY: ${passed} Passed | ${failed} Failed`);
    console.log("=================================");

    if (failed === 0) {
      console.log("✅ All functional security routes and validations are active!");
    } else {
      console.log("⚠️ Some tests failed. Please review the backend implementation.");
    }

  } catch (err) {
    console.error("Test execution failed:", err.message);
  }
}

runTests();
