/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [],
  content: ["./App.{js,jsx,ts,tsx}", "./Components/**/*.{js,jsx,ts,tsx}","./Screens/**/*..{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      RubikM: ['Rubik-Medium'],
      RubikR: ['Rubik-Regular'],
      RubikL: ['Rubik-Light'],
      RubikB: ['Rubik-Bold'],
    }
  },
  plugins: [],
}

