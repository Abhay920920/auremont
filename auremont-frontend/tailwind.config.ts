import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Ultra Luxury Palette
        background: '#050505', // Deep matte black
        secondaryBg: '#0A0A0B', // Rich obsidian for surfaces
        surface: '#121213',     // Elevated card background
        surfaceHover: '#18181A',
        
        // Typography Tokens
        primaryText: '#FAF9F5', // Soft warm ivory
        secondaryText: '#A3A3A6', // Muted editorial gray
        mutedText: '#666668',   // Subtle caption gray
        
        // Brand Accents
        luxuryGold: '#D4AF37', // Champagne Gold
        goldHover: '#E8C55A',
        goldDark: '#8C6D31',   // Warm Bronze
        goldGlow: 'rgba(212, 175, 55, 0.15)',
        
        // Structural
        border: '#18181A',
        divider: '#222225',
        
        // System
        success: '#2E7D32',
        warning: '#F57F17',
        error: '#D32F2F',
      },
      fontFamily: {
        serif: ['var(--font-cormorant-garamond)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '30': '120px',
        '34': '136px',
        'super': '160px', // Ultra whitespace
        'hero': '200px',
      },
      borderRadius: {
        'btn': '2px',
        'input': '2px',
        'card': '4px',
        'img': '4px',
      },
      letterSpacing: {
        widest: '.25em',
        superwide: '.35em',
        ultra: '.45em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'image-scale': 'imageScale 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        imageScale: {
          '0%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}

export default config;
