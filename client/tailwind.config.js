/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rtu: {
          deep: "#0a192f",
          orange: "#f97316",
          dark: "#112240",
          light: "#ccd6f6",
        }
      }
    },
  },
  plugins: [],
}
