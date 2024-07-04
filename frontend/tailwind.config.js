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
        green: "#13ce66",
        yellow: "#ffc82c",
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
