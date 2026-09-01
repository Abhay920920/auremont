import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('Security Remediation & Validation Pipeline Verification', () => {
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

  describe('GET /reviews/user/:userId - Authorization Guard', () => {
    it('should deny unauthenticated requests with a 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer()).get('/reviews/user/some-user-uuid');
      expect(res.status).toBe(401);
    });

    it('should deny User A from fetching User B reviews with a 403 Forbidden', async () => {
      // Login as test customer (seeded as example@gmail.com / password123)
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'example@gmail.com', password: 'password123' });

      if (loginRes.status === 200) {
        const { access_token, user } = loginRes.body;
        // Attempt to fetch reviews of a different user ID
        const targetUserId = '00000000-0000-0000-0000-000000000000';
        const res = await request(app.getHttpServer())
          .get(`/reviews/user/${targetUserId}`)
          .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.status).toBe(403);
      }
    });

    it('should allow User A to fetch their own reviews with a 200 OK', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'example@gmail.com', password: 'password123' });

      if (loginRes.status === 200) {
        const { access_token, user } = loginRes.body;
        const res = await request(app.getHttpServer())
          .get(`/reviews/user/${user.id}`)
          .set('Authorization', `Bearer ${access_token}`);
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      }
    });
  });

  describe('POST /contact - Input Validation', () => {
    it('should reject malformed email address with 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .post('/contact')
        .send({
          name: 'Tester',
          email: 'invalid-email-format',
          subject: 'Help',
          message: 'Short message'
        });
      expect(res.status).toBe(400);
    });

    it('should reject oversized subject or name with 400 Bad Request', async () => {
      const longName = 'A'.repeat(151); // Max is 150
      const res = await request(app.getHttpServer())
        .post('/contact')
        .send({
          name: longName,
          email: 'test@rarenuts.com',
          subject: 'Help',
          message: 'Short message'
        });
      expect(res.status).toBe(400);
    });

    it('should accept properly formatted contact requests with 201 Created', async () => {
      const res = await request(app.getHttpServer())
        .post('/contact')
        .send({
          name: 'Contact Security Test',
          email: 'test_sec@rarenuts.com',
          subject: 'Security Audit Query',
          message: 'Valid contact message payload body.'
        });
      expect(res.status).toBe(201);
    });
  });

  describe('POST /blogs - Admin Input Validation', () => {
    it('should deny non-admin users with 403 Forbidden', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'example@gmail.com', password: 'password123' });

      if (loginRes.status === 200) {
        const { access_token } = loginRes.body;
        const res = await request(app.getHttpServer())
          .post('/blogs')
          .set('Authorization', `Bearer ${access_token}`)
          .send({
            title: 'New Blog Post',
            content: 'Blog contents...'
          });
        expect(res.status).toBe(403);
      }
    });

    it('should reject requests with missing title or content with 400 Bad Request (when admin token is provided)', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@rarenuts.com', password: 'Admin@12345' });

      if (loginRes.status === 200) {
        const { access_token } = loginRes.body;
        // Send request with empty title
        const res = await request(app.getHttpServer())
          .post('/blogs')
          .set('Authorization', `Bearer ${access_token}`)
          .send({
            title: '',
            content: 'Valid content'
          });
        expect(res.status).toBe(400);
      }
    });
  });
});
