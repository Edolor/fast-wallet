/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,tx,tsx}"
  ],
  theme: {
    fontFamily: {
      'serif': ['Merriweather'],
      'sans': ['Montserrat']
    },

    extend: {
      colors: {
        primary: "#066D5A",
        primaryLight: "#128973",
        primaryBackground: "#E0EEEB",
        google: "#EA4335"
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(18rem, 24rem))',
      }
    },
  },
  plugins: [],
}