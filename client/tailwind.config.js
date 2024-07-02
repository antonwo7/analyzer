/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx, ts}"],
  theme: {
    extend: {
      background: {
        'tr-hover': 'rgba(0, 84, 255, 0.2)',
      }
    }
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}

