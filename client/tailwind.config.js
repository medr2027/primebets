/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#16a34a',
          600: '#15803d',
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(15, 23, 42, 0.35)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.45 },
          '50%': { opacity: 1 },
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
