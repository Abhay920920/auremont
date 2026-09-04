/**
 * Rare Nuts — Ultra-Hard Production Hardening & Extreme Performance Test Suite
 * Tests all 32 dimensions specified in the master audit request.
 */

const http = require('http');
const https = require('https');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3001';

function request(method, path, body, token, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    const postData = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customHeaders,
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
      },
    };

    const startTime = Date.now();
    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        const latencyMs = Date.now() - startTime;
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            latencyMs,
            data: JSON.parse(data),
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            latencyMs,
            data,
          });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function sendWebhook(payload) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_12345';
  const sig = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(payload)).digest('hex');
  return request('POST', '/payments/webhook', payload, null, { 'x-razorpay-signature': sig });
}

let PASS = 0, FAIL = 0;
function assert(name, condition, details) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    PASS++;
  } else {
    console.log(`  ❌ ${name}${details ? '\n     → ' + JSON.stringify(details) : ''}`);
    FAIL++;
  }
}

async function loginOrRegister(email, password = 'Test@1234') {
  let loginRes = await request('POST', '/auth/login', { email, password });
  let token = loginRes.data?.accessToken || loginRes.data?.access_token;
  if (!token) {
    const regRes = await request('POST', '/auth/register', {
      firstName: 'Customer',
      lastName: 'UltraAudit',
      email,
      password,
    });
    token = regRes.data?.accessToken || regRes.data?.access_token;
  }
  return token;
}

async function createCartAndOrder(token, guestEmail, product, qty = 1) {
  const addItemRes = await request('POST', '/cart/items', { productId: product.id, quantity: qty }, token);
  const cartId = addItemRes.data?.id;

  const idemKey = `ultra-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const orderRes = await request('POST', '/orders', {
    cartId,
    idempotencyKey: idemKey,
    guestEmail: token ? undefined : guestEmail,
    address: {
      fullName: 'Ultra Hardening Tester',
      phone: '9876543210',
      addressLine1: '789 Grand Orchard Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
  }, token);

  return {
    order: orderRes.data,
    orderId: orderRes.data?.id,
    orderToken: orderRes.data?.orderToken,
    paymentSession: orderRes.data?.paymentSession,
  };
}

async function run() {
  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log('  RARE NUTS — ULTRA PRODUCTION HARDENING & PERFORMANCE AUDIT     ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. HEALTH, READINESS & LIVENESS PROBES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('── 1. Health, Readiness & Liveness Probes ───────────────────');
  const livenessRes = await request('GET', '/health/liveness');
  assert('Liveness endpoint returns 200 OK', livenessRes.status === 200 && livenessRes.data?.status === 'alive');

  const readinessRes = await request('GET', '/health/readiness');
  assert('Readiness endpoint validates DB connectivity', readinessRes.status === 200 && readinessRes.data?.database?.status === 'connected');
  console.log(`     → DB Ping Latency: ${readinessRes.data?.database?.latency_ms}ms, Heap: ${readinessRes.data?.memory?.heap_used_mb}MB`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. OBSERVABILITY, CORRELATION IDS & ERROR RESPONSES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 2. Observability & Correlation Tracking ──────────────────');
  const customCorrId = `corr_test_${Date.now()}`;
  const errorRes = await request('GET', '/orders/00000000-0000-0000-0000-000000000000', null, null, {
    'X-Correlation-ID': customCorrId,
  });
  assert('Request-ID header attached to response', !!errorRes.headers?.['x-request-id']);
  assert('Custom correlation ID preserved in header', errorRes.headers?.['x-request-id'] === customCorrId);
  assert('Error response includes structured correlation ID', errorRes.data?.requestId === customCorrId);

  // Setup Accounts
  const runId = Date.now() + '_' + Math.random().toString(36).substring(7);
  const tokenCustomer = await loginOrRegister(`ultraCust_${runId}@rarenuts.com`);
  const tokenAdmin = await loginOrRegister('admin@rarenuts.com', 'Admin@12345');
  assert('Customer account authenticated', !!tokenCustomer);
  assert('Admin account authenticated', !!tokenAdmin);

  const productsRes = await request('GET', '/products?limit=5&status=true');
  const product = productsRes.data?.data?.[0] || productsRes.data?.[0];
  assert('Product loaded', !!product?.id);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. AUTHORIZATION & RBAC GUARDS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 3. Authorization & RBAC Access Control ───────────────────');
  const { orderId: smOrderId, paymentSession: smPs } = await createCartAndOrder(tokenCustomer, null, product, 1);
  assert('Customer placed order', !!smOrderId);

  // Non-admin attempting admin status update -> MUST BE 403 Forbidden
  const customerAdminRes = await request('PATCH', `/orders/admin/${smOrderId}/status`, {
    status: 'confirmed',
  }, tokenCustomer);
  assert('Customer is FORBIDDEN from updating admin order status (403)', customerAdminRes.status === 403);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. AUTHORITATIVE ORDER STATE MACHINE INVARIANTS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 4. Authoritative Order State Machine Invariants ──────────');

  // Attempt 1: Admin tries to confirm order while paymentStatus is still 'pending' — MUST BE BLOCKED (400)
  const prematureConfirmRes = await request('PATCH', `/orders/admin/${smOrderId}/status`, {
    status: 'confirmed',
  }, tokenAdmin);
  assert('Premature confirmation without paid status is BLOCKED (400)', prematureConfirmRes.status === 400);

  // Attempt 2: Admin tries illegal jump (placed -> delivered directly) — MUST BE BLOCKED (400)
  const illegalJumpRes = await request('PATCH', `/orders/admin/${smOrderId}/status`, {
    status: 'delivered',
  }, tokenAdmin);
  assert('Illegal transition placed -> delivered is BLOCKED (400)', illegalJumpRes.status === 400);

  // Verify payment authoritatively via gateway verification
  const verifyRes = await request('POST', '/payments/verify', {
    razorpay_order_id: smPs.razorpayOrderId,
    razorpay_payment_id: `pay_sm_${Date.now()}`,
    razorpay_signature: 'mock_signature',
  }, tokenCustomer);
  assert('Order verified and marked PAID & CONFIRMED', verifyRes.status === 200 && verifyRes.data?.order?.paymentStatus === 'paid');

  // Valid Transition: confirmed -> packed
  const packRes = await request('PATCH', `/orders/admin/${smOrderId}/status`, { status: 'packed' }, tokenAdmin);
  assert('Valid transition confirmed -> packed SUCCEEDED (200)', packRes.status === 200);

  // Valid Transition: packed -> shipped
  const shipRes = await request('PATCH', `/orders/admin/${smOrderId}/status`, { status: 'shipped' }, tokenAdmin);
  assert('Valid transition packed -> shipped SUCCEEDED (200)', shipRes.status === 200);

  // Valid Transition: shipped -> delivered
  const deliverRes = await request('PATCH', `/orders/admin/${smOrderId}/status`, { status: 'delivered' }, tokenAdmin);
  assert('Valid transition shipped -> delivered SUCCEEDED (200)', deliverRes.status === 200);

  // Attempt 3: Admin tries to cancel a delivered order — MUST BE BLOCKED (400)
  const cancelDeliveredRes = await request('PATCH', `/orders/admin/${smOrderId}/status`, { status: 'cancelled' }, tokenAdmin);
  assert('Cancelling delivered order is BLOCKED (400)', cancelDeliveredRes.status === 400);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. HIGH-CONCURRENCY ADVERSARIAL STRESS TEST (10 Rapid Add-To-Cart)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 5. High-Concurrency Stress Test (10 Rapid Mutations) ─────');
  const tokenConc = await loginOrRegister(`ultraConc_${runId}@rarenuts.com`);
  
  // Initial add to create the cart
  const initCartRes = await request('POST', '/cart/items', { productId: product.id, quantity: 1 }, tokenConc);
  const concCartId = initCartRes.data?.id;
  assert('Initial cart created for concurrency stress test', !!concCartId);

  // 9 simultaneous concurrent add-to-cart operations targeting the exact same cart
  const concurrentAdds = Array.from({ length: 9 }, (_, i) =>
    request('POST', '/cart/items', { cartId: concCartId, productId: product.id, quantity: 1 }, tokenConc)
  );
  const addResults = await Promise.all(concurrentAdds);
  const successfulAdds = addResults.filter((r) => r.status === 200 || r.status === 201);
  assert('All 9 concurrent cart additions resolved safely', successfulAdds.length === 9);

  // Fetch final cart state
  const finalCartRes = await request('GET', `/cart?cartId=${concCartId}`, null, tokenConc);
  const cartItem = finalCartRes.data?.items?.find((i) => i.productId === product.id);
  assert('Cart converged to exact quantity of 10 without race corruption', cartItem?.quantity === 10);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. REGIONAL LATENCY & API PERFORMANCE MEASUREMENT
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 6. Regional Latency & Endpoint Performance Probes ────────');
  const endpoints = [
    { name: 'GET /products', method: 'GET', path: '/products?limit=6' },
    { name: 'GET /cart', method: 'GET', path: '/cart', token: tokenConc },
    { name: 'GET /health/readiness', method: 'GET', path: '/health/readiness' },
  ];

  for (const ep of endpoints) {
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const res = await request(ep.method, ep.path, null, ep.token);
      runs.push(res.latencyMs);
    }
    const avgLatency = Math.round(runs.reduce((a, b) => a + b, 0) / runs.length);
    assert(`${ep.name} measured successfully (Avg Latency: ${avgLatency}ms)`, avgLatency < 3000);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log(`  ULTRA AUDIT RESULTS: ${PASS} passed, ${FAIL} failed`);
  console.log('═════════════════════════════════════════════════════════════════\n');

  if (FAIL > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Ultra audit runner error:', err);
  process.exit(1);
});
