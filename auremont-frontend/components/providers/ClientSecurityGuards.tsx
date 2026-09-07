'use client';

import { useEffect } from 'react';

export default function ClientSecurityGuards() {
  useEffect(() => {
    // Suppress noisy browser extension errors from polluting application error telemetry
    const handleExtensionError = (e: ErrorEvent) => {
      if (
        e.message &&
        (e.message.includes('startTime') || e.message.includes('reportAllChanges'))
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return true;
      }
    };

    window.addEventListener('error', handleExtensionError, true);

    // Register service worker safely in browser environment
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('ServiceWorker registration failed:', err);
      });
    }

    return () => {
      window.removeEventListener('error', handleExtensionError, true);
    };
  }, []);

  return null;
}
