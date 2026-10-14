/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary:  '#3949ab',
        'primary-cont': '#e8eaf6',
        secondary: '#c62828',
        surface:   '#f5f5f5',
        'on-surface': '#1c1b1f',
        success:  '#2e7d32',
        outline:  '#c4c7c5',
      },
      fontFamily: { sans: ['Roboto', 'sans-serif'] },
      borderRadius: { xl: '12px', '2xl': '16px', full: '9999px' },
    },
  },
  corePlugins: { preflight: false },
  plugins: [],
};
