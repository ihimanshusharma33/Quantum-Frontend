/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#1E2A4A',
          700: '#172242',
          800: '#111A36',
          900: '#0B1124',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
      },
    },
  },
  plugins: [],
};