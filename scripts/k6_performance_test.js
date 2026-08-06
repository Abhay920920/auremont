import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Warm-up to 100 VUs
    { duration: '1m', target: 500 },    // Ramp up to 500 VUs
    { duration: '1m', target: 1000 },   // Peak load at 1000 VUs
    { duration: '30s', target: 5000 },  // Stress spike to 5000 VUs
    { duration: '30s', target: 0 },     // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  // Scenario 1: Browse Products
  const productsRes = http.get(`${BASE_URL}/products`);
  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
    'response has products data': (r) => r.body.includes('data'),
  });

  sleep(1);

  // Scenario 2: Validate Coupon
  const couponPayload = JSON.stringify({ code: 'LUXURY20', subtotal: 1500 });
  const couponRes = http.post(`${BASE_URL}/coupons/validate`, couponPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(couponRes, {
    'coupon validation completes': (r) => r.status === 200 || r.status === 400,
  });

  sleep(1);
}
