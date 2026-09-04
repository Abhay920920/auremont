const http = require('http');
const { PrismaClient } = require('@prisma/client');

const BASE_URL = 'http://localhost:3001';

function request(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const start = Date.now();
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
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
          let parsed = null;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            parsed = rawData;
          }
          resolve({
            status: res.statusCode,
            data: parsed,
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

async function runFlashSaleContentionTest() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('   RARE NUTS — FLASH SALE CONCURRENCY & STOCK CONTENTION TEST    ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  let prisma = new PrismaClient();
  await prisma.$connect();

  // Step 1: Fetch target product
  const product = await prisma.product.findFirst({
    where: { slug: 'himalayan-wild-chilgoza-pine-nuts-200g' },
  });

  if (!product) {
    console.error('❌ Test product not found');
    process.exit(1);
  }

  const FLASH_SALE_STOCK = 10;
  const CONCURRENT_CUSTOMERS = 100;

  console.log(`Target Product: ${product.name} (ID: ${product.id})`);
  console.log(`Initial DB Stock: ${product.stockQty}`);

  // Step 2: Set product stock to exactly 10 units
  await prisma.product.update({
    where: { id: product.id },
    data: { stockQty: FLASH_SALE_STOCK },
  });
  console.log(`→ Product stock set to exactly ${FLASH_SALE_STOCK} units for flash sale.\n`);

  // Step 3: Fast-prepare 100 carts directly in PostgreSQL
  console.log(`Preparing ${CONCURRENT_CUSTOMERS} carts directly in DB for simultaneous checkout...`);
  
  // Find or create active carts with 1 item of this product
  const existingCarts = await prisma.cart.findMany({
    where: {
      status: 'active',
      items: {
        some: { productId: product.id, quantity: { gte: 1 } },
      },
    },
    take: CONCURRENT_CUSTOMERS,
    select: { id: true },
  });

  const cartIds = existingCarts.map(c => c.id);
  const needed = CONCURRENT_CUSTOMERS - cartIds.length;

  if (needed > 0) {
    console.log(`Creating ${needed} additional carts in DB...`);
    for (let i = 0; i < needed; i++) {
      const newCart = await prisma.cart.create({
        data: {
          status: 'active',
          items: {
            create: {
              productId: product.id,
              quantity: 1,
              unitPrice: product.salePrice || product.price,
              subtotal: product.salePrice || product.price,
            },
          },
        },
      });
      cartIds.push(newCart.id);
    }
  }

  console.log(`✓ Prepared exactly ${cartIds.length} carts for concurrent checkout.\n`);
  await prisma.$disconnect();

  // Step 4: Fire 100 SIMULTANEOUS checkout requests
  console.log(`🚀 FIRING ${cartIds.length} SIMULTANEOUS CHECKOUT REQUESTS (Stock = ${FLASH_SALE_STOCK})...`);
  const startCheckoutTime = Date.now();

  const checkoutPromises = cartIds.map((cartId, idx) => {
    return request('POST', '/orders', {
      cartId,
      idempotencyKey: `flash-${Date.now()}-${idx}-${Math.random().toString(36).substring(7)}`,
      guestEmail: `flash_buyer_${idx}_${Date.now()}@rarenuts.com`,
      address: {
        fullName: `Flash Buyer ${idx}`,
        phone: '9876543210',
        addressLine1: `${idx} Contention Road`,
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
    });
  });

  const results = await Promise.all(checkoutPromises);
  const totalDurationMs = Date.now() - startCheckoutTime;

  // Step 5: Analyze Results
  let successfulOrders = 0;
  let outOfStockRejections = 0;
  let otherErrors = 0;
  const latencies = [];

  for (const res of results) {
    latencies.push(res.latencyMs);
    if (res.status === 201 && res.data?.id) {
      successfulOrders++;
    } else if (res.status === 400 && (JSON.stringify(res.data).toLowerCase().includes('stock') || JSON.stringify(res.data).toLowerCase().includes('quantity') || JSON.stringify(res.data).toLowerCase().includes('available'))) {
      outOfStockRejections++;
    } else {
      otherErrors++;
      console.log(`Status ${res.status}:`, res.data);
    }
  }

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];

  // Step 6: Verify Final Database Stock
  prisma = new PrismaClient();
  await prisma.$connect();
  const finalProduct = await prisma.product.findUnique({
    where: { id: product.id },
    select: { stockQty: true },
  });

  console.log('\n─────────────────────────────────────────────────────────────────');
  console.log('FLASH SALE CONCURRENCY RESULTS:');
  console.log(`  Total Checkout Attempts : ${results.length}`);
  console.log(`  Total Execution Time    : ${totalDurationMs}ms`);
  console.log(`  Throughput              : ${(results.length / (totalDurationMs / 1000)).toFixed(2)} orders/sec`);
  console.log(`  Latency P50 / P95 / P99 : ${p50}ms / ${p95}ms / ${p99}ms`);
  console.log(`  Successful Orders (201) : ${successfulOrders}`);
  console.log(`  Stock Rejections (400)  : ${outOfStockRejections}`);
  console.log(`  Other / Unexpected Errs : ${otherErrors}`);
  console.log(`  Final Database Stock    : ${finalProduct.stockQty}`);
  console.log('─────────────────────────────────────────────────────────────────\n');

  // Strict Invariant Checks
  let passed = true;

  if (successfulOrders > FLASH_SALE_STOCK) {
    console.error(`❌ CRITICAL INVARIANT VIOLATION: Oversold! Expected at most ${FLASH_SALE_STOCK}, got ${successfulOrders}`);
    passed = false;
  } else {
    console.log(`✅ INVARIANT PRESERVED: Exactly ${successfulOrders} orders reserved stock (<= ${FLASH_SALE_STOCK} stock cap).`);
  }

  if (finalProduct.stockQty < 0) {
    console.error(`❌ CRITICAL INVARIANT VIOLATION: Stock dropped below zero: ${finalProduct.stockQty}`);
    passed = false;
  } else {
    console.log(`✅ INVARIANT PRESERVED: Product stock is non-negative (Final Stock: ${finalProduct.stockQty}).`);
  }

  if (otherErrors > 0) {
    console.warn(`⚠️ Non-stock error responses observed: ${otherErrors}`);
  } else {
    console.log(`✅ INVARIANT PRESERVED: Zero unhandled crashes or unhandled exceptions.`);
  }

  // Restore stock back to 100
  await prisma.product.update({
    where: { id: product.id },
    data: { stockQty: 100 },
  });
  console.log(`→ Product stock replenished back to 100 for ongoing operations.`);

  await prisma.$disconnect();
  console.log(`\nOVERALL STATUS: ${passed ? '🟢 PASS' : '🔴 FAIL'}`);
  process.exit(passed ? 0 : 1);
}

runFlashSaleContentionTest().catch(err => {
  console.error('Fatal flash sale test error:', err);
  process.exit(1);
});
