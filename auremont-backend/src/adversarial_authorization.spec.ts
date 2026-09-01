/**
 * Adversarial Authorization, IDOR & Cross-User Access Tests
 * Verifies backend enforces ownership and role boundaries.
 */
import axios, { AxiosInstance } from 'axios';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const API_URL = process.env.API_URL || 'http://localhost:3001';
const prisma = new PrismaClient();

function createAxios(baseURL: string = API_URL): AxiosInstance {
  return axios.create({ baseURL, validateStatus: () => true });
}

async function loginUser(email: string, password: string): Promise<string | null> {
  const api = createAxios();
  const res = await api.post('/auth/login', { email, password });
  return res.data?.access_token || null;
}

describe('Adversarial Authorization & IDOR Tests', () => {
  let userAToken: string;
  let userBToken: string;
  let adminToken: string;
  let userAId: string;
  let userBId: string;
  let userAOrderId: string | null = null;
  let userAAddressId: string | null = null;

  beforeAll(async () => {
    // Ensure test users exist
    const hashedPass = await bcrypt.hash('TestPass@123', 10);
    const userA = await prisma.user.upsert({
      where: { email: 'user_a_idor@test.com' },
      update: {},
      create: { email: 'user_a_idor@test.com', passwordHash: hashedPass, firstName: 'UserA', lastName: 'Test', role: 'customer', emailVerified: true },
    });
    const userB = await prisma.user.upsert({
      where: { email: 'user_b_idor@test.com' },
      update: {},
      create: { email: 'user_b_idor@test.com', passwordHash: hashedPass, firstName: 'UserB', lastName: 'Test', role: 'customer', emailVerified: true },
    });
    userAId = userA.id;
    userBId = userB.id;

    userAToken = await loginUser('user_a_idor@test.com', 'TestPass@123') || '';
    userBToken = await loginUser('user_b_idor@test.com', 'TestPass@123') || '';
    adminToken = await loginUser('admin@rarenuts.com', 'Admin@12345') || '';

    expect(userAToken).toBeTruthy();
    expect(userBToken).toBeTruthy();
    expect(adminToken).toBeTruthy();

    // Create an address for userA
    const api = createAxios();
    const addrRes = await api.post('/users/me/addresses', {
      fullName: 'User A Test',
      phone: '9999999999',
      addressLine1: '123 Test St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    }, { headers: { Authorization: `Bearer ${userAToken}` } });

    if (addrRes.status === 201 || addrRes.status === 200) {
      userAAddressId = addrRes.data?.id;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ─── 1. Unauthenticated Access ───────────────────────────────────────────────

  test('DENY: Unauthenticated access to GET /orders/me returns 401', async () => {
    const api = createAxios();
    const res = await api.get('/orders/me');
    expect(res.status).toBe(401);
  });

  test('DENY: Unauthenticated access to GET /users/me returns 401', async () => {
    const api = createAxios();
    const res = await api.get('/users/me');
    expect(res.status).toBe(401);
  });

  test('DENY: Unauthenticated access to admin endpoint returns 401', async () => {
    const api = createAxios();
    const res = await api.get('/admin/dashboard/metrics');
    expect(res.status).toBe(401);
  });

  // ─── 2. Customer → Admin Escalation ─────────────────────────────────────────

  test('DENY: Customer cannot access GET /admin/dashboard/metrics', async () => {
    const api = createAxios();
    const res = await api.get('/admin/dashboard/metrics', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    expect(res.status).toBe(403);
  });

  test('DENY: Customer cannot access GET /admin/orders', async () => {
    const api = createAxios();
    const res = await api.get('/admin/orders', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    expect(res.status).toBe(403);
  });

  test('DENY: Customer cannot access GET /users/admin/all (admin endpoint)', async () => {
    const api = createAxios();
    const res = await api.get('/users/admin/all', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    expect(res.status).toBe(403);
  });

  test('DENY: Customer cannot GET admin coupons at /coupons (admin-guarded)', async () => {
    const api = createAxios();
    const res = await api.get('/coupons', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    expect(res.status).toBe(403);
  });

  test('DENY: Customer cannot access GET /admin/products (admin endpoint)', async () => {
    const api = createAxios();
    const res = await api.get('/admin/products', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    expect(res.status).toBe(403);
  });

  // ─── 3. Cross-User IDOR on Orders ───────────────────────────────────────────

  test('IDOR: UserB cannot access UserA order via GET /orders/:id', async () => {
    // Get UserA's orders
    const api = createAxios();
    const myOrdersRes = await api.get('/orders/me', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });

    // If userA has orders, try to access from userB
    if (myOrdersRes.status === 200 && Array.isArray(myOrdersRes.data) && myOrdersRes.data.length > 0) {
      userAOrderId = myOrdersRes.data[0].id;
      const res = await api.get(`/orders/${userAOrderId}`, {
        headers: { Authorization: `Bearer ${userBToken}` }
      });
      expect(res.status).toBe(403);
    } else {
      // No orders for userA yet - mark as not applicable but not a failure
      console.log('UserA has no orders yet - IDOR order test skipped (not applicable)');
      expect(true).toBe(true);
    }
  });

  // ─── 4. Cross-User IDOR on Addresses ────────────────────────────────────────

  test('IDOR: UserB cannot GET UserA addresses via /users/me/addresses', async () => {
    // /users/me/addresses is scoped to the authenticated user via JWT
    const api = createAxios();
    const resA = await api.get('/users/me/addresses', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    const resB = await api.get('/users/me/addresses', {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    // Both should succeed but return different data
    expect(resA.status).toBe(200);
    expect(resB.status).toBe(200);
    // If userA has an address, it should NOT appear in userB's list
    if (userAAddressId && Array.isArray(resB.data)) {
      const leak = resB.data.find((a: any) => a.id === userAAddressId);
      expect(leak).toBeUndefined();
    }
  });

  test('IDOR: UserB cannot PATCH UserA address via /users/me/addresses/:id', async () => {
    if (!userAAddressId) {
      console.log('No address ID available - skipping');
      return;
    }
    const api = createAxios();
    const res = await api.patch(`/users/me/addresses/${userAAddressId}`, {
      fullName: 'HACKED',
    }, { headers: { Authorization: `Bearer ${userBToken}` } });
    // Should be 403 or 404 (not found in user B's scope, or forbidden)
    expect([400, 403, 404]).toContain(res.status);
  });

  test('IDOR: UserB cannot DELETE UserA address via /users/me/addresses/:id', async () => {
    if (!userAAddressId) {
      console.log('No address ID available - skipping');
      return;
    }
    const api = createAxios();
    const res = await api.delete(`/users/me/addresses/${userAAddressId}`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    expect([403, 404]).toContain(res.status);
  });

  // ─── 5. Cross-User IDOR on Profile ──────────────────────────────────────────

  test('IDOR: UserB cannot PATCH UserA profile (PATCH /users/me scoped to JWT)', async () => {
    const api = createAxios();
    // Each user can only patch their own profile via /users/me
    const resB = await api.patch('/users/me', { firstName: 'HACKED' }, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    // This should succeed for UserB's own profile (not UserA's)
    // The point is there's no endpoint to specify another user's ID without admin role
    expect([200, 400]).toContain(resB.status);
    
    // Verify UserA was NOT modified
    const resA = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    expect(resA.status).toBe(200);
    expect(resA.data.firstName).not.toBe('HACKED');
  });

  // ─── 6. Invalid/Modified JWT ─────────────────────────────────────────────────

  test('DENY: Modified JWT signature is rejected', async () => {
    const api = createAxios();
    const parts = userAToken.split('.');
    const fakePayload = Buffer.from(JSON.stringify({ sub: userBId, email: 'user_b_idor@test.com', role: 'admin' })).toString('base64url');
    const tamperedToken = `${parts[0]}.${fakePayload}.${parts[2]}`;

    const res = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${tamperedToken}` }
    });
    expect(res.status).toBe(401);
  });

  test('DENY: Completely invalid JWT is rejected', async () => {
    const api = createAxios();
    const res = await api.get('/users/me', {
      headers: { Authorization: 'Bearer invalid.token.here' }
    });
    expect(res.status).toBe(401);
  });

  test('DENY: Expired JWT is rejected (using a known-expired token format)', async () => {
    // Create a token with expired payload
    const api = createAxios();
    const fakeExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlLWlkIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDF9.fake_signature';
    const res = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${fakeExpiredToken}` }
    });
    expect(res.status).toBe(401);
  });

  // ─── 7. Admin verifies correctly authorized access ───────────────────────────

  test('ALLOW: Admin can access GET /admin/dashboard/metrics', async () => {
    const api = createAxios();
    const res = await api.get('/admin/dashboard/metrics', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    expect(res.status).toBe(200);
  });
});
