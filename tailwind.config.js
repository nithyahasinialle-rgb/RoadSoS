/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emergency: {
          red: '#DC2626',
          'red-light': '#EF4444',
          'red-dark': '#B91C1C',
          amber: '#D97706',
          'amber-light': '#F59E0B',
          green: '#16A34A',
          'green-light': '#22C55E',
        },
        surface: {
          DEFAULT: '#111111',
          card: '#1A1A1A',
          raised: '#222222',
          border: 'rgba(255,255,255,0.08)',
          'border-strong': 'rgba(255,255,255,0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulseRed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'glow-red': 'glowRed 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowRed: {
          from: { boxShadow: '0 0 10px rgba(220,38,38,0.3)' },
          to: { boxShadow: '0 0 30px rgba(220,38,38,0.7)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'radial-gradient(ellipse at top, #1a0505 0%, #0A0A0A 60%)',
      },
    },
  },
  plugins: [],
};
