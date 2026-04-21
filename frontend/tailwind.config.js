/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#faefd8',
          500: '#c47a2b',
          700: '#9a5c18',
          900: '#5c3410',
        },
      },
    },
  },
  plugins: [],
};
