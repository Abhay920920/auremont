import { redactSensitiveData, StructuredLogger } from './structured-logger.service';

describe('StructuredLogger & Redaction (Observability)', () => {
  it('should recursively redact sensitive fields', () => {
    const payload = {
      email: 'customer@example.com',
      password: 'SuperSecretPassword123!',
      nested: {
        token: 'jwt.token.here',
        refreshToken: 'refresh.token.here',
        razorpay_signature: 'abc123hmac',
        safeProperty: 'luxury-nuts-250g',
      },
      tags: ['organic', 'raw'],
    };

    const redacted = redactSensitiveData(payload);
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.nested.token).toBe('[REDACTED]');
    expect(redacted.nested.refreshToken).toBe('[REDACTED]');
    expect(redacted.nested.razorpay_signature).toBe('[REDACTED]');
    expect(redacted.email).toBe('customer@example.com');
    expect(redacted.nested.safeProperty).toBe('luxury-nuts-250g');
    expect(redacted.tags).toEqual(['organic', 'raw']);
  });

  it('should format log messages safely without throwing', () => {
    const logger = new StructuredLogger();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Test message', {
      service: 'test-service',
      operation: 'test_op',
      password: 'DoNotLogThisPassword',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedOutput = consoleSpy.mock.calls[0][0];
    expect(loggedOutput).not.toContain('DoNotLogThisPassword');
    expect(loggedOutput).toContain('[REDACTED]');

    consoleSpy.mockRestore();
  });
});
