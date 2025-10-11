/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable manual class switching
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // color tokens will come from CSS vars
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        sand: "var(--color-sand)",
        softwhite: "var(--color-softwhite)",
        cyan: "var(--color-cyan)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};