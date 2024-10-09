/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "green": "#2AC311",
      "green-a50": "#2AC31180",
      "red": "#D52B2B",
      "black": "#000000",
      "white": "#FFFFFF",
      "grey": "#767575",
    },
    extend: {
      fontFamily: {
        "sfui": ["SFUI"],
        "sfui-medium": ["SFUI-Medium"],
        "sfui-bold": ["SFUI-Bold"],
        "sfui-light": ["SFUI-Light"],
        "sfui-semibold": ["SFUI-Semibold"]
      }
    },
  },
  plugins: [],
}

