// tests/security/setup.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../auremont-backend/src/app.module';
import * as request from 'supertest';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

let app: INestApplication;

export async function initApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [Reflector, JwtService],
  }).compile();
  app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

export function getApp(): INestApplication {
  if (!app) {
    throw new Error('Nest application not initialized. Call initApp() first.');
  }
  return app;
}

export const requestAgent = (): any => request(getApp().getHttpServer());
