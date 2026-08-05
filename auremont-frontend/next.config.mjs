import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Synchronize generated luxury packaging images to public/images
const brainDir = "C:\\Users\\adts-\\.gemini\\antigravity-ide\\brain\\676ddd72-d9a9-4d0b-8640-752457094892";
const targetDir = path.join(__dirname, 'public', 'images');

const imageMappings = [
  { src: "california_almonds_pouch_front_1785905606676.png", dest: "california-almonds-250g.png" },
  { src: "roasted_almonds_glass_jar_1785905623854.png", dest: "roasted-almonds-jar.png" },
  { src: "royal_almonds_luxury_box_1785905637792.png", dest: "royal-almonds-wooden-box.png" },
  { src: "almonds_pouch_window_1785905653154.png", dest: "almonds-pouch-window.png" },
  { src: "luxury_gift_box_unboxing_1785905667489.png", dest: "luxury-gift-box-unboxing.png" },
  { src: "media__1785905539011.jpg", dest: "auremont-packaging-showcase.jpg" }
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

/** @type {import('next').NextConfig} */
const nextConfig = {
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

