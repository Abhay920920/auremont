/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tree-shake large icon/animation libraries — eliminates unused bundle weight
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://*.razorpay.com",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'} https://checkout.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com`,
              "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
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

