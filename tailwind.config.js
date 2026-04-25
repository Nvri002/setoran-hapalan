/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0',
          300: '#6ee7b7', 400: '#34d399', 500: '#10b981',
          600: '#059669', 700: '#047857', 800: '#065f46',
          900: '#064e3b', 950: '#022c22',
        },
        gold: {
          300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.45s cubic-bezier(.34,1.56,.64,1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in':   'scaleIn 0.35s cubic-bezier(.34,1.56,.64,1)',
        'shimmer':    'shimmer 1.6s infinite linear',
        'float':      'float 3s ease-in-out infinite',
        'spin-slow':  'spin 2s linear infinite',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
        'progress':   'progressFill 1s ease-out forwards',
        'toast-in':   'toastIn 0.35s cubic-bezier(.34,1.56,.64,1)',
        'toast-out':  'toastOut 0.25s ease-in forwards',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:     { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown:   { from: { opacity: 0, transform: 'translateY(-12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:     { from: { opacity: 0, transform: 'scale(.93)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
        bounceDot:   { '0%,80%,100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } },
        progressFill:{ from: { width: '0%' }, to: {} },
        toastIn:     { from: { opacity: 0, transform: 'translateX(110%)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        toastOut:    { from: { opacity: 1, transform: 'translateX(0)' }, to: { opacity: 0, transform: 'translateX(110%)' } },
        pulseRing:   { '0%': { transform: 'scale(.95)', boxShadow: '0 0 0 0 rgba(16,185,129,.5)' }, '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(16,185,129,0)' }, '100%': { transform: 'scale(.95)', boxShadow: '0 0 0 0 rgba(16,185,129,0)' } },
      },
    },
  },
  plugins: [],
}
