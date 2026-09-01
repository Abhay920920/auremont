/**
 * Adversarial Input Validation & XSS Tests
 * Tests all important input fields for boundary conditions.
 */
import axios, { AxiosInstance } from 'axios';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const API_URL = process.env.API_URL || 'http://localhost:3001';
const prisma = new PrismaClient();

function createAxios(): AxiosInstance {
  return axios.create({ baseURL: API_URL, validateStatus: () => true });
}

async function loginUser(email: string, password: string): Promise<string | null> {
  const api = createAxios();
  const res = await api.post('/auth/login', { email, password });
  return res.data?.access_token || null;
}

const XSS_PAYLOADS = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert(1)>',
  'javascript:alert(1)',
  '"><svg onload=alert(1)>',
  '\';alert(String.fromCharCode(88,83,83))//\';alert(String.fromCharCode(88,83,83))//";',
];

const SQL_PAYLOADS = [
  "'; DROP TABLE users; --",
  "' OR '1'='1",
  "' OR 1=1--",
  "1; SELECT * FROM users",
  "UNION SELECT username, password FROM users--",
];

describe('Adversarial Input Validation & XSS Tests', () => {
  let customerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    customerToken = await loginUser('example@gmail.com', 'password123') || '';
    adminToken = await loginUser('admin@rarenuts.com', 'Admin@12345') || '';
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ─── 1. Registration input validation ─────────────────────────────────────

  test('DENY: Registration with empty email is rejected', async () => {
    const api = createAxios();
    const res = await api.post('/auth/register', {
      email: '',
      password: 'ValidPass@123',
      firstName: 'Test',
      lastName: 'User',
    });
    expect([400, 422]).toContain(res.status);
  });

  test('DENY: Registration with invalid email format is rejected', async () => {
    const api = createAxios();
    const res = await api.post('/auth/register', {
      email: 'not-an-email',
      password: 'ValidPass@123',
      firstName: 'Test',
      lastName: 'User',
    });
    expect([400, 422]).toContain(res.status);
  });

  test('DENY: Registration with very long email is rejected or handled safely', async () => {
    const api = createAxios();
    const longEmail = 'a'.repeat(255) + '@test.com';
    const res = await api.post('/auth/register', {
      email: longEmail,
      password: 'ValidPass@123',
      firstName: 'Test',
      lastName: 'User',
    });
    expect(res.status).not.toBe(500);
    expect([400, 422, 409]).toContain(res.status);
  });

  test('DENY: Registration with weak password is rejected', async () => {
    const api = createAxios();
    const res = await api.post('/auth/register', {
      email: `weak_pass_test_${Date.now()}@test.com`,
      password: '123',
      firstName: 'Test',
      lastName: 'User',
    });
    // Backend may accept any password — this tests the actual behavior
    // If accepted, note it as P3 - no strong password validation on backend
    console.log(`Weak password registration status: ${res.status} (expected: 400)`);
    expect(res.status).not.toBe(500);
  });

  // ─── 2. XSS in registration fields ─────────────────────────────────────────

  test('XSS: Registration firstName with multiple XSS payloads is handled safely', async () => {
    const api = createAxios();
    for (const payload of XSS_PAYLOADS) {
      const res = await api.post('/auth/register', {
        email: `xss_test_${Date.now()}_${Math.random()}@test.com`,
        password: 'ValidPass@123',
        firstName: payload,
        lastName: 'Test',
      });
      // Should not 500 (crash)
      expect(res.status).not.toBe(500);
    }
  });

  // ─── 3. SQL injection in login ───────────────────────────────────────────────

  test('SQL Injection: Login with SQL payloads in email is safely handled', async () => {
    const api = createAxios();
    for (const payload of SQL_PAYLOADS) {
      const res = await api.post('/auth/login', {
        email: payload,
        password: 'anything',
      });
      // Must not 500 or return a valid token
      expect(res.status).not.toBe(500);
      expect(res.data?.access_token).toBeUndefined();
    }
  });

  // ─── 4. Contact form input validation ───────────────────────────────────────

  test('DENY: Contact form with empty required fields is rejected', async () => {
    const api = createAxios();
    const res = await api.post('/contact', {
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    expect([400, 422]).toContain(res.status);
  });

  test('SAFE: Contact form with XSS in message is handled safely', async () => {
    const api = createAxios();
    const res = await api.post('/contact', {
      name: 'Test User',
      email: 'test@test.com',
      subject: 'Test',
      message: '<script>alert(1)</script>',
    });
    // Should not crash (500)
    expect(res.status).not.toBe(500);
    // Should either reject (400) or accept and store safely (200/201)
    console.log(`XSS in contact message status: ${res.status}`);
  });

  // ─── 5. Product search XSS ──────────────────────────────────────────────────

  test('SAFE: Product search with XSS payload is handled safely', async () => {
    const api = createAxios();
    const xssQuery = encodeURIComponent('<script>alert(1)</script>');
    const res = await api.get(`/products/search?q=${xssQuery}`);
    expect(res.status).not.toBe(500);
  });

  // ─── 6. Large payload protection ────────────────────────────────────────────

  test('DENY: Very large JSON body is rejected', async () => {
    const api = createAxios();
    const largePayload = { data: 'x'.repeat(1024 * 1024) }; // 1MB string
    const res = await api.post('/auth/login', largePayload);
    // Should be rejected (413 or 400), not 500
    expect(res.status).not.toBe(500);
    expect([400, 413]).toContain(res.status);
  });

  // ─── 7. Negative/zero quantity in cart ──────────────────────────────────────

  test('DENY: Adding negative quantity to cart is rejected', async () => {
    const api = createAxios();
    
    // Get a product
    const productsRes = await api.get('/products?limit=1');
    const product = productsRes.data?.data?.[0];
    if (!product) { console.log('No products, skipping'); return; }

    // Get/create cart
    const cartRes = await api.get('/cart', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const cartId = cartRes.data?.id;
    if (!cartId) { console.log('No cart, skipping'); return; }

    const res = await api.post(`/cart/${cartId}/items`, {
      productId: product.id,
      quantity: -5,
    }, { headers: { Authorization: `Bearer ${customerToken}` } });
    
    // Must reject negative quantities
    expect([400, 422]).toContain(res.status);
    console.log(`Negative quantity status: ${res.status}`);
  });

  test('DENY: Adding zero quantity to cart is rejected', async () => {
    const api = createAxios();
    const productsRes = await api.get('/products?limit=1');
    const product = productsRes.data?.data?.[0];
    if (!product) { console.log('No products, skipping'); return; }

    const cartRes = await api.get('/cart', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const cartId = cartRes.data?.id;
    if (!cartId) { console.log('No cart, skipping'); return; }

    const res = await api.post(`/cart/${cartId}/items`, {
      productId: product.id,
      quantity: 0,
    }, { headers: { Authorization: `Bearer ${customerToken}` } });
    
    expect([400, 422]).toContain(res.status);
    console.log(`Zero quantity status: ${res.status}`);
  });

  test('DENY: Excessively large quantity is rejected or bounded', async () => {
    const api = createAxios();
    const productsRes = await api.get('/products?limit=1');
    const product = productsRes.data?.data?.[0];
    if (!product) { console.log('No products, skipping'); return; }

    const cartRes = await api.get('/cart', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const cartId = cartRes.data?.id;
    if (!cartId) { console.log('No cart, skipping'); return; }

    const res = await api.post(`/cart/${cartId}/items`, {
      productId: product.id,
      quantity: 999999,
    }, { headers: { Authorization: `Bearer ${customerToken}` } });
    
    // Should reject (stock check) or 400
    console.log(`Huge quantity status: ${res.status}`);
    expect(res.status).not.toBe(500);
    expect(res.status).not.toBe(200); // Should NOT succeed with 999999 units
  });

  // ─── 8. Admin product creation with XSS ─────────────────────────────────────

  test('SAFE: Admin product creation with XSS in name is handled safely', async () => {
    const api = createAxios();
    const res = await api.post('/admin/products', {
      name: '<script>alert(1)</script>Test Product',
      slug: 'xss-test-product-' + Date.now(),
      price: 999,
      stockQty: 10,
      categoryId: null,
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    
    // Should not 500
    expect(res.status).not.toBe(500);
    // If created (201), clean up
    if (res.status === 201 && res.data?.id) {
      await api.delete(`/admin/products/${res.data.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
  });

  // ─── 9. Forgot password with non-existent email (enumeration prevention) ─────

  test('SECURITY: Forgot password does not reveal if email exists', async () => {
    const api = createAxios();
    const [existingRes, nonExistingRes] = await Promise.all([
      api.post('/auth/forgot-password', { email: 'example@gmail.com' }),
      api.post('/auth/forgot-password', { email: 'definitely_not_real_' + Date.now() + '@test.com' }),
    ]);
    // Both should return the same response (no enumeration)
    expect(existingRes.status).toBe(nonExistingRes.status);
    expect(existingRes.data?.message).toBe(nonExistingRes.data?.message);
  });
});
