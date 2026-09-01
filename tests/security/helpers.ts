// tests/security/helpers.ts
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../auremont-backend/src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

let jwtService: JwtService;
let app: INestApplication;

export async function initTestApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  await app.init();
  jwtService = moduleFixture.get<JwtService>(JwtService);
  return app;
}

export function getCustomerToken(sub: string = 'cust-001'): string {
  const payload = { email: `${sub}@example.com`, sub, role: 'customer' } as any;
  return jwtService.sign(payload, { secret: 'AUREMONT_LUXURY_SECRET_KEY' });
}

export function getAdminToken(): string {
  const payload = { email: 'admin@example.com', sub: 'admin-001', role: 'admin' } as any;
  return jwtService.sign(payload, { secret: 'AUREMONT_LUXURY_SECRET_KEY' });
}
