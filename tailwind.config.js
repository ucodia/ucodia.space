/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      width: {
        "1/10": "10%",
      },
      height: {
        "1/10": "10%",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
