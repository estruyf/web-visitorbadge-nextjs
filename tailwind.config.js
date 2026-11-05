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
      heading: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
      body: ["'Instrument Sans'", "system-ui", "sans-serif"],
      mono: ["'JetBrains Mono'", "Menlo", "ui-monospace", "SFMono-Regular", "Monaco", "Consolas", "'Liberation Mono'", "'Courier New'", "monospace"],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      ink: {
        DEFAULT: '#132136',
        '50': '#F3F5F8',
        '100': '#E7EAEF',
        '200': '#D0D7E0',
        '300': '#A9B4C3',
        '400': '#7E8CA0',
        '500': '#56657C',
        '600': '#3C5270',
        '700': '#29405F',
        '800': '#1B2D48',
        '900': '#132136',
        '950': '#0C1626'
      },
      amber: {
        DEFAULT: '#F0B354',
        '50': '#FEF9EE',
        '100': '#FCF2E1',
        '200': '#F8DDB2',
        '300': '#F4C883',
        '400': '#F0B354',
        '500': '#EC9E25',
        '600': '#CC8312',
        '700': '#9D650E',
        '800': '#6E470A'
      },
      paper: {
        DEFAULT: '#FAF7F0',
        dark: '#F2EDE2'
      },
      line: '#E5DFD2',
      up: '#1A7F52',
      down: '#C2304B'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
