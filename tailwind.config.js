/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
      colors: { ink: '#090d16', panel: '#111827', line: '#263244', mint: '#57e3b0' },
    },
  },
  plugins: [],
};
