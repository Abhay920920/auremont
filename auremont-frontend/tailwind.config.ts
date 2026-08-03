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
        // Core Luxury Palette
        background: '#050505', // Deep matte black
        secondaryBg: '#0A0A0A', // Slightly lighter for surfaces
        surface: '#111111',     // For elevated cards
        
        // Typography
        primaryText: '#FAFAFA', // Ivory/Warm White
        secondaryText: '#A0A0A0', // Muted elegant gray
        mutedText: '#666666',
        
        // Brand Accents
        luxuryGold: '#D4AF37', // Champagne Gold
        goldHover: '#E5C15A',
        goldDark: '#A57C1B',   // Soft Bronze
        
        // Structural
        border: '#1A1A1A',
        divider: '#222222',
        
        // System
        success: '#2E7D32', // Forest Green accent
        warning: '#F57F17',
        error: '#D32F2F',
      },
      fontFamily: {
        serif: ['var(--font-cormorant-garamond)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
      },
      spacing: {
        // 8px system extended for extreme whitespace
        '18': '72px',
        '22': '88px',
        '30': '120px',
        '34': '136px',
        'super': '160px', // Massive section padding
      },
      borderRadius: {
        'btn': '2px', // Sharp, elegant
        'input': '2px',
        'card': '4px',
        'img': '4px',
      },
      letterSpacing: {
        widest: '.25em',
        superwide: '.35em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'image-scale': 'imageScale 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        imageScale: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}

export default config;
