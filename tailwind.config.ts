// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red:    { DEFAULT: '#C8102E', dark: '#9A0C23', darker: '#6B0819', light: '#FFF0F3', border: '#FFD6DC' },
        gold:   { DEFAULT: '#F5B800', dark: '#C49200' },
        green:  { DEFAULT: '#00873D', light: '#F0FFF8' },
        mpesa:  '#00A550',
        stripe: '#635BFF',
        paypal: '#003087',
        dark:   { DEFAULT: '#0F1117', 2: '#1A1D27', 3: '#242837' },
        gray:   {
          1: '#F8F9FB', 2: '#F1F3F6', 3: '#E4E7ED',
          4: '#CBD0DA', 5: '#9BA3AF', 6: '#6B7280', 7: '#374151',
        },
      },
      fontFamily: {
        sans:  ['var(--font-instrument)', 'sans-serif'],
        brand: ['var(--font-bricolage)',  'sans-serif'],
        mono:  ['var(--font-mono)',       'monospace'],
      },
      borderRadius: {
        xs: '7px', sm: '12px', md: '18px', lg: '24px',
      },
      boxShadow: {
        card:  '0 4px 20px rgba(0,0,0,.10)',
        dark:  '0 12px 40px rgba(0,0,0,.18)',
        red:   '0 6px 24px rgba(200,16,46,.28)',
      },
      animation: {
        'fade-in':    'fadeIn .3s ease',
        'slide-up':   'slideUp .3s cubic-bezier(.34,1.56,.64,1)',
        'pulse-slow': 'pulse 3s ease infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
