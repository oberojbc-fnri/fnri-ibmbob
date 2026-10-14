/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0055a5',
        secondary: '#e8333a',
        accent: '#f5a623',
      },
      fontFamily: {
        sans: ['-apple-system', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  // Disable Tailwind's preflight — Ionic handles base styles
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
