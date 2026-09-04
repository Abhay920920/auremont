import { validateEnvironment } from './config/env.validation';

describe('CORS & Secret Validation Security Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('DENY: validateEnvironment throws if JWT_SECRET is missing in production', () => {
    (process.env as any).NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    process.env.RAZORPAY_WEBHOOK_SECRET = 'strong_random_webhook_secret_value_123';
    process.env.ORDER_TOKEN_SECRET = 'strong_random_order_secret_value_123';

    expect(() => validateEnvironment()).toThrow(/JWT_SECRET must be configured/);
  });

  test('DENY: validateEnvironment throws if JWT_SECRET uses known insecure default', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.JWT_SECRET = 'AUREMONT_LUXURY_SECRET_KEY';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'strong_random_webhook_secret_value_123';
    process.env.ORDER_TOKEN_SECRET = 'strong_random_order_secret_value_123';

    expect(() => validateEnvironment()).toThrow(/JWT_SECRET must be configured/);
  });

  test('DENY: validateEnvironment throws if RAZORPAY_WEBHOOK_SECRET is missing in production', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.JWT_SECRET = 'strong_random_jwt_secret_value_123';
    delete process.env.RAZORPAY_WEBHOOK_SECRET;
    process.env.ORDER_TOKEN_SECRET = 'strong_random_order_secret_value_123';

    expect(() => validateEnvironment()).toThrow(/RAZORPAY_WEBHOOK_SECRET must be configured/);
  });

  test('DENY: validateEnvironment throws if ALLOW_MOCK_PAYMENTS=true in production', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.JWT_SECRET = 'strong_random_jwt_secret_value_123';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'strong_random_webhook_secret_value_123';
    process.env.ORDER_TOKEN_SECRET = 'strong_random_order_secret_value_123';
    process.env.ALLOW_MOCK_PAYMENTS = 'true';

    expect(() => validateEnvironment()).toThrow(/ALLOW_MOCK_PAYMENTS cannot be enabled/);
  });

  test('ALLOW: validateEnvironment passes in production with all required strong secrets', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.JWT_SECRET = 'strong_production_jwt_secret_at_least_32_chars';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'strong_production_webhook_secret_key_456';
    process.env.ORDER_TOKEN_SECRET = 'strong_production_order_token_secret_789';
    delete process.env.ALLOW_MOCK_PAYMENTS;

    expect(() => validateEnvironment()).not.toThrow();
  });
});
