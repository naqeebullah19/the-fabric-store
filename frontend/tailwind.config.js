/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8a2b3d', // deep maroon — fashion-forward, matches women's clothing branding
          light: '#b14a5e',
          dark: '#5f1c29',
        },
        cream: '#faf6f1',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
