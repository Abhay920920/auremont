const http = require('http');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3001';
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

function request(method, path, body = null, token = null, headers = {}) {
  return new Promise((resolve) => {
    const start = Date.now();
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (token) reqHeaders['Authorization'] = `Bearer ${token}`;
    if (postData) reqHeaders['Content-Length'] = Buffer.byteLength(postData);

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          const latencyMs = Date.now() - start;
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawData);
          } catch {
            parsedData = rawData;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData,
            latencyMs,
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({ status: 500, error: err.message, latencyMs: Date.now() - start });
    });

    if (postData) req.write(postData);
    req.end();
  });
}

function sendWebhook(payload) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_12345';
  const sig = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(payload)).digest('hex');
  return request('POST', '/payments/webhook', payload, null, { 'x-razorpay-signature': sig });
}

async function loginOrRegister(email, password = 'Test@1234') {
  let loginRes = await request('POST', '/auth/login', { email, password });
  let token = loginRes.data?.accessToken || loginRes.data?.access_token;
  if (!token) {
    await request('POST', '/auth/register', {
      email,
      password,
      firstName: 'Chaos',
      lastName: 'Tester',
    });
    loginRes = await request('POST', '/auth/login', { email, password });
    token = loginRes.data?.accessToken || loginRes.data?.access_token;
  }
  return token;
}

async function createCartAndOrder(token, guestEmail, product, qty = 1) {
  const addItemRes = await request('POST', '/cart/items', { productId: product.id, quantity: qty }, token);
  const cartId = addItemRes.data?.id;

  const idemKey = `chaos-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const orderRes = await request('POST', '/orders', {
    cartId,
    idempotencyKey: idemKey,
    guestEmail: token ? undefined : guestEmail,
    address: {
      fullName: 'Chaos Tester',
      phone: '9876543210',
      addressLine1: '100 Chaos Way',
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

async function runChaosAudit() {
  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log('   RARE NUTS — FINAL PRODUCTION CERTIFICATION & CHAOS AUDIT     ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  const runId = Date.now();

  // 1. Setup Accounts
  console.log('── 1. Setup Testing Fixtures ─────────────────────────────────');
  const tokenBuyerA = await loginOrRegister(`chaosBuyerA_${runId}@rarenuts.com`);
  const tokenBuyerB = await loginOrRegister(`chaosBuyerB_${runId}@rarenuts.com`);
  const tokenAdmin = await loginOrRegister('admin@rarenuts.com', 'Admin@12345');
  assert(!!tokenBuyerA && !!tokenBuyerB, 'Buyer test fixtures authenticated');
  assert(!!tokenAdmin, 'Admin test fixture authenticated');

  // Fetch product
  const prodRes = await request('GET', '/products?limit=1');
  const product = prodRes.data?.data?.[0] || prodRes.data?.[0];
  assert(!!product, `Test product loaded: ${product?.name} (Stock: ${product?.stockQty})`);

  // 2. Order State Machine: Impossible Transitions Invariant Matrix
  console.log('\n── 2. Order State Machine Invariant Matrix ───────────────────');
  const { orderId, paymentSession: ps1 } = await createCartAndOrder(tokenBuyerA, null, product, 1);
  assert(!!orderId && !!ps1, 'Order created in initial placed / pending state');

  // Test illegal direct jumps
  const illegalJumps = [
    { target: 'confirmed', desc: 'placed -> confirmed without payment (REJECT)' },
    { target: 'shipped', desc: 'placed -> shipped (REJECT)' },
    { target: 'delivered', desc: 'placed -> delivered (REJECT)' },
  ];

  for (const jump of illegalJumps) {
    const res = await request('PATCH', `/orders/admin/${orderId}/status`, { status: jump.target }, tokenAdmin);
    assert(res.status === 400, `State Machine Invariant: ${jump.desc} blocked with 400`);
  }

  // 3. Money / Integer Paise Exactness & Underpayment Guard
  console.log('\n── 3. Money & Integer Paise Exactness Guard ──────────────────');
  const { paymentSession: psFail } = await createCartAndOrder(tokenBuyerA, null, product, 1);
  const badAmountPaise = psFail.amount - 100; // 100 paise (₹1) underpaid

  // Underpayment via webhook (strictly rejected)
  const underpaidRes = await sendWebhook({
    id: `evt_under_${Date.now()}`,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_under_${Date.now()}`,
          order_id: psFail.razorpayOrderId,
          amount: badAmountPaise,
          currency: 'INR',
          status: 'captured',
        },
      },
    },
  });
  assert(underpaidRes.status === 400, 'Underpayment is strictly REJECTED (400)');

  // Wrong currency
  const wrongCurRes = await sendWebhook({
    id: `evt_cur_${Date.now()}`,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_cur_${Date.now()}`,
          order_id: psFail.razorpayOrderId,
          amount: psFail.amount,
          currency: 'USD',
          status: 'captured',
        },
      },
    },
  });
  assert(wrongCurRes.status === 400, 'Wrong currency (USD instead of INR) is strictly REJECTED (400)');

  // 4. Concurrency Race: Verify + Webhook Interleaving
  console.log('\n── 4. Concurrency Race: Verify + Webhook Simultaneous Arrival ─');
  const { orderId: raceOrderId, paymentSession: psRace } = await createCartAndOrder(tokenBuyerA, null, product, 1);
  
  const verifyPromise = request('POST', '/payments/verify', {
    orderId: raceOrderId,
    razorpay_order_id: psRace.razorpayOrderId,
    razorpay_payment_id: `pay_chaos_verify_${Date.now()}`,
    razorpay_signature: 'mock_signature',
  }, tokenBuyerA);

  const webhookPromise = sendWebhook({
    id: `evt_chaos_${Date.now()}`,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_chaos_wh_${Date.now()}`,
          order_id: psRace.razorpayOrderId,
          amount: psRace.amount,
          currency: 'INR',
          status: 'captured',
        },
      },
    },
  });

  const [vRes, wRes] = await Promise.all([verifyPromise, webhookPromise]);
  assert(vRes.status === 200 || vRes.status === 400, 'Verify handled cleanly during race');
  assert(wRes.status === 200 || wRes.status === 400, 'Webhook handled cleanly during race');

  // Verify convergence
  const statusRes = await request('GET', `/orders/${raceOrderId}/payment-status`, null, tokenBuyerA);
  assert(statusRes.data?.paymentStatus === 'paid', 'Order converged strictly to paymentStatus = paid');
  assert(statusRes.data?.orderStatus === 'confirmed', 'Order converged strictly to orderStatus = confirmed');

  // 5. Downgrade Immunity after Paid State
  console.log('\n── 5. Downgrade Immunity & Terminal Paid State Guard ─────────');
  const cancelAttempt = await request('DELETE', `/orders/${raceOrderId}/cancel`, null, tokenBuyerA);
  assert(cancelAttempt.status === 400, 'Paid order CANNOT be cancelled (400)');

  const statusAfterCancel = await request('GET', `/orders/${raceOrderId}/payment-status`, null, tokenBuyerA);
  assert(statusAfterCancel.data?.paymentStatus === 'paid', 'Payment status preserved as paid (zero regression)');

  // 6. Guest Token Security & Entropy Isolation
  console.log('\n── 6. Guest Token Authorization & IDOR Isolation ────────────');
  const { orderId: guestOrderId, orderToken: gToken } = await createCartAndOrder(null, `guest_${Date.now()}@rarenuts.com`, product, 1);
  assert(!!gToken && gToken.length === 32, 'Guest order generated secure HMAC orderToken');

  // Polling without token -> blocked
  const noTokenPoll = await request('GET', `/orders/${guestOrderId}/payment-status`);
  assert(noTokenPoll.status === 404, 'Guest order polling without token is BLOCKED (404)');

  // Polling with forged token -> blocked
  const forgedTokenPoll = await request('GET', `/orders/${guestOrderId}/payment-status?token=forged_token_xyz_1234567890`);
  assert(forgedTokenPoll.status === 404, 'Guest order polling with forged token is BLOCKED (404)');

  // Polling with legitimate token -> succeeds
  const validTokenPoll = await request('GET', `/orders/${guestOrderId}/payment-status?token=${gToken}`);
  assert(validTokenPoll.status === 200, 'Guest order polling WITH valid token SUCCEEDS (200)');

  // Customer B cannot view Customer A's order
  const idorPoll = await request('GET', `/orders/${raceOrderId}`, null, tokenBuyerB);
  assert(idorPoll.status === 404 || idorPoll.status === 403, 'Cross-user IDOR access is BLOCKED (403/404)');

  // 7. Results Summary
  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log(`  CHAOS CERTIFICATION RESULTS: ${passed} passed, ${failed} failed`);
  console.log('═════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runChaosAudit();
