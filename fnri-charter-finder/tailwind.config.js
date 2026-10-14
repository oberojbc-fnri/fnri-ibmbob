/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  corePlugins: {
    // Disable Tailwind's preflight — Ionic handles CSS resets
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
