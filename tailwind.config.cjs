/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#DD9933",
          100: "#DD99332C",
          200: "#DD993399",
          300: "#DD9933CC",
        },
        grey: {
          DEFAULT: "#585858",
          100: "#F8F8F8",
          200: "#E2E2E2",
          230: "#DADDD8",
          250: "#AAAAAA",
          300: "#B5B5B5",
          400: "#484A47",
        },
      },
    },
  },
  plugins: [],
};
