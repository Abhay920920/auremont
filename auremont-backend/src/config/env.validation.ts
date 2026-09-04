import { Logger } from '@nestjs/common';

const INSECURE_DEFAULTS = [
  'AUREMONT_LUXURY_SECRET_KEY',
  'webhook_secret_12345',
  'secret_12345',
  'order_token_secret_change_in_prod',
  'jwt_secret',
  'secret',
  'change_me',
];

export function validateEnvironment(): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const isStaging = process.env.NODE_ENV === 'staging';
  const isStrict = isProduction || isStaging;

  const jwtSecret = process.env.JWT_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const orderTokenSecret = process.env.ORDER_TOKEN_SECRET;

  if (isStrict) {
    if (!jwtSecret || INSECURE_DEFAULTS.includes(jwtSecret)) {
      throw new Error(
        'CRITICAL SECURITY ERROR: JWT_SECRET must be configured with a strong, secure secret in production/staging environments.',
      );
    }

    if (!webhookSecret || INSECURE_DEFAULTS.includes(webhookSecret)) {
      throw new Error(
        'CRITICAL SECURITY ERROR: RAZORPAY_WEBHOOK_SECRET must be configured with a valid gateway webhook secret in production/staging environments.',
      );
    }

    if (!orderTokenSecret || INSECURE_DEFAULTS.includes(orderTokenSecret)) {
      throw new Error(
        'CRITICAL SECURITY ERROR: ORDER_TOKEN_SECRET must be configured with a strong cryptographic secret in production/staging environments.',
      );
    }

    if (process.env.ALLOW_MOCK_PAYMENTS === 'true') {
      throw new Error(
        'CRITICAL SECURITY ERROR: ALLOW_MOCK_PAYMENTS cannot be enabled in production/staging environments.',
      );
    }
  } else {
    // Non-production warning
    if (!jwtSecret || INSECURE_DEFAULTS.includes(jwtSecret)) {
      Logger.warn(
        'JWT_SECRET is unset or using a default value. This is only permissible in local development.',
        'EnvValidator',
      );
    }
  }
}
