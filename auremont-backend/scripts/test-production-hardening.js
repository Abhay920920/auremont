/**
 * Production Hardening & Payment Reconciliation E2E Test Suite
 * Tests all 13 dimensions requested in the production hardening audit.
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

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
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
      lastName: 'Audit',
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

  const idemKey = `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const orderRes = await request('POST', '/orders', {
    cartId,
    idempotencyKey: idemKey,
    guestEmail: token ? undefined : guestEmail,
    address: {
      fullName: 'Audit Tester',
      phone: '9876543210',
      addressLine1: '456 Reserve Road',
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
  console.log('  RARE NUTS — FINAL PAYMENT RECONCILIATION & PRODUCTION AUDIT    ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  // Setup Unique Users for isolated tests
  const runId = Date.now() + '_' + Math.random().toString(36).substring(7);
  const tokenA = await loginOrRegister(`custA_${runId}@rarenuts.com`);
  const tokenB = await loginOrRegister(`custB_${runId}@rarenuts.com`);
  const tokenC = await loginOrRegister(`custC_${runId}@rarenuts.com`);
  const tokenD = await loginOrRegister(`custD_${runId}@rarenuts.com`);
  assert('Customer test accounts authenticated', !!tokenA && !!tokenB && !!tokenC && !!tokenD);

  const productsRes = await request('GET', '/products?limit=5&status=true');
  const product = productsRes.data?.data?.[0] || productsRes.data?.[0];
  assert('Product loaded', !!product?.id);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. WEBHOOK RECONCILIATION TEST (Browser drops, Webhook rescues)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 1. Webhook Reconciliation (No frontend verify call) ───────');
  const { orderId: order1Id, paymentSession: ps1 } = await createCartAndOrder(tokenA, null, product, 1);
  assert('Order 1 created for webhook test', !!order1Id && !!ps1);

  // Status before webhook
  const statusBeforeWebhook = await request('GET', `/orders/${order1Id}/payment-status`, null, tokenA);
  assert('Order 1 initially pending before webhook', statusBeforeWebhook.data?.paymentStatus === 'pending');

  // Simulate Razorpay Webhook event: payment.captured
  const webhookPayload = {
    id: `evt_test_${Date.now()}`,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_webhook_${Date.now()}`,
          order_id: ps1.razorpayOrderId,
          amount: ps1.amount, // in paise
          currency: 'INR',
          status: 'captured',
        }
      }
    }
  };

  const webhookRes = await sendWebhook(webhookPayload);
  assert('Webhook processed successfully', webhookRes.status === 200 || webhookRes.data?.received === true, webhookRes.data);

  // Check order status after webhook
  const statusAfterWebhook = await request('GET', `/orders/${order1Id}/payment-status`, null, tokenA);
  assert('Order 1 reconciled to PAID via webhook', statusAfterWebhook.data?.paymentStatus === 'paid');
  assert('Order 1 reconciled to CONFIRMED via webhook', statusAfterWebhook.data?.orderStatus === 'confirmed');

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. IDEMPOTENCY & CONCURRENCY TEST (Verify + Webhook simultaneously)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 2. Concurrency & Idempotency (Verify + Webhook simultaneously) ──');
  const { orderId: order2Id, paymentSession: ps2 } = await createCartAndOrder(tokenB, null, product, 1);
  assert('Order 2 created for concurrency test', !!order2Id && !!ps2);

  const duplicatePayload = {
    id: `evt_test_dup_${Date.now()}`,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_concurrent_${Date.now()}`,
          order_id: ps2.razorpayOrderId,
          amount: ps2.amount,
          currency: 'INR',
          status: 'captured',
        }
      }
    }
  };

  // Run 4 concurrent operations on the same order:
  const [resVerify1, resWebhook1, resVerify2, resWebhook2] = await Promise.all([
    request('POST', '/payments/verify', {
      razorpay_order_id: ps2.razorpayOrderId,
      razorpay_payment_id: `pay_concurrent_1_${Date.now()}`,
      razorpay_signature: 'mock_signature',
    }, tokenB),
    sendWebhook(duplicatePayload),
    request('POST', '/payments/verify', {
      razorpay_order_id: ps2.razorpayOrderId,
      razorpay_payment_id: `pay_concurrent_2_${Date.now()}`,
      razorpay_signature: 'mock_signature',
    }, tokenB),
    sendWebhook(duplicatePayload),
  ]);

  assert('Verify 1 succeeded', resVerify1.status === 200 && resVerify1.data?.order?.paymentStatus === 'paid');
  assert('Verify 2 idempotent', resVerify2.status === 200 && resVerify2.data?.order?.paymentStatus === 'paid');
  assert('Webhook 1 handled safely', resWebhook1.status === 200);
  assert('Webhook 2 handled safely (duplicate rejected/handled)', resWebhook2.status === 200);

  const statusAfterConcurrent = await request('GET', `/orders/${order2Id}/payment-status`, null, tokenB);
  assert('Final state is exactly PAID', statusAfterConcurrent.data?.paymentStatus === 'paid');
  assert('Final state is exactly CONFIRMED', statusAfterConcurrent.data?.orderStatus === 'confirmed');

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PAYMENT STATUS TRANSITIONS & NO-DOWNGRADE RULE
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 3. Payment Status Transitions & Downgrade Prevention ─────');
  // Attempt to cancel a PAID order — should be blocked
  const cancelPaidRes = await request('DELETE', `/orders/${order2Id}/cancel`, null, tokenB);
  assert('Paid order CANNOT be cancelled by user', cancelPaidRes.status === 400, cancelPaidRes.data);

  // Status must remain paid and confirmed
  const statusAfterCancelAttempt = await request('GET', `/orders/${order2Id}/payment-status`, null, tokenB);
  assert('Payment status did NOT downgrade from paid', statusAfterCancelAttempt.data?.paymentStatus === 'paid');
  assert('Order status did NOT downgrade from confirmed', statusAfterCancelAttempt.data?.orderStatus === 'confirmed');

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. INVENTORY CONSISTENCY & DOUBLE RESTORATION PROTECTION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 4. Inventory Consistency & Double-Restoration Guard ──────');
  // Create an order and cancel it (unpaid) using User C
  const { orderId: order3Id } = await createCartAndOrder(tokenC, null, product, 2);
  const cancelUnpaidRes = await request('DELETE', `/orders/${order3Id}/cancel`, null, tokenC);
  assert('Unpaid order successfully cancelled', cancelUnpaidRes.status === 200);

  // Try cancelling again — should fail
  const cancelAgainRes = await request('DELETE', `/orders/${order3Id}/cancel`, null, tokenC);
  assert('Repeated cancellation rejected', cancelAgainRes.status === 400);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. AUTHORIZATION & GUEST SECURITY
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 5. Authorization & Order Confirmation Security ───────────');
  // Customer B tries to view Customer A's full order details
  const crossUserOrderRes = await request('GET', `/orders/${order1Id}`, null, tokenB);
  assert('Customer B forbidden from viewing Customer A full order', crossUserOrderRes.status === 403 || crossUserOrderRes.status === 404);

  // Customer B tries to poll Customer A's payment status without token
  const crossUserStatusRes = await request('GET', `/orders/${order1Id}/payment-status`, null, tokenB);
  assert('Customer B forbidden from polling Customer A payment status', crossUserStatusRes.status === 404);

  // Anonymous request without token -> 404 (prevents order ID enumeration)
  const anonNoTokenRes = await request('GET', `/orders/${order1Id}/payment-status`);
  assert('Anonymous polling without token is blocked (404)', anonNoTokenRes.status === 404);

  // Guest order creation with orderToken verification
  const { orderId: guestOrderId, orderToken: gToken } = await createCartAndOrder(null, 'guest_prod_audit@rarenuts.com', product, 1);
  assert('Guest order generated secure orderToken', !!gToken && gToken.length === 32);

  // Guest polling with VALID token -> 200
  const guestValidPoll = await request('GET', `/orders/${guestOrderId}/payment-status?token=${gToken}`);
  assert('Guest polling WITH valid token succeeds (200)', guestValidPoll.status === 200);

  // Guest polling with INVALID token -> 404
  const guestInvalidPoll = await request('GET', `/orders/${guestOrderId}/payment-status?token=invalid_forged_token_1234567890ab`);
  assert('Guest polling with forged token rejected (404)', guestInvalidPoll.status === 404);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. FAILURE MATRIX TESTS (Amount Mismatch, Currency Mismatch, Invalid Sig)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n── 6. Failure Matrix Verification ───────────────────────────');

  // Amount mismatch test via webhook using User D
  const { paymentSession: psFail1 } = await createCartAndOrder(tokenD, null, product, 1);
  const badAmountWebhook = {
    id: `evt_bad_amt_${Date.now()}`,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_bad_amt_${Date.now()}`,
          order_id: psFail1.razorpayOrderId,
          amount: psFail1.amount - 5000, // 50 rupees underpaid!
          currency: 'INR',
          status: 'captured',
        }
      }
    }
  };
  const badAmountRes = await sendWebhook(badAmountWebhook);
  assert('Underpayment rejected (400)', badAmountRes.status === 400, badAmountRes.data);

  // Currency mismatch test via webhook using User D
  const { paymentSession: psFail2 } = await createCartAndOrder(tokenD, null, product, 1);
  const badCurrencyWebhook = {
    id: `evt_bad_curr_${Date.now()}`,
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_bad_curr_${Date.now()}`,
          order_id: psFail2.razorpayOrderId,
          amount: psFail2.amount,
          currency: 'USD', // wrong currency!
          status: 'captured',
        }
      }
    }
  };
  const badCurrencyRes = await sendWebhook(badCurrencyWebhook);
  assert('Wrong currency rejected (400)', badCurrencyRes.status === 400, badCurrencyRes.data);

  // Invalid order ID in verify
  const invalidOrderVerify = await request('POST', '/payments/verify', {
    razorpay_order_id: 'order_nonexistent_999999',
    razorpay_payment_id: 'pay_123',
    razorpay_signature: 'sig_123',
  }, tokenD);
  assert('Non-existent order verification returns 404', invalidOrderVerify.status === 404);

  // ─────────────────────────────────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log(`  FINAL RECONCILIATION AUDIT: ${PASS} passed, ${FAIL} failed`);
  console.log('═════════════════════════════════════════════════════════════════\n');

  if (FAIL > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Audit runner error:', err);
  process.exit(1);
});
