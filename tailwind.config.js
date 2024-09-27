/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        prGray: '#dddddd',
        prDarkGray: '#707070',
        prWhite: '#f8f8f8',
        prBlack: '#0B0B0B',
      },
      fontFamily: {
        'roboto-mono': ['"Roboto Mono"', 'monospace'],
        'staatliches': ['"Staatliches"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
