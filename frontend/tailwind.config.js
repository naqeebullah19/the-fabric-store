/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7d2f3e',
          light: '#a85c6a',
          dark: '#54202b',
        },
        cream: '#f7f5f1',
      },
      fontFamily: {
        heading: ['"Fraunces"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
