const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}', 
    './lib/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      heading: ["'Baloo 2'", "cursive"],
      body: ["Montserrat", "sans-serif"]
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      green: {
        DEFAULT: '#40F99B'
      },
      yellow: {
        DEFAULT: '#F0B354',
        '50': '#FFFFFF',
        '100': '#FFFFFF',
        '200': '#FCF2E1',
        '300': '#F8DDB2',
        '400': '#F4C883',
        '500': '#F0B354',
        '600': '#EC9E25',
        '700': '#CC8312',
        '800': '#9D650E',
        '900': '#6E470A'
      },
      blue: {
        DEFAULT: '#132136',
        '50': '#668DC9',
        '100': '#537FC2',
        '200': '#3B66A7',
        '300': '#2E4F81',
        '400': '#20385C',
        '500': '#132136',
        '600': '#060A10',
        '700': '#000000',
        '800': '#000000',
        '900': '#000000'
      },
      teams: {
        DEFAULT: '#464775',
        '50': '#C5C5DC',
        '100': '#B5B5D2',
        '200': '#9596BF',
        '300': '#7576AC',
        '400': '#595A95',
        '500': '#464775',
        '600': '#333455',
        '700': '#202035',
        '800': '#0D0D15',
        '900': '#000000'
      }
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
