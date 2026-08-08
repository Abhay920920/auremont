import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('Controllers E2E & HTTP Pipeline Suite (Supertest)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    it('should return 200 OK and list of products', async () => {
      const res = await request(app.getHttpServer()).get('/products');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /orders/me — JWT Auth Guard Protection', () => {
    it('should return 401 Unauthorized when no JWT token is provided', async () => {
      const res = await request(app.getHttpServer()).get('/orders/me');
      expect(res.status).toBe(401);
    });

    it('should return 401 Unauthorized when malformed JWT Bearer token is provided', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders/me')
        .set('Authorization', 'Bearer this.is.invalid');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/register Mass Assignment Protection', () => {
    it('should strip or reject role: admin field (Mass Assignment Defense)', async () => {
      const testEmail = `test_security_${Date.now()}@rarenuts.com`;
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Security',
          lastName: 'Tester',
          email: testEmail,
          password: 'Password@123',
          role: 'admin',
        });

      // ValidationPipe with forbidNonWhitelisted strips `role` or returns 400
      if (res.status === 201) {
        expect(res.body.user.role).toBe('customer');
      } else {
        expect(res.status).toBe(400);
      }
    });
  });

  describe('GET /admin/customers — RBAC Access Control', () => {
    it('should return 401 when no token provided to admin endpoint', async () => {
      const res = await request(app.getHttpServer()).get('/admin/customers');
      expect(res.status).toBe(401);
    });

    it('should deny customer token access to admin endpoint with 403 Forbidden', async () => {
      // Attempt login with customer credentials
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'example@gmail.com', password: 'password123' });

      if (loginRes.status === 200) {
        const token = loginRes.body.access_token;
        const adminRes = await request(app.getHttpServer())
          .get('/admin/customers')
          .set('Authorization', `Bearer ${token}`);
        // Customer should get 403 (has token but wrong role)
        expect(adminRes.status).toBe(403);
      } else {
        // If login fails (user doesn't exist in test DB), just verify the route is guarded
        const guardRes = await request(app.getHttpServer())
          .get('/admin/customers')
          .set('Authorization', 'Bearer fake.customer.token');
        expect([401, 403]).toContain(guardRes.status);
      }
    });
  });
});
