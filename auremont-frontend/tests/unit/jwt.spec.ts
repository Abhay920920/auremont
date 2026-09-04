import { isTokenExpired } from '@/lib/jwt';

describe('JWT Expiration Utility Suite', () => {
  const createMockJwt = (expInSecondsFromNow: number) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const exp = Math.floor(Date.now() / 1000) + expInSecondsFromNow;
    const payload = btoa(JSON.stringify({ sub: 'user-123', exp }));
    const signature = 'mock_signature';
    return `${header}.${payload}.${signature}`;
  };

  it('should return true for null or empty tokens', () => {
    expect(isTokenExpired(null)).toBe(true);
    expect(isTokenExpired(undefined)).toBe(true);
    expect(isTokenExpired('')).toBe(true);
  });

  it('should return false for non-JWT mock test strings', () => {
    expect(isTokenExpired('access_token_123')).toBe(false);
    expect(isTokenExpired('mock_token')).toBe(false);
  });

  it('should return false for future unexpired JWTs', () => {
    const token = createMockJwt(3600); // 1 hour in future
    expect(isTokenExpired(token)).toBe(false);
  });

  it('should return true for past expired JWTs', () => {
    const token = createMockJwt(-60); // 1 minute in past
    expect(isTokenExpired(token)).toBe(true);
  });

  it('should return true when within the 5-second expiration buffer', () => {
    const token = createMockJwt(2); // 2 seconds from now (< 5s buffer)
    expect(isTokenExpired(token)).toBe(true);
  });
});
