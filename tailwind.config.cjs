/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tdark': {
          '100': '#24232b',
          '200': '#18171f',
          '300': '#08070c',
        },
        'tgreen': '#a4ffaf',
        'tyellow': '#f4cb69'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
