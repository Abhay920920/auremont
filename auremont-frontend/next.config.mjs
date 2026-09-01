import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Synchronize generated luxury RARE NUTS packaging images to public/images
// IMPORTANT: This block only runs locally. On Vercel the brain directory does not exist.
if (!process.env.VERCEL) {
  const brainDir = "C:\\Users\\adts-\\.gemini\\antigravity-ide\\brain\\05514b75-0c70-4bc6-837a-dfc08a7e4faf";
  const targetDir = path.join(__dirname, 'public', 'images');

  const imageMappings = [
    { src: "rarenuts_pouch_250g_1786340624218.png", dest: "california-almonds-250g.png" },
    { src: "rarenuts_roasted_jar_1786340636451.png", dest: "roasted-almonds-jar.png" },
    { src: "rarenuts_mahogany_chest_1786340649537.png", dest: "royal-almonds-wooden-box.png" },
    { src: "rarenuts_gift_unboxing_1786340665507.png", dest: "luxury-gift-box-unboxing.png" },
    { src: "rarenuts_window_pouch_1786340678242.png", dest: "almonds-pouch-window.png" },
    { src: "rarenuts_gift_unboxing_1786340665507.png", dest: "rarenuts-packaging-showcase.png" },
  ];

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    imageMappings.forEach(mapping => {
      const sourcePath = path.join(brainDir, mapping.src);
      const destPath = path.join(targetDir, mapping.dest);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      }
    });
  } catch (e) {
    // Ignore sync errors if paths missing
  }
}


/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

