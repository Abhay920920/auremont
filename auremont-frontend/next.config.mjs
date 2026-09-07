/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  poweredByHeader: false,
  // Tree-shake large icon/animation libraries — eliminates unused bundle weight
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      {
        source: '/pairing',
        destination: '/shop',
        permanent: false, // 307
      },
    ];
  },
  async headers() {
    // In dev mode, Next.js hot-reloading / fast-refresh uses eval for source maps.
    // Return empty headers in development so browser dev tools and HMR aren't blocked.
    if (isDev) {
      return [];
    }
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.razorpay.com",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'} https://auremont.onrender.com https://checkout.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://cdn.razorpay.com`,
              "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com",
              "img-src 'self' data: blob: https://checkout.razorpay.com https://cdn.razorpay.com https://*.s3.ap-south-1.amazonaws.com https://auremont-uploads-production.s3.amazonaws.com https://images.unsplash.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.razorpay.com https://api.razorpay.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          }
        ]
      }
    ];
  },
  images: {
    // Serve modern formats — AVIF is ~50% smaller than JPEG, WebP ~30% smaller
    formats: ['image/avif', 'image/webp'],
    // Tuned breakpoints for product cards (250px, 400px) and hero images
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

