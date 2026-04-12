/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        accent: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        dark: {
          50:  '#1e1e2e',
          100: '#13131a',
          200: '#0d0d14',
          300: '#0a0a0f',
        }
      },
      fontFamily: {
        gaming: ['Orbitron', 'sans-serif'],
        body:   ['Inter', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      animation: {
        'glow-pulse':    'glowPulse 2s ease-in-out infinite',
        'float':         'float 3s ease-in-out infinite',
        'fade-in-up':    'fadeInUp 0.6s ease-out forwards',
        'fade-in':       'fadeIn 0.8s ease-out forwards',
        'typewriter':    'typewriter 3s steps(40) forwards',
        'border-glow':   'borderGlow 2s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'shimmer':       'shimmer 2s infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99,102,241,0.5)' },
          '50%':      { boxShadow: '0 0 40px rgba(99,102,241,0.9), 0 0 80px rgba(168,85,247,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(99,102,241,0.5)' },
          '50%':      { borderColor: 'rgba(168,85,247,0.9)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid':       'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
        'neon-gradient':    'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05))',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'neon':       '0 0 20px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.3)',
        'neon-lg':    '0 0 30px rgba(99,102,241,0.7), 0 0 60px rgba(168,85,247,0.4)',
        'neon-cyan':  '0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.3)',
        'card':       '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(99,102,241,0.3)',
      },
    },
  },
  plugins: [],
}
