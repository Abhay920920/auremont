const http = require('http');

const BASE_URL = 'http://localhost:3001';
const keepAliveAgent = new http.Agent({ keepAlive: true, maxSockets: 100 });

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
        agent: keepAliveAgent,
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

async function runLoadTier(tierName, totalRequests, concurrency, productSlug, token) {
  console.log(`\n── Running ${tierName} (${totalRequests} total requests, Concurrency: ${concurrency}) ──`);
  
  // Traffic Distribution:
  // HOME: 30% (GET /categories)
  // SHOP: 25% (GET /products?page=1&limit=8)
  // PRODUCT: 20% (GET /products/${productSlug})
  // CART: 10% (GET /cart)
  // CHECKOUT / HEALTH: 10% (GET /health/readiness)
  // ORDER HISTORY: 5% (GET /orders/me)

  const requestsQueue = [];
  for (let i = 0; i < totalRequests; i++) {
    const rand = Math.random();
    if (rand < 0.30) {
      requestsQueue.push({ type: 'HOME', method: 'GET', path: '/categories' });
    } else if (rand < 0.55) {
      requestsQueue.push({ type: 'SHOP', method: 'GET', path: '/products?page=1&limit=8' });
    } else if (rand < 0.75) {
      requestsQueue.push({ type: 'PRODUCT', method: 'GET', path: `/products/${productSlug}` });
    } else if (rand < 0.85) {
      requestsQueue.push({ type: 'CART', method: 'GET', path: '/cart', auth: true });
    } else if (rand < 0.95) {
      requestsQueue.push({ type: 'HEALTH_CHECKOUT', method: 'GET', path: '/health/readiness' });
    } else {
      requestsQueue.push({ type: 'ORDERS', method: 'GET', path: '/orders/me', auth: true });
    }
  }

  const results = [];
  const startTime = Date.now();
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < requestsQueue.length) {
      const idx = currentIndex++;
      const item = requestsQueue[idx];
      const res = await request(item.method, item.path, null, item.auth ? token : null);
      results.push({ ...item, ...res });
    }
  }

  const workers = [];
  for (let w = 0; w < concurrency; w++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  const totalDurationMs = Date.now() - startTime;

  // Calculate stats
  const latencies = results.map(r => r.latencyMs).sort((a, b) => a - b);
  const successCount = results.filter(r => r.status >= 200 && r.status < 400).length;
  const failCount = results.length - successCount;
  const rps = (results.length / (totalDurationMs / 1000)).toFixed(1);

  const p50 = latencies[Math.floor(latencies.length * 0.50)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
  const min = latencies[0] || 0;
  const max = latencies[latencies.length - 1] || 0;

  console.log(`Results for ${tierName}:`);
  console.log(`  Requests: ${results.length} | Success: ${successCount} | Failed: ${failCount} (Error Rate: ${((failCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`  Duration: ${(totalDurationMs / 1000).toFixed(2)}s | Throughput: ${rps} req/sec`);
  console.log(`  Latency : Min: ${min}ms | P50: ${p50}ms | P95: ${p95}ms | P99: ${p99}ms | Max: ${max}ms`);

  // Per-endpoint breakdown
  const types = {};
  for (const r of results) {
    if (!types[r.type]) types[r.type] = [];
    types[r.type].push(r.latencyMs);
  }
  console.log(`  Breakdown by endpoint:`);
  for (const [t, lats] of Object.entries(types)) {
    lats.sort((a, b) => a - b);
    const tp50 = lats[Math.floor(lats.length * 0.5)];
    const tp95 = lats[Math.floor(lats.length * 0.95)];
    console.log(`    ${t.padEnd(16)} (n=${lats.length}): P50=${tp50}ms, P95=${tp95}ms, Max=${lats[lats.length - 1]}ms`);
  }

  return { totalRequests, concurrency, rps, p50, p95, p99, errorRate: (failCount / results.length) * 100 };
}

async function runFullLoadTest() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('   RARE NUTS — REAL PRODUCTION STAGING LOAD & LATENCY AUDIT      ');
  console.log('═════════════════════════════════════════════════════════════════\n');

  // Register fresh authenticated test buyer
  const buyerEmail = `load_test_buyer_${Date.now()}@rarenuts.com`;
  const regRes = await request('POST', '/auth/register', {
    email: buyerEmail,
    password: 'Password123!',
    firstName: 'Load',
    lastName: 'Buyer',
  });
  const token = regRes.data?.accessToken || regRes.data?.access_token;
  console.log(`✓ Authenticated test buyer: ${buyerEmail} (Token: ${token ? 'OK' : 'MISSING'})\n`);

  // Fetch product slug
  const prodRes = await request('GET', '/products?limit=1');
  const product = prodRes.data?.data?.[0] || prodRes.data?.[0];
  const slug = product?.slug || 'himalayan-wild-chilgoza-pine-nuts-200g';

  // Warm up / prime cache
  console.log('Priming in-memory caches...');
  await Promise.all([
    request('GET', '/categories'),
    request('GET', '/products?page=1&limit=8'),
    request('GET', `/products/${slug}`),
    request('GET', '/health/readiness'),
    request('GET', '/cart', null, token),
    request('GET', '/orders/me', null, token),
  ]);
  console.log('✓ In-memory caches primed.\n');

  // Read initial health/metrics
  const initialHealth = await request('GET', '/health/readiness');
  console.log(`Initial System Health: DB Ping = ${initialHealth.data?.database?.latency_ms || 'OK'}ms, Memory = ${initialHealth.data?.memory?.heap_used_mb || 'N/A'}MB`);

  // Tier 1: 100 requests (Concurrency: 10)
  const t1 = await runLoadTier('TIER 1 (100 Requests)', 100, 10, slug, token);

  // Tier 2: 500 requests (Concurrency: 25)
  const t2 = await runLoadTier('TIER 2 (500 Requests)', 500, 25, slug, token);

  // Tier 3: 1000 requests (Concurrency: 50)
  const t3 = await runLoadTier('TIER 3 (1000 Requests)', 1000, 50, slug, token);

  const finalHealth = await request('GET', '/health/readiness');
  console.log(`\nFinal System Health: DB Ping = ${finalHealth.data?.details?.database?.latencyMs || 'OK'}ms, Memory = ${finalHealth.data?.details?.memory?.heapUsedMB || 'N/A'}MB`);

  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log('LOAD TEST SUMMARY MATRIX:');
  console.table([t1, t2, t3]);
  console.log('═════════════════════════════════════════════════════════════════\n');

  process.exit(0);
}

runFullLoadTest().catch(err => {
  console.error('Fatal load test error:', err);
  process.exit(1);
});
