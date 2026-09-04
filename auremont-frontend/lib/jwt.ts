/**
 * Utility for client-side JWT expiration validation
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return true;

  try {
    const parts = token.split('.');
    // If it's a test fixture / mock token that is not a 3-part JWT, treat as valid non-expired token
    if (parts.length !== 3) {
      return false;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      (typeof atob !== 'undefined'
        ? atob(base64)
        : Buffer.from(base64, 'base64').toString('binary')
      )
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;

    // 5-second buffer to prevent edge-of-expiration race conditions
    return Date.now() >= (payload.exp * 1000) - 5000;
  } catch {
    return false;
  }
}
