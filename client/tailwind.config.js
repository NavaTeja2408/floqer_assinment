/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        sm: { min: "0px", max: "950px" },
        md: { min: "950px", max: "10000px" },
      },
    },
  },
  plugins: [],
};
