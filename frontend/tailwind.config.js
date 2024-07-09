/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#3700B3",
        purple: "#6200EE",
        "purple-light": "#BB86FC",
        pink: "#ff49db",
        orange: "#ff7849",
        green: "#00ab41",
        "light-green": "#abf7b1",
        red: "#800000",
        "light-red": "#ff7f50",
        yellow: "#FFDB58",
        primary: "#121212",
        "gray-dark": "#292929",
        gray: "#989898",
        "gray-light": "#E2E2E2",
      },
    },
  },
  plugins: [],
  darkMode: "selector",
};
